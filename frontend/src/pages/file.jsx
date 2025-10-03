import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function File() {
  const role = localStorage.getItem("userRole") || "usuario"; // rol del usuario
  const [archivo, setArchivo] = useState(null);
  const [curso, setCurso] = useState("Arquitectura de Software");
  const [semana, setSemana] = useState("Semana 1");
  const [archivos, setArchivos] = useState([]);
  const [estado, setEstado] = useState("");

  // 📂 Cargar archivos de Supabase Storage
  const cargarArchivos = async (cursoSeleccionado, semanaSeleccionada) => {
    setArchivos([]);
    setEstado("⏳ Cargando archivos...");

    const { data, error } = await supabase.storage
      .from("archivos")
      .list(`${cursoSeleccionado}/${semanaSeleccionada}`, { limit: 100 });

    if (error) {
      setEstado("❌ Error al listar archivos: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setEstado("📭 Sin archivos");
      return;
    }

    // Obtener URLs públicas
    const archivosConUrl = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("archivos")
        .getPublicUrl(`${cursoSeleccionado}/${semanaSeleccionada}/${file.name}`);
      return {
        name: file.name,
        url: urlData.publicUrl,
        fecha: new Date(parseInt(file.name.split("_")[0])).toLocaleString(),
        path: `${cursoSeleccionado}/${semanaSeleccionada}/${file.name}`,
      };
    });

    setArchivos(archivosConUrl);
    setEstado("");
  };

  useEffect(() => {
    cargarArchivos(curso, semana);
  }, [curso, semana]);

  // 🔼 Subir archivo
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setEstado("⚠️ Selecciona un archivo");
      return;
    }

    setEstado("⏳ Subiendo...");
    const timestamp = Date.now();
    const filePath = `${curso}/${semana}/${timestamp}_${archivo.name}`;

    const { error } = await supabase.storage
      .from("archivos")
      .upload(filePath, archivo);

    if (error) {
      setEstado("❌ Error al subir archivo: " + error.message);
      return;
    }

    setEstado("✅ Archivo subido correctamente");
    setArchivo(null);
    cargarArchivos(curso, semana);
  };

  // 🗑️ Eliminar archivo (solo admin)
  const handleDelete = async (path) => {
    if (role !== "admin") return;
    const { error } = await supabase.storage.from("archivos").remove([path]);
    if (error) {
      alert("❌ Error al eliminar archivo: " + error.message);
    } else {
      alert("✅ Archivo eliminado");
      cargarArchivos(curso, semana);
    }
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">📂 Gestión de Archivos</h2>

      {/* Formulario de subida */}
      <div className="row mb-6">
        <div className="col-md-5">
          <form onSubmit={handleUpload}>
            <div className="form-group mb-2">
              <label>Curso</label>
              <select
                className="form-control"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
              >
                <option>Arquitectura de Software</option>
                <option>Machine Learning</option>
                <option>Inglés</option>
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Semana</label>
              <select
                className="form-control"
                value={semana}
                onChange={(e) => setSemana(e.target.value)}
              >
                <option>Semana 1</option>
                <option>Semana 2</option>
                <option>Semana 3</option>
                <option>Semana 4</option>
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Archivo</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setArchivo(e.target.files[0])}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              <i className="icon-upload"></i> Subir
            </button>
            <p className="mt-2">{estado}</p>
          </form>
        </div>

        {/* Lista de archivos */}
        <div className="col-md-7">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {archivos.length === 0 && (
                <tr>
                  <td colSpan="3">{estado || "📭 Sin archivos"}</td>
                </tr>
              )}
              {archivos.map((file) => (
                <tr key={file.path}>
                  <td>
                    <a href={file.url} target="_blank" rel="noreferrer">
                      {file.name}
                    </a>
                  </td>
                  <td>{file.fecha}</td>
                  <td>
                    {role === "admin" && (
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(file.path)}
                      >
                        <i className="icon-trash"></i> Borrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default File;
