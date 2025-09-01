import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);
// bookingRouter.post("/stripe-payment", protect, stripePayment);

export default bookingRouter;
