import mongoose,{Schema} from "mongoose";

const tweetSchems= new Schema(
    {
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        content :{
            type : String,
            required : true
        }
    },
    {timestamps : true}
)