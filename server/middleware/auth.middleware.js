

//Middleware to check user is authenticated

import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
   const {userId} = req.auth;
   if(!userId){
      return res.status(401).json({
         success: false,
         message: 'User is not authenticated'
      })
   }else{
    const user = await User.findById(userId);
    req.user = user;
    next();
   }
}