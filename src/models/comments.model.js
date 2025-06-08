import mongoose, { Schema } from "mongoose";
const commmentSchema = new Schema({
    content:{
        type: String,
        required: true,
        index: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        required: true
    },
},{timestamps: true})
export const Comment = mongoose.model("Comment", commmentSchema)