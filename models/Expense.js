const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    date: { type: String, required: true },
    mileage: { type: Number, default: 0 },
    categoryId: { type: String, required: true },
    label: { type: String, default: "" },
    amount: { type: Number, required: true },
    supplier: { type: String, default: "" },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expenseSchema);