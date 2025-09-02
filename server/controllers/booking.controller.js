import Stripe from "stripe";
import transporter from "../config/nodemailer.js";
import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
import Room from "../models/Room.model.js";

// Function to Check Availability
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    return bookings.length === 0;
  } catch (error) {
    console.error(error.message);
  }
};

// ✅ API: Check availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ API: Create Booking
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // Check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    const nights =
      Math.ceil(
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
          (1000 * 3600 * 24)
      ) || 1;

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      isPaid: false,
      paymentMethod: "Pending",
    });

    // Send Email (Pending until paid)
    const mailOptions = {
      from: `"QuickStay" <${process.env.SENDER_EMAIL}>`,
      to: req.user.email,
      subject: "Hotel Booking Created (Pending Payment)",
      html: `
        <h2>Your Booking Request</h2>
        <p>Dear ${req.user.username},</p>
        <p>We have reserved your booking. Please complete the payment to confirm.</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Check-In:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Check-Out:</strong> ${booking.checkOutDate.toDateString()}</li>
          <li><strong>Amount:</strong> ${
            process.env.CURRENCY || "USD"
          } ${booking.totalPrice}</li>
        </ul>
        <p>Status: <b>Pending Payment</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

// ✅ API: Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

// ✅ API: Get hotel bookings (for dashboard)
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      dashboardData: {
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((acc, b) => acc + b.totalPrice, 0),
        bookings,
      },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

// ✅ API: Stripe Payment
export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY || "usd",
            product_data: { name: roomData.hotel.name },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/loader/my-bookings`,
      cancel_url: `${req.headers.origin}/my-bookings`,
      metadata: { bookingId },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Payment Failed" });
  }
};
