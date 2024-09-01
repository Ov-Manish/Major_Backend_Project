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

export { userRegistration };
