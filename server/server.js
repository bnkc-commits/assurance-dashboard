const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const authRoutes = require("./auth");
const PDFDocument = require("pdfkit");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("client"));
app.use("/api", authRoutes);

const { authMiddleware } = require("./auth");

// Ajout prospect
app.post("/api/prospect", authMiddleware, async (req, res) => {
  const { name, request } = req.body;
  await db.query(
    "INSERT INTO prospects (name, request, created_by) VALUES ($1,$2,(SELECT id FROM users WHERE email=$3))",
    [name, request, req.user.email]
  );
  await db.query("INSERT INTO logs (action, user_email) VALUES ($1,$2)", ["new_prospect", req.user.email]);
  io.emit("new_prospect", { name, request });
  res.json({ status: "prospect enregistré" });
});

// Logs agent
app.get("/api/logs", authMiddleware, async (req, res) => {
  if (req.user.role !== "agent" && req.user.role !== "admin") return res.status(403).json({ error: "Accès refusé" });
  const result = await db.query("SELECT * FROM logs ORDER BY timestamp DESC");
  res.json(result.rows);
});

// Génération PDF
app.get("/api/print", authMiddleware, async (req, res) => {
  if (req.user.role !== "agent" && req.user.role !== "admin") return res.status(403).json({ error: "Accès refusé" });
  const result = await db.query("SELECT * FROM prospects ORDER BY created_at DESC");
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Registre des Prospects", { align: "center" });
  doc.moveDown();

  result.rows.forEach((p, i) => {
    doc.fontSize(12).text(`${i+1}. Nom: ${p.name} | Demande: ${p.request} | Date: ${p.created_at}`);
  });

  doc.end();
});

// WebRTC signalisation
io.on("connection", (socket) => {
  console.log("Nouvelle connexion");
  socket.on("signal", (data) => {
    socket.broadcast.emit("signal", data);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
