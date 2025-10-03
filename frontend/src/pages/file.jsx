import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function File() {
  const role = localStorage.getItem("userRole") || "usuario"; // "admin" o "usuario"
  const [curso, setCurso] = useState("Arquitectura de Software");
  const [semana, setSemana] = useState("Semana 1");
  const [file, setFile] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [estado, setEstado] = useState("");

  // 📂 Listar archivos
  const cargarArchivos = async () => {
    setEstado("⏳ Cargando archivos...");
    try {
      const { data, error } = await supabase.storage
        .from("archivos")
        .list(`${curso}/${semana}`, { limit: 100 });

      if (error) throw error;

      setArchivos(data);
      if (!data || data.length === 0) {
        setEstado("📭 Sin archivos en esta semana/curso");
      } else {
        setEstado("");
      }
    } catch (err) {
      console.error(err);
      setEstado("❌ Error al obtener archivos");
    }
  };

  useEffect(() => {
    cargarArchivos();
  }, [curso, semana]);

  // 🔼 Subir archivo
  const handleUpload = async () => {
    if (!file) {
      setEstado("⚠️ Selecciona un archivo");
      return;
    }
    setEstado("⏳ Subiendo...");
    const timestamp = Date.now();
    const filePath = `${curso}/${semana}/${timestamp}_${file.name}`;
    const { error } = await supabase.storage.from("archivos").upload(filePath, file);
    if (error) {
      console.error(error);
      setEstado("❌ Error al subir archivo");
      return;
    }
    setEstado("✅ Archivo subido");
    setFile(null);
    cargarArchivos();
  };

  // 🗑️ Borrar archivo (solo admin)
  const handleDelete = async (archivo) => {
    if (role !== "admin") return;
    const { error } = await supabase.storage.from("archivos").remove([`${curso}/${semana}/${archivo.name}`]);
    if (error) {
      alert("❌ Error al eliminar: " + error.message);
    } else {
      alert("✅ Archivo eliminado");
      cargarArchivos();
    }
  };

  // ✏️ Editar archivo (solo admin)
  const handleEdit = (archivo) => {
    if (role !== "admin") return;
    alert(`Aquí se abriría la funcionalidad de edición para: ${archivo.name}`);
  };

  return (
    <div className="container py-4">
      <h1 className="text-2xl font-bold mb-4">📂 Gestión de Archivos</h1>

      <div className="row">
        {/* Columna izquierda - Subida de archivos */}
        <div className="col-md-4 mb-3">
          <div className="card p-3 h-100">
            <h4 className="card-title mb-3">🚀 Subir Trabajo</h4>

            <div className="mb-2">
              <label>Curso</label>
              <select className="form-control" value={curso} onChange={(e) => setCurso(e.target.value)}>
                <option>Arquitectura de Software</option>
                <option>Machine Learning</option>
                <option>Inglés</option>
              </select>
            </div>

            <div className="mb-2">
              <label>Semana</label>
              <select className="form-control" value={semana} onChange={(e) => setSemana(e.target.value)}>
                <option>Semana 1</option>
                <option>Semana 2</option>
              </select>
            </div>

            <div className="mb-2">
              <label>Archivo</label>
              <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <button onClick={handleUpload} className="btn btn-primary mt-2 w-100">Subir</button>
            <p className="mt-2 text-info">{estado}</p>
          </div>
        </div>

        {/* Columna derecha - Lista de archivos */}
        <div className="col-md-8 mb-3">
          <div className="card p-3 h-100">
            <h4 className="card-title mb-3">📑 Archivos por curso y semana</h4>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {archivos.map((archivo) => {
                  const { publicUrl } = supabase.storage
                    .from("archivos")
                    .getPublicUrl(`${curso}/${semana}/${archivo.name}`);
                  return (
                    <tr key={archivo.name}>
                      <td>
                        <a href={publicUrl} target="_blank" rel="noreferrer">{archivo.name}</a>
                      </td>
                      <td>
                        <a href={publicUrl} target="_blank" rel="noreferrer" className="btn btn-info btn-sm me-2">Ver</a>
                        {role === "admin" && (
                          <>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(archivo)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(archivo)}>Borrar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {archivos.length === 0 && (
                  <tr>
                    <td colSpan="2">📭 No hay archivos en este curso/semana</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default File;
