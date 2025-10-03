import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario"); // rol seleccionado en frontend
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Login con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error Supabase:", error);
        alert("❌ Error al conectar con Supabase: " + error.message);
        return;
      }

      if (!data.session) {
        alert("❌ No se pudo obtener sesión de Supabase");
        return;
      }

      const token = data.session.access_token;
      console.log("TOKEN DE SUPABASE:", token);

      // 2️⃣ Llamar al backend en Render
      const resp = await fetch(
        "https://trabajo-backend.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, password }), // enviamos email y password
        }
      );

      const json = await resp.json();

      if (resp.ok) {
        // ✅ Compara el rol devuelto con el seleccionado en frontend
        if (json.role !== role) {
          alert(`⚠️ Rol seleccionado: ${role}. Tu rol real: ${json.role}`);
        } else {
          alert(`✅ Login exitoso con rol: ${json.role}`);
        }

        navigate("/file"); // Redirigir a file.jsx
      } else {
        console.error("Error backend:", json);
        alert("❌ Login fallido: " + (json.error || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert(
        "❌ No se pudo conectar con el backend. Revisa tu internet o CORS."
      );
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
