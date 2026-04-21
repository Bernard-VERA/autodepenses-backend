const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

// Champs autorisés pour création / modification
const allowedFields = [
    "date",
    "mileage",
    "categoryId",
    "label",
    "amount",
    "supplier",
    "comment"
];

// Fonction utilitaire pour filtrer req.body
function filterBody(body) {
    const filtered = {};
    for (const key of allowedFields) {
        if (body[key] !== undefined) {
            filtered[key] = body[key];
        }
    }
    return filtered;
}

// GET /api/expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }).sort({
            date: -1,
        });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST /api/expenses
router.post("/", async (req, res) => {
    try {
        const data = filterBody(req.body);

        const expense = new Expense({
            ...data,
            userId: req.userId,
            vehicleId: req.body.vehicleId, // autorisé uniquement à la création
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/expenses/:id
router.put("/:id", async (req, res) => {
    try {
        const updates = filterBody(req.body);

        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updates,
            { new: true }
        );

        if (!expense) return res.status(404).json({ error: "Dépense non trouvée" });
        res.json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/expenses/:id
router.delete("/:id", async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!expense) return res.status(404).json({ error: "Dépense non trouvée" });
        res.json({ message: "Dépense supprimée" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
