// routes/bookingRoute.js
import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';
import { clerkMiddleware } from '@clerk/express';

const bookingRouter = express.Router();

bookingRouter.post('/create', clerkMiddleware(), createBooking);  // Added clerkMiddleware
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;