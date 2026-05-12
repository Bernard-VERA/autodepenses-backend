import jwt from "jsonwebtoken";

export default function auth(req, res, next) {

    // ⭐ Laisser passer les requêtes OPTIONS (préflight CORS)
    if (req.method === "OPTIONS") {
        return next();
    }

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant" });
    }

    try {
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
}

