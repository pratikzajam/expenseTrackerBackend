import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    },
});


export const User = mongoose.model('User', userSchema);

