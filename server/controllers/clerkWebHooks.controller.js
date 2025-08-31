import User from "../models/user.model.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    //create a svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //verify headers

    await whook.verify(JSON.stringify(req.body), headers);

    //getting data from request body

    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      username: data.first_name + " " + data.last_name,
      email: data.email_addresses[0].email_address,
      image: data.image_url,
    };

    //switch cases for different event

    switch (type) {
      case "user.created":
        {
          await User.create(userData);
          break;
        }

      case "user.updated":
        {
         await User.findByIdAndUpdate(data._id, userData);
         break;
        }

        case "user.deleted":
        {
         await User.findByIdAndDelete(data._id);
         break;
        }

      default:
        break;
    }

    res.json({
      status: "success",
      message: "WebHook received successfully",
    })
  } catch (error) {
    console.log(error.message);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

export default clerkWebHooks;
