import express from "express";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

const router = express.Router();

const trabajos = []; // Simulamos una base de datos por ahora

// GET /api/works -> lista de trabajos (público)
router.get("/works", (req, res) => {
  res.json(trabajos);
});

// POST /api/works -> subir nuevo trabajo (solo admin)
router.post("/works", verificarToken, soloAdmin, (req, res) => {
  const { titulo, descripcion, archivo } = req.body;

  if (!titulo || !archivo) {
    return res.status(400).json({ error: "Título y archivo son requeridos" });
  }

  const nuevoTrabajo = {
    id: trabajos.length + 1,
    titulo,
    descripcion,
    archivo,
    creadoPor: req.user.email,
  };

  trabajos.push(nuevoTrabajo);
  res.json({ mensaje: "Trabajo agregado", trabajo: nuevoTrabajo });
});

export default router;