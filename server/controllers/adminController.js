// controllers/adminController.js
import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";  // ← ADD THIS
import Show from "../models/Show.js";
import User from "../models/User.js";


// API to check if user is admin
export const isAdmin = async (req, res) => {
  try {
    const userId = req.auth?.userId;  // ← Fixed

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.privateMetadata?.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, isAdmin: true });
  } catch (error) {
    console.error("isAdmin error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const totalUsers = await User.countDocuments();
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.price || 0), 0);

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue,
      activeShows,           
      totalUsers,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("getDashboardData error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    res.json({ success: true, shows });
  } catch (error) {
    console.error("getAllShows error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId")
      .populate({
        path: "showId",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("getAllBookings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};