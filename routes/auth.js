const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { body, query, validationResult } = require("express-validator");

const router = express.Router();

// Créer le transporteur email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// POST /api/auth/send-magic-link
// Envoie un lien magique à l'email fourni
router.post("/send-magic-link",
    [
        body("email").isEmail().withMessage("Email invalide"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email } = req.body;

            // Créer ou retrouver l'utilisateur
            let user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                user = new User({ email: email.toLowerCase() });
            }

            // Générer un token aléatoire
            const magicToken = crypto.randomBytes(32).toString("hex");
            user.magicToken = magicToken;
            user.magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
            await user.save();

            // Construire le lien
            const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${magicToken}&email=${encodeURIComponent(user.email)}`;

            // Envoyer l'email
            await transporter.sendMail({
                from: `"Suivi Véhicule" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: "Votre lien de connexion",
                html: `
        <h2>Connexion à Suivi Véhicule</h2>
        <p>Cliquez sur le lien ci-dessous pour vous connecter :</p>
        <p><a href="${magicLink}" style="
          display: inline-block;
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 6px;
        ">Se connecter</a></p>
        <p>Ce lien expire dans 15 minutes.</p>
        <p>Si vous n'avez pas demandé ce lien, ignorez cet email.</p>
      `,
            });

            res.json({ message: "Lien magique envoyé ! Vérifiez votre boîte email." });
        } catch (err) {
            console.error("Erreur send-magic-link :", err);
            res.status(500).json({ error: "Erreur serveur" });
        }
    });

// GET /api/auth/verify?token=xxx&email=xxx
// Vérifie le token et retourne un JWT
router.get("/verify",
    [
        query("email").isEmail().withMessage("Email invalide"),
        query("token").isHexadecimal().withMessage("Token invalide"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { token, email } = req.query;

            const user = await User.findOne({
                email: { $eq: email.toLowerCase() },
                magicToken: { $eq: token },
                magicTokenExpires: { $gt: new Date() },
            });

            if (!user) {
                return res.status(401).json({ error: "Lien invalide ou expiré" });
            }

            // Invalider le token (usage unique)
            user.magicToken = null;
            user.magicTokenExpires = null;
            await user.save();

            // Générer un JWT de session (7 jours)
            const jwtToken = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Rediriger vers le frontend avec le token
            res.redirect(
                `${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}&email=${encodeURIComponent(user.email)}`
            );
        } catch (err) {
            console.error("Erreur verify :", err);
            res.status(500).json({ error: "Erreur serveur" });
        }
    });

// GET /api/auth/me — retourne l'utilisateur connecté
router.get("/me", auth, async (req, res) => {
    res.json({ email: req.userEmail });
});

module.exports = router;