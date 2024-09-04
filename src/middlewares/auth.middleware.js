import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/ApiErrors.js";


export const userlogOutJwt= asyncHandler(async(req,res,next)=>{

       try {
         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
 
         if (!token) {
             throw new apiErrors(401,"Unauthorized Acess");
         }
 
         const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
         const user =await User.findById(decodedToken._id).select("-password -refreshToken");
 
 
         if (!user) {
             throw new apiErrors(401,"Invalid Access Token")
         }
 
         // if we got the user then -->
 
         req.user = user;
         next();
       } catch (error) {
            throw new apiErrors(401,error?.message || "Invalid Acess Token")
       }
})

