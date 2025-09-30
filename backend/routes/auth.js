import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

const router = express.Router();

// 📌 Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["usuario", "admin"]),
});

// Ruta POST /api/login
router.post("/login", async (req, res) => {
  try {
    // 1️⃣ Validar datos
    const { email, password, role } = loginSchema.parse(req.body);

    // 2️⃣ Aquí deberíamos consultar Supabase, pero por ahora simulamos
    const fakeUser = {
      email: "admin@test.com",
      passwordHash: await bcrypt.hash("123456", 10),
      role: "admin",
    };

    if (email !== fakeUser.email) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(password, fakeUser.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    if (role !== fakeUser.role) {
      return res.status(403).json({ error: "Rol no autorizado" });
    }

    // 3️⃣ Generar token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET || "secreto", {
      expiresIn: "1h",
    });

    res.json({ token, role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;