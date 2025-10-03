import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";

export default function File() {
  const [user, setUser] = useState(null);
  const [archivos, setArchivos] = useState([]);

  useEffect(() => {
    // Traemos el usuario logueado del localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (!user) return <p className="p-6">Acceso denegado. Por favor inicia sesión.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard: {user.role}</h1>

      {/* Solo admin y usuario pueden subir archivos */}
      {user.role !== "invitado" && (
        <FileUpload
          user={user}
          onFileUploaded={(nuevo) => setArchivos([...archivos, nuevo])}
        />
      )}

      {/* Lista de archivos */}
      <h2 className="text-xl font-semibold mt-6">Archivos públicos</h2>
      <ul className="space-y-2 mt-2">
        {archivos.map((f) => (
          <li key={f.id} className="flex justify-between items-center p-2 border rounded-lg">
            <a href={f.url} target="_blank" rel="noopener noreferrer">
              {f.nombre}
            </a>
            {user.role === "admin" && (
              <button
                onClick={() => setArchivos(archivos.filter(a => a.id !== f.id))}
                className="ml-2 text-red-600 hover:underline"
              >
                Borrar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
