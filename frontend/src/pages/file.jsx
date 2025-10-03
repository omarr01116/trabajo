import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function File() {
  const role = localStorage.getItem("userRole"); // rol del usuario
  const userId = localStorage.getItem("userId"); // opcional para filtrar archivos del usuario
  const [file, setFile] = useState(null);
  const [curso, setCurso] = useState("");
  const [semana, setSemana] = useState("");
  const [archivos, setArchivos] = useState([]);

  // Obtener archivos desde Storage
  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from("archivos").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) throw error;

      setArchivos(data);
    } catch (err) {
      console.error("Error al obtener archivos:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Subir archivo
  const handleUpload = async () => {
    if (!file || !curso || !semana) {
      alert("Selecciona archivo, curso y semana");
      return;
    }

    const fileName = `${curso}_Semana${semana}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("archivos")
      .upload(fileName, file);

    if (error) {
      console.error("Error al subir archivo:", error);
      alert("Error al subir archivo");
      return;
    }

    alert("Archivo subido correctamente");
    setFile(null);
    setCurso("");
    setSemana("");
    fetchFiles();
  };

  // Borrar archivo (solo admin)
  const handleDelete = async (archivo) => {
    if (role !== "admin") return;

    const { error } = await supabase.storage.from("archivos").remove([archivo.name]);
    if (error) {
      console.error("Error al borrar archivo:", error);
      alert("Error al eliminar archivo");
      return;
    }

    alert("Archivo eliminado");
    fetchFiles();
  };

  // Editar archivo (solo admin, placeholder)
  const handleEdit = (archivo) => {
    if (role !== "admin") return;

    alert(`Aquí se abriría la funcionalidad de edición para: ${archivo.name}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Archivos</h1>

      {/* Formulario de subida */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Subir archivo</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <input
          type="text"
          placeholder="Curso"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          className="border px-2 py-1 mb-2"
        />
        <input
          type="text"
          placeholder="Semana"
          value={semana}
          onChange={(e) => setSemana(e.target.value)}
          className="border px-2 py-1 mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Subir
        </button>
      </div>

      {/* Lista de archivos */}
      <div>
        <h2 className="font-semibold mb-2">Archivos subidos</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2">Nombre</th>
              <th className="border px-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((archivo) => {
              const { publicURL } = supabase.storage
                .from("archivos")
                .getPublicUrl(archivo.name);

              return (
                <tr key={archivo.name}>
                  <td className="border px-2">{archivo.name}</td>
                  <td className="border px-2 space-x-2">
                    <a
                      href={publicURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      Ver
                    </a>
                    {role === "admin" && (
                      <>
                        <button
                          onClick={() => handleEdit(archivo)}
                          className="text-yellow-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(archivo)}
                          className="text-red-600"
                        >
                          Borrar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default File;
