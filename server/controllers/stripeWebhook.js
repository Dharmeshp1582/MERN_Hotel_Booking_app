import Stripe from "stripe";
import Booking from "../models/booking.model.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Stripe Webhooks
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { bookingId } = session.metadata;

    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });

    console.log(`✅ Booking ${bookingId} marked as paid`);
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
