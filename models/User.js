import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    magicToken: { type: String, default: null },
    magicTokenExpires: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
