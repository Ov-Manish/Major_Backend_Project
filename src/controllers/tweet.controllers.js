import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import { apiErrors } from "../utils/ApiErrors.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

//  tweet creation :
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content,owner} = req.body
    console.log(content,owner);
    


    if (content?.trim() === "") {
        throw new apiErrors(400, "Tweet is Empty");
    }

    if (!isValidObjectId(req.user)) {
        throw new apiErrors(400, "Invalid User");
    }

    const user = await User.findById(req.user);
    console.log(user);
    
    if (!user) {
        throw new apiErrors(400, "User not found");
    }
    
    const Tweets = await Tweet.create({
        content :content,
        owner : req.user?._id
    });

    return res.status(200)
            .json(new apiResponse(200,Tweets, "Tweet Created Successfully"))

})
    // getting tweets which are made by user    
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;
    if (!userId) {
        throw new apiErrors(400,"User is not Present")
    }

//     validating user
    
    if (!isValidObjectId(req.user?._id)) {
        throw new apiErrors(400,"User is not found")
    }

    
//  finding User tweets he Write
    const tweets = await Tweet.find(req.user?.owner);
   
    
    if (!tweets) {
        throw new apiErrors(401,"Tweets are not Available")
    }
    // sending response
    return res.status(200)
    .json(new apiResponse(200,tweets,"Tweets fetched Successfully"))

    
})

// Updating Tweets 
const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body;
    const {tweetId} = req.params;
    
    
    console.log(content);
    
    if (!content) {
        throw new apiErrors(400,"No Tweets are Available")
    }

    if (!isValidObjectId(req.user)) {

        throw new apiErrors(400,"User is not present in the Database");
        
    }
    
    const updateuserTweets = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set : {
                content
            }
        },
        {new : true}
    )
    console.log(updateuserTweets);

    updateuserTweets.content = content

    updateuserTweets.save({validateBeforeSave : false})



return res
.status(200)
.json(new apiResponse(200,updateuserTweets,"Tweets are Updated Successfully"))


})



//  Deleting Tweets from Database 
const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    console.log(tweetId);
    console.log("User Id -->",req.user._id);
    

    if (!tweetId) {
        throw new apiErrors(400,"Invalid User");
    }

    if (!isValidObjectId(tweetId)) {
        throw new apiErrors(404,"Invalid User")
    }

    const deleteTweets = await Tweet.findByIdAndDelete(req.params._id);
    // console.log(deleteTweets);
    // console.log(req.user?._id);
    
    
    if (!deleteTweets) {
        throw new apiErrors(400, "No Tweets are Available in the Database");
    }

    return res.status(200)
    .json(new apiResponse(200,deleteTweets,"Tweets deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}