import express from "express";
import { z } from "zod";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Autenticar con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || "Login fallido" });
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

    // Devolver token y rol al frontend
    res.json({
      token: data.session.access_token,
      role: profile.role || "usuario",
      user: { id: data.user.id, email: data.user.email },
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
