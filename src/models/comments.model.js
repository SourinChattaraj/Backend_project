import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
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
commmentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model("Comment", commmentSchema)