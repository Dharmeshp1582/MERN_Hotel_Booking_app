import User from "../models/user.model.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    // Create svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Collect headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify payload (returns the actual JSON body)
    const payload = await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = payload;

    const userData = {
      _id: data.id, // Clerk user ID as Mongo _id
      username: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      image: data.image_url,
    };

    // Handle events
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log("Unhandled event:", type);
        break;
    }

    res.json({
      status: true,
      message: "✅ Webhook received successfully",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export default clerkWebHooks;
