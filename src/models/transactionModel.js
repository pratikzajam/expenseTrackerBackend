import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ["salary", "freelance", "rent", "groceries", "entertainment", "investment", "other"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
    },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction
