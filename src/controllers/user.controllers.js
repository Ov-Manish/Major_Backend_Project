import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadFilesOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const userRegistration = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    // Check for empty fields
    if ([fullName, email, username, password].some(field => field?.trim() === "")) {
        throw new apiErrors(400, "Please fill all the fields ");
    }

    console.log("Data Coming from Frontend or Postman : ", req.body);

    // Check if user is already registered
    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    });

    // console.log("Existing User : " + userExist);

    if (userExist) {
        throw new apiErrors(403, "User is Already Exist! Try a different email and username");
    }

    // Get file paths
    const avatarLocationPath = req.files?.avatar[0]?.path;
    // const coverImageLocation = req.files?.coverImage[0]?.path;

    let coverImageLocation;

    if (req.files && Array.isArray(req.files.coverImageLocation) && req.files.coverImageLocation.length > 0   ) {
        coverImageLocation = req.files.coverImageLocation.path
    }

    // console.log("REQUEST.FILES : - >",req.files);
    

    // console.log("Avatar Location --> : ", avatarLocationPath);
    // console.log("Cover Image Location --> : ", coverImageLocation);

    // Check if avatar is uploaded
    if (!avatarLocationPath) {
        throw new apiErrors(400, "Avatar field is Required");
    }

    // Upload to Cloudinary
    const avatar = await uploadFilesOnCloudinary(avatarLocationPath);
    const coverImage = await uploadFilesOnCloudinary(coverImageLocation);

    // console.log("coverImage : ", coverImage);
    // console.log("avatar : ", avatar);

    // Check if avatar upload was successful
    if (!avatar) {
        throw new apiErrors(400, "Avatar upload failed");
    }

    // Create user object
    const userData = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    // console.log("userData : ", userData);

    // Fetch the created user
    const userIsCreated = await User.findById(userData._id).select("-password -refreshToken");

    // console.log("userIsCreated : ", userIsCreated);

    if (!userIsCreated) {
        throw new apiErrors(500, "Unable to create user during registration");
    }

    // Send the response
    return res.status(200).json(
        new apiResponse(200, userIsCreated, "User is created successfully")
    );
});

    // Method called for Generation access and Refresh Token by ID 
    
    const generateAccessAndRefreshToken = async (user_ID)=>{
        
        try {
            const userFoundById= await User.findById(user_ID);
            const accessToken = await userFoundById.genrateAccessToken();
            const refreshToken = await userFoundById.generateRefreshToken();

            //  Saving the refresh token :
            userFoundById.refreshToken = refreshToken;
            await userFoundById.save({validateBeforeSave : false})
            
            return {accessToken,refreshToken};

        } catch (error) {
            throw new apiErrors(500,"Unable to generate access and refresh token")
        }
    }


// Login User

const loggedInUser = asyncHandler(async (req,res)=>{
    // bring data from request body 
    // email or login based Access for Login
    // find user 
    // if user is not found
    // check password 
    // generate access Token and refresh token :
    //  send cookie 
    
    // bring data from request body : 
    const {username,fullName,password,email} = req.body;

    //  email or login based Access for Login :
    if (!(username || email)) {
        throw new apiErrors(400,"Please fill all Credentials");
    }

    //  find user :

    const userFound = await User.findOne({
        $or : [{username},{email}]
    })

    // if user is not  found :

    if (!userFound) {
        throw new apiErrors(404,"User does not Exist")
    }

    // check password :
    
    const validPassword= await userFound.isPasswordCorrect(password);

    if (!validPassword) {
        throw new apiErrors(400," Invalid user Credentials")
    }
     
     // generate access Token and refresh token :
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(userFound._id);


    //  Send data in cookies :

   const userIsLogged= await User.findById(userFound._id).select("-password -refreshToken");

   const cookieOptions={
        httpOnly: true,
        secure : true
   }

   return res.status(200)
   .cookie("accessToken",accessToken,cookieOptions)
   .cookie("refreshToken",refreshToken,cookieOptions)
   .json(new apiResponse(200,{//if user wants to save theses token on perticular location 
    user : userIsLogged, accessToken,refreshToken
   },"User is Successful Logged In "))

})

//  Logout User :

const loggedOutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )
    const cookieOptions={
        httpOnly: true,
        secure : true
   }

   return res.status(200)
   .clearCookie("accessToken", cookieOptions)
   .clearCookie("refreshToken", cookieOptions)
   .json(new apiResponse(200,{}, "User Logged Out Successfully"))
})

export { userRegistration , loggedInUser, loggedOutUser };
