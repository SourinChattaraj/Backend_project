import mongoose, { Schema } from "mongoose";
const playlistSchema = new Schema({

    name:{
        type:String,
        required: true,
        unique: true,
    },
     description:{
        type:String,
    },

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videos:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true
        }
    ]
},{timestamps: true})

export const Playlist = mongoose.model("Playlist",playlistSchema)