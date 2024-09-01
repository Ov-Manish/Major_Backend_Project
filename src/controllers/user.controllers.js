// importing the asyncHandler wrapper for user controllers
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiErrors} from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"
import {uploadFilesOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import { json } from "express";
const userRegistration= asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:'user routes are working fine !!!'
    })

    // Steps for creating registration :
    // - get user details from frontend :
    // - validation not empty :
    // - check if user is already registerd or not :
    // - check imgaes, check avatar :
    // - upload them to cloudinary,avatar :
    // - create user object [save them to database] :
    // - remove password and refresh token from response :
    // check if the user is created or not :
    // if [Yes ] then responed or [No] return Error :

    const {fullName,email,username,password} = req.body


    // applying chekcs for empty fields :
    if([fullName,email,username,password].some((fields)=>
        fields?.trim()===""
    )){
        throw new apiErrors(400,"Please fill all the fields ")
    }

    console.log("Data Coming from Frontend or Postman : ",req.body);

    // Check 2 : user is already registered or not :

    const userExist = User.findOne({
        $or : [{username},{email}]
    })
    console.log("Exixting User : " + userExist);
    
    
    if(userExist){
        throw new apiErrors('403',"User is Already Exist ! try diifrent email and username")
    }
    
    const avatarLocationPath = req.files?.avatar[0]?.path;

    console.log("Avatar Location --> : ",avatarLocationPath);

    const coverImageLocation = req.files?.avatar[0]?.path

    console.log("CoverImage Location --> : ",coverImageLocation);

    // Check 3 : Avatar is uploaded or not :

    if (!avatarLocationPath) {
        throw new apiErrors(400," Avatar field is Required")
    }

    //  Uploading to the Cludinary :

    const avatar = await uploadFilesOnCloudinary(avatarLocationPath);
    const coverImage = await uploadFilesOnCloudinary(coverImageLocation);
    console.log("avatar : ",avatar);
    
    //  Another Avatar Check :

    if (!avatar) {
        throw new apiErrors(400,"Avatar field is Required")
    }

    // Creating user Object :

    const userData= await User.create({
        username : username.toLowerCase(),
        email,
        fullName,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })

    console.log("userData : ",userData);
    
    // Removing Password  and Token fields from response :

    const userIsCreated = await User.findById(User._id).select(
        "-password -refreshToken"
    )

    console.log("userIsCreated : ",userIsCreated);
    
    
    if (!userIsCreated) {
        throw new apiErrors(500,"Unavailable to Created user during registration ") //available
    }
    

    // Sending the Structured Manner Response : 

    return res.status(200),json(
        new apiResponse(200,userIsCreated,"User is created successfully")
    )
    
    
})


export {userRegistration};