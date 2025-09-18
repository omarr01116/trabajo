import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Configuración Supabase
const SUPABASE_URL = "https://bazwwhwjruwgyfomyttp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 📌 Obtener número de semana desde la URL
const params = new URLSearchParams(window.location.search);
const semanaNumero = params.get("semana") || "1";
const carpeta = `Semana ${semanaNumero}`;

// Mostrar título
document.getElementById("tituloSemana").textContent = `Trabajos - ${carpeta}`;

const listaArchivos = document.getElementById("listaArchivos");
const previewDiv = document.getElementById("preview");

// 📂 Cargar archivos de esa semana
async function cargarArchivos() {
  console.log(`📂 Buscando archivos en carpeta: "${carpeta}"`);

  const { data, error } = await supabase.storage
    .from("archivos")
    .list(carpeta, { limit: 100 });

  listaArchivos.innerHTML = "";

  if (error) {
    listaArchivos.innerHTML = `
      <div class="col-12 text-center text-danger">
        <p>❌ Error al listar: ${error.message}</p>
      </div>
    `;
    return;
  }

  if (!data || data.length === 0) {
    listaArchivos.innerHTML = `
      <div class="col-12 text-center text-muted">
        <p>⚠️ No hay archivos en la carpeta "${carpeta}".</p>
      </div>
    `;
    return;
  }

  for (const file of data) {
    const { data: urlData } = supabase.storage
      .from("archivos")
      .getPublicUrl(`${carpeta}/${file.name}`);

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

    // 📌 Evento para mostrar preview
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
    previewContent = `<iframe src="${url}" title="Vista previa PDF"></iframe>`;
  } else if (name.match(/\.(jpg|jpeg|png|gif)$/i)) {
    previewContent = `<img src="${url}" class="img-fluid rounded shadow" alt="Vista previa">`;
  } else if (name.match(/\.(mp4|webm)$/i)) {
    previewContent = `<video src="${url}" controls class="w-100 rounded shadow"></video>`;
  } else if (name.match(/\.(docx|doc|pptx|ppt|xlsx|xls)$/i)) {
    previewContent = `<iframe src="https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true" title="Vista previa Office"></iframe>`;
  } else if (name.endsWith(".txt")) {
    previewContent = `<iframe src="${url}" title="Vista previa TXT"></iframe>`;
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

cargarArchivos();
