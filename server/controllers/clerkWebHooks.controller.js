import User from "../models/user.model.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    // Create a svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Collect headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify payload (returns the actual JSON body)
    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    const userData = {
      _id: data.id, // Clerk user ID as Mongo _id
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
      recentSearchedCities: [], // Provide default empty array
    };

    // Handle events
    switch (type) {
      case "user.created": {
        const existingUser = await User.findById(data.id);
        if (!existingUser) {
          await User.create(userData);
        } else {
          console.log(`User with ID ${data.id} already exists. Skipping creation.`);
        }
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    res.json({
      success: true,
      message: "✅ Webhook received successfully",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebHooks;
