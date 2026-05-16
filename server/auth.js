const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const router = express.Router();

const SECRET = "supersecret";

// Inscription apporteur
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (name, email, password_hash, role, status) VALUES ($1,$2,$3,$4,$5)",
    [name, email, hashed, role || "apporteur", "pending"]
  );
  res.json({ status: "registered, en attente de validation" });
});

// Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Utilisateur inconnu" });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });
  if (user.status !== "active") return res.status(403).json({ error: "Compte non validé" });
  const token = jwt.sign({ email: user.email, role: user.role }, SECRET);
  res.json({ token });
});

// Validation par admin
router.post("/validate", async (req, res) => {
  const { email } = req.body;
  await db.query("UPDATE users SET status='active' WHERE email=$1", [email]);
  res.json({ status: "Utilisateur validé" });
});

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token manquant" });
  try {
    const decoded = jwt.verify(header.split(" ")[1], SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
}

module.exports = router;
module.exports.authMiddleware = authMiddleware;
