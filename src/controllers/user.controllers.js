// importing the asyncHandler wrapper for user controllers
import { asyncHandler } from "../utils/asyncHandler.js";

const userRegistration= asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:'user routes are working fine !!!'
    })
})


export {userRegistration};