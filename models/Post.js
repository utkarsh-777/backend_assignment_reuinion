import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types;

const PostSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    files: [{
        type: String,
    }],
    location: {
        type:String,
    },
    comments: [
        {
            comment: {
                type: String,
            },
            commentBy: {
                type: ObjectId,
                ref: "User"
            },
        }
    ],
    likes: [
        {
            type:ObjectId,
            ref: "User"
        }
    ],
    unlikes: [
        {
            type:ObjectId,
            ref: "User"
        }
    ],
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
},{timestamps: true});

export default mongoose.model("Post",PostSchema);