import User from "../models/user.model.js";
import Hotel from "../models/hotel.model.js";

export const registerHotel = async (req,res) => {
  try {
    const {name,address, contact, city} = req.body;
    const owner = req.user._id;

    //check if hotel already exists
    const hotel = await Hotel.findOne({name});
    if(hotel){
      return res.json({
        success: false,
        message: "Hotel already exists"
      })
    }

    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner
    })
     await User.findByIdAndUpdate(owner,{role: "hotelOwner"})

    res.json({
      success: true,
      message: "Hotel registered successfully"
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}