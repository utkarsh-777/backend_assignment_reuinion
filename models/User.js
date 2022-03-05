import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types;

const UserSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
    },
    followers: [
        {
            type:ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: ObjectId,
            ref: "User",
        }
    ],
    lastLogin: {
        type: Date,
    },
    resetToken: {
        type: String,
    },
    expireToken: {
        type: String,
    },
},{timestamps: true});

export default mongoose.model("User",UserSchema);