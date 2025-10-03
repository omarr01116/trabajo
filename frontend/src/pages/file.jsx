import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function File() {
  const role = localStorage.getItem("userRole"); // rol del usuario (usuario/admin)
  const userId = localStorage.getItem("userId"); // opcional para filtrar archivos del usuario
  const [file, setFile] = useState(null);
  const [curso, setCurso] = useState("");
  const [semana, setSemana] = useState("");
  const [archivos, setArchivos] = useState([]);

  // Obtener archivos desde Supabase
  const fetchFiles = async () => {
    try {
      let { data, error } = await supabase
        .from("archivos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setArchivos(data);
    } catch (err) {
      console.error(err);
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

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from("archivos") // nombre del bucket
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Error al subir archivo");
      return;
    }

    // Guardar metadata en tabla 'archivos'
    const { error: dbError } = await supabase.from("archivos").insert([
      {
        name: file.name,
        path: data.path,
        curso,
        semana,
        owner_id: userId || "desconocido",
      },
    ]);

    if (dbError) {
      console.error(dbError);
      alert("Error al guardar info del archivo");
      return;
    }

    alert("Archivo subido correctamente");
    setFile(null);
    fetchFiles();
  };

  // Borrar archivo (solo admin)
  const handleDelete = async (archivo) => {
    if (role !== "admin") return;

    const { error } = await supabase.storage
      .from("archivos")
      .remove([archivo.path]);

    if (error) {
      console.error(error);
      alert("Error al eliminar archivo");
      return;
    }

    await supabase.from("archivos").delete().eq("id", archivo.id);
    fetchFiles();
  };

  // Editar archivo (solo admin)
  const handleEdit = (archivo) => {
    if (role !== "admin") return;

    alert(`Aquí se abriría la funcionalidad de edición para: ${archivo.name}`);
    // Por ahora solo un placeholder
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
              <th className="border px-2">Curso</th>
              <th className="border px-2">Semana</th>
              <th className="border px-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((archivo) => (
              <tr key={archivo.id}>
                <td className="border px-2">{archivo.name}</td>
                <td className="border px-2">{archivo.curso}</td>
                <td className="border px-2">{archivo.semana}</td>
                <td className="border px-2 space-x-2">
                  <a
                    href={`https://your-supabase-url/storage/v1/object/public/archivos/${archivo.path}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default File;
