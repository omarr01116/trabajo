import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function File() {
  const role = localStorage.getItem("userRole") || "usuario"; // admin o usuario
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

      setArchivos(data || []);
      setEstado(data && data.length > 0 ? "" : "📭 Sin archivos en esta semana/curso");
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
      <h1 className="text-3xl font-extrabold mb-4 text-indigo-600 text-center animate-pulse">📂 Gestión de Archivos</h1>

      <div className="row">
        {/* Subida de archivos - izquierda */}
        <div className="col-md-4 mb-3">
          <div className="card p-4 h-100 shadow-lg rounded-4" style={{ background: "#ffe4e1", border: "3px dashed #ff69b4" }}>
            <h4 className="card-title mb-3 text-center font-bold text-pink-600">🚀 Subir Trabajo</h4>

            <div className="mb-2">
              <label className="fw-bold">Curso</label>
              <select className="form-control rounded-pill" value={curso} onChange={(e) => setCurso(e.target.value)}>
                <option>Arquitectura de Software</option>
                <option>Machine Learning</option>
                <option>Inglés</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="fw-bold">Semana</label>
              <select className="form-control rounded-pill" value={semana} onChange={(e) => setSemana(e.target.value)}>
                <option>Semana 1</option>
                <option>Semana 2</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="fw-bold">Archivo</label>
              <input type="file" className="form-control rounded-pill" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <button onClick={handleUpload} className="btn btn-gradient w-100 py-2 fw-bold" style={{ background: "linear-gradient(to right, #ff7f50, #ff1493)", color: "white", fontSize: "1.1rem", borderRadius: "25px" }}>
              Subir
            </button>
            <p className="mt-2 text-info fw-bold">{estado}</p>
          </div>
        </div>

        {/* Lista de archivos - derecha */}
        <div className="col-md-8 mb-3">
          <div className="card p-4 h-100 shadow-lg rounded-4" style={{ background: "#f0fff0", border: "3px dashed #32cd32" }}>
            <h4 className="card-title mb-3 text-center font-bold text-green-700">📑 Archivos por curso y semana</h4>
            <table className="table table-hover table-bordered bg-white rounded-3">
              <thead className="table-light text-center">
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
                    <tr key={archivo.name} className="align-middle text-center">
                      <td>
                        <a href={publicUrl} target="_blank" rel="noreferrer" className="fw-bold text-decoration-none text-primary">{archivo.name}</a>
                      </td>
                      <td>
                        <a href={publicUrl} target="_blank" rel="noreferrer" className="btn btn-info btn-sm me-2 rounded-pill">Ver</a>
                        {role === "admin" && (
                          <>
                            <button className="btn btn-warning btn-sm me-2 rounded-pill" onClick={() => handleEdit(archivo)}>Editar</button>
                            <button className="btn btn-danger btn-sm rounded-pill" onClick={() => handleDelete(archivo)}>Borrar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {archivos.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center fw-bold">📭 No hay archivos en este curso/semana</td>
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
