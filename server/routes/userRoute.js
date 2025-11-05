// routes/userRoute.js
import express from "express";
import { getUserBookings, updateFavorite, getFavorites } from "../controllers/userController.js";
import { clerkMiddleware } from "@clerk/express";

const userRouter = express.Router();

userRouter.use(clerkMiddleware());

userRouter.get("/bookings", getUserBookings);
userRouter.post("/favorite", updateFavorite);
userRouter.get("/favorites", getFavorites);

export default userRouter;