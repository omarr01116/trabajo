import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js"; // 👈 Importamos la ruta
import worksRoutes from "./routes/works.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", authRoutes);
app.use("/api", worksRoutes);
// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});