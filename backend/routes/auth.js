import express from "express";
import { z } from "zod";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// 📌 Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// 📌 Ruta POST /api/login
router.post("/login", async (req, res) => {
  try {
    // 1️⃣ Validar datos
    const { email, password } = loginSchema.parse(req.body);

    // 2️⃣ Autenticar con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // 3️⃣ Obtener rol desde la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: "No se pudo obtener el rol" });
    }

    // 4️⃣ Responder con el token y el rol
    res.json({
      token: data.session.access_token,
      role: profile.role,
      user: { id: data.user.id, email: data.user.email },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
