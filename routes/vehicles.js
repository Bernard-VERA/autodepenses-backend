const express = require("express");
const Vehicle = require("../models/Vehicle");
const auth = require("../middleware/auth");

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(auth);

// GET /api/vehicles
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.userId }).sort({
            createdAt: -1,
        });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST /api/vehicles
router.post("/", async (req, res) => {
    try {
        const vehicle = new Vehicle({ ...req.body, userId: req.userId });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/vehicles/:id
router.put("/:id", async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!vehicle) return res.status(404).json({ error: "Véhicule non trouvé" });
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/vehicles/:id
router.delete("/:id", async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!vehicle) return res.status(404).json({ error: "Véhicule non trouvé" });
        res.json({ message: "Véhicule supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;