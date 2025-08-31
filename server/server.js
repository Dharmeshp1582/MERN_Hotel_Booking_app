import express from 'express'
import "dotenv/config";
import cors from "cors";
import bodyParser from 'body-parser';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebHooks.controller.js';
import userRouter from './routes/user.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/room.route.js';

const app = express()

await connectDB();
connectCloudinary();

app.use(cors()) //enable cross-origin resource sharing
app.use(express.json());
app.use(bodyParser.json());
app.use(clerkMiddleware())

// api to listen to webhooks
app.use("/api/clerk",clerkWebHooks)



const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is working")
})
app.use("/api/user",userRouter)
app.use("/api/hotels",hotelRouter)
app.use("/api/rooms",roomRouter)

app.listen(PORT,() => {
  console.log(`server is running at port ${PORT}`)
})