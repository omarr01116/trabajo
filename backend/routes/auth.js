import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// POST /api/login usando token del frontend
router.post("/login", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    // Validar token con Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    // Obtener rol desde tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: "No se pudo obtener el rol" });
    }

    // Responder con token y rol
    res.json({
      token,
      role: profile.role || "usuario",
      user: { id: data.user.id, email: data.user.email },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
