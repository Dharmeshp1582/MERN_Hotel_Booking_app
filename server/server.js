import express from 'express'
import "dotenv/config";
import cors from "cors";
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebHooks.controller.js';

const app = express()

await connectDB(); 
app.use(express.json());
app.use(cors()) //enable cross-origin resource sharing
app.use(clerkMiddleware())

//API to listen clerk webhooks 
app.use("/api/clerk",clerkWebHooks);


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is working")
})

app.listen(PORT,() => {
  console.log(`server is running at port ${PORT}`)
})