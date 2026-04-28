import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    year: { type: Number, default: null },
    purchaseDate: { type: String, default: "" },
    purchasePrice: { type: Number, default: 0 },
    initialMileage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vehicle", vehicleSchema);
