import Booking from "../models/booking.model.js";


//Function to check availability of room
export const checkAvailability = async ({checkIn,checkOut,room}) => {
  try {
    const bookings = await Booking.find({room,
      checkInDate:{$lte:checkOutDate},
      checkOutDate:{$gte:checkInDate}
    })
    
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error.message)
  }
};