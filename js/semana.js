import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Configuración Supabase
const SUPABASE_URL = "https://bazwwhwjruwgyfomyttp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhend3aHdqcnV3Z3lmb215dHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNjA1NTAsImV4cCI6MjA3MzczNjU1MH0.RzpCKpYV-GqNIhTklsQtRqyiPCGGmVlUs7q_BeBHxUo";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 📌 Obtener número de semana desde la URL
const params = new URLSearchParams(window.location.search);
const semanaNumero = params.get("semana") || "1";

// 👇 importante: slash final
const carpeta = `Semana ${semanaNumero}/`;

// Mostrar título
document.getElementById("tituloSemana").textContent = `Trabajos - Semana ${semanaNumero}`;

const listaArchivos = document.getElementById("listaArchivos");
const previewDiv = document.getElementById("preview");

// 📂 Función para listar archivos recursivamente (subcarpetas incluidas)
async function listarArchivosRecursivo(path = carpeta) {
  const { data, error } = await supabase.storage
    .from("archivos")
    .list(path, { limit: 100 });

  if (error) {
    console.error("❌ Error al listar:", error.message);
    return [];
  }

  let archivos = [];

  for (const item of data) {
    if (item.metadata && item.metadata.is_directory) {
      // Si es carpeta → buscar dentro
      const subPath = `${path}${item.name}/`;
      const subArchivos = await listarArchivosRecursivo(subPath);
      archivos = archivos.concat(subArchivos);
    } else {
      archivos.push({ path, name: item.name });
    }
  }

  return archivos;
}

// 📂 Cargar archivos de esa semana
async function cargarArchivos() {
  console.log(`📂 Buscando archivos en carpeta: "${carpeta}"`);

  listaArchivos.innerHTML = `
    <div class="col-12 text-center text-muted">
      <p>⏳ Cargando archivos...</p>
    </div>
  `;

  const archivos = await listarArchivosRecursivo();

  listaArchivos.innerHTML = "";

  if (archivos.length === 0) {
    listaArchivos.innerHTML = `
      <div class="col-12 text-center text-muted">
        <p>⚠️ No hay archivos en la carpeta "${carpeta}".</p>
      </div>
    `;
    return;
  }

  for (const file of archivos) {
    const { data: urlData } = supabase.storage
      .from("archivos")
      .getPublicUrl(`${file.path}${file.name}`);

    const verUrl = urlData?.publicUrl || "#";
    const descargarUrl = `${verUrl}?download=${file.name}`;

    const col = document.createElement("div");
    col.className = "col-12";

    col.innerHTML = `
      <div class="card p-2 text-center shadow-sm">
        <h6 class="card-title text-truncate" title="${file.name}">${file.name}</h6>
        <div class="d-grid gap-1 mt-2">
          <button class="btn btn-primary btn-sm ver-btn">👁 Vista previa</button>
          <a href="${descargarUrl}" class="btn btn-success btn-sm">⬇ Descargar</a>
        </div>
      </div>
    `;

    col.querySelector(".ver-btn").addEventListener("click", () => {
      mostrarPreview(verUrl, file.name);
    });

    listaArchivos.appendChild(col);
  }
}

// 📌 Mostrar vista previa según tipo de archivo
function mostrarPreview(url, name) {
  let previewContent = "";

  if (name.endsWith(".pdf")) {
    previewContent = `<iframe src="${url}" class="w-100" height="600" title="Vista previa PDF"></iframe>`;
  } else if (name.match(/\.(jpg|jpeg|png|gif)$/i)) {
    previewContent = `<img src="${url}" class="img-fluid rounded shadow" alt="Vista previa">`;
  } else if (name.match(/\.(mp4|webm)$/i)) {
    previewContent = `<video src="${url}" controls class="w-100 rounded shadow"></video>`;
  } else if (name.match(/\.(docx|doc|pptx|ppt|xlsx|xls)$/i)) {
    previewContent = `<iframe src="https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true" class="w-100" height="600" title="Vista previa Office"></iframe>`;
  } else if (name.endsWith(".txt")) {
    previewContent = `<iframe src="${url}" class="w-100" height="600" title="Vista previa TXT"></iframe>`;
  } else {
    previewContent = `
      <div class="text-center text-muted">
        📄 No hay vista previa disponible para este archivo.<br>
        <a href="${url}" target="_blank" class="btn btn-primary mt-3">Abrir archivo</a>
      </div>
    `;
  }

  previewDiv.innerHTML = previewContent;
}

// 🚀 Ejecutar
cargarArchivos();
