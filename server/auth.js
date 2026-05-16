// Inscription apporteur
router.post("/register", async (req, res) => {
  const { name, username, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (name, username, password_hash, role, status) VALUES ($1,$2,$3,$4,$5)",
    [name, username, hashed, role || "apporteur", "pending"]
  );
  res.json({ status: "registered, en attente de validation" });
});

// Connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Utilisateur inconnu" });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });
  if (user.status !== "active") return res.status(403).json({ error: "Compte non validé" });
  const token = jwt.sign({ username: user.username, role: user.role }, SECRET);
  res.json({ token });
});

// Validation par admin
router.post("/validate", async (req, res) => {
  const { username } = req.body;
  await db.query("UPDATE users SET status='active' WHERE username=$1", [username]);
  res.json({ status: "Utilisateur validé" });
});
