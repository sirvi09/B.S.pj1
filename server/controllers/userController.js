import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth.userId;  // Fixed: req.auth() → req.auth

        const bookings = await Booking.find({ user })
            .populate({
                path: "show",
                populate: { path: "movie" }
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth.userId;  // Fixed: req.auth() → req.auth

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorite) {
            user.privateMetadata.favorite = [];
        }

        if (!user.privateMetadata.favorite.includes(movieId)) {
            user.privateMetadata.favorite.push(movieId);
        } else {
            user.privateMetadata.favorite = user.privateMetadata.favorite.filter(item => item !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: user.privateMetadata
        });

        res.json({ success: true, message: "Favourite movies updated." });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth.userId);  // Fixed: req.auth() → req.auth
        const favorites = user.privateMetadata.favorite || [];  // Fixed: .favorites → .favorite

        // Getting movies from database
        const movies = await Movie.find({ _id: { $in: favorites } });  // Fixed: Movie({_id...}) → find()

        res.json({ success: true, movies });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}