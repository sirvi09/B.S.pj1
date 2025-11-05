// controllers/bookingController.js
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats.get(seat));
        return !isAnySeatTaken;

    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth;  // Fixed: req.auth() → req.auth
        const { showId, selectedSeats } = req.body;

        // check if the seats are available for the selected time 
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected seats are not available." });
        }

        // get the show details 
        const showData = await Show.findById(showId).populate('movie');

        // create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        });

        selectedSeats.forEach((seat) => {
            showData.occupiedSeats.set(seat, userId);  
        });

        showData.markModified('occupiedSeats');
        await showData.save();

        // stripe gateway initialize

        res.json({ success: true, message: 'Booked successfully' });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });  // Fixed: duplicate message
    }
}

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    if (!showData) {
      return res.json({ success: false, message: "Show not found" });
    }

    // Return seats where value (userId) exists
    const occupiedSeats = Array.from(showData.occupiedSeats.entries())
      .filter(([_, userId]) => !!userId) // keep seats with a userId
      .map(([seat]) => seat); // return seat names only

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

