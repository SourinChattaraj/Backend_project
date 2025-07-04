import mongoose, { Schema } from "mongoose";
const tweetSchema = new Schema({

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content:{
        type: String,
        required: true,
        maxlength: 280, // Twitter's character limit
    }

},{timestamps: true})
export const Tweet = mongoose.model("Tweet", tweetSchema);
