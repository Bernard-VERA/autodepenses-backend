import express from "express";
import Vehicle from "../models/Vehicle.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(auth);

// Champs autorisés pour création / modification
const allowedFields = [
    "name",
    "brand",
    "model",
    "year",
    "purchaseDate",
    "purchasePrice",
    "initialMileage"
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
        const data = filterBody(req.body);
        const vehicle = new Vehicle({ ...data, userId: req.userId });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/vehicles/:id
router.put("/:id", async (req, res) => {
    try {
        const updates = filterBody(req.body);

        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updates,
           { returnDocument: "after" }
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

export default router;
