import express from 'express'
import "dotenv/config";
import cors from "cors";

const app = express()

app.use(cors()) //enable cross-origin resource sharing
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is working")
})

app.listen(PORT,() => {
  console.log(`App run at port ${PORT}`)
})