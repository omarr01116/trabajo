import React, { useState } from "react";
import { supabase } from "../supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario"); // valor por defecto

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Error: " + error.message);
      return;
    }

    // 2️⃣ Obtener token de sesión de Supabase
    const token = data.session.access_token;

    // 3️⃣ Llamar al backend con el token
    const resp = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 pasamos el JWT
      },
      body: JSON.stringify({ email, role }),
    });

    const json = await resp.json();

    // 4️⃣ Manejo de respuesta
    if (resp.ok) {
      if (json.role !== role) {
        alert(`⚠️ Rol incorrecto. Tu rol real es: ${json.role}`);
        return;
      }

      alert("✅ Login exitoso con rol: " + json.role);

      // 5️⃣ Ejemplo: llamar a ruta protegida
      const res2 = await fetch("http://localhost:3000/api/works", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data2 = await res2.json();
      console.log("📂 Respuesta protegida:", data2);
    } else {
      alert("❌ Login fallido: " + (json.error || "Error desconocido"));
    }
  };

  return (
    <div className="py-20 px-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Iniciar Sesión
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* Selector de rol (lo comparamos con el real en Supabase) */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="admin">Admin</option>
            <option value="usuario">Usuario</option>
            <option value="invitado">Invitado</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
