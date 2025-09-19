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

// 📂 Cargar archivos de esa semana
async function cargarArchivos() {
  console.log(`📂 Buscando archivos en carpeta: "${carpeta}"`);

  listaArchivos.innerHTML = `
    <div class="col-12 text-center text-muted">
      <p>⏳ Cargando archivos...</p>
    </div>
  `;

  const { data, error } = await supabase.storage
    .from("archivos")
    .list(carpeta, { limit: 100 });

  console.log("✅ Archivos encontrados:", data, error);

  if (error) {
    listaArchivos.innerHTML = `<p class="text-danger">❌ Error: ${error.message}</p>`;
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

  listaArchivos.innerHTML = "";

  data.forEach((file) => {
    const { data: urlData } = supabase.storage
      .from("archivos")
      .getPublicUrl(`${carpeta}${file.name}`);

    const verUrl = urlData?.publicUrl || "#";

    const col = document.createElement("div");
    col.className = "col-12";

    col.innerHTML = `
      <div class="card p-2 text-center shadow-sm">
        <h6 class="card-title text-truncate" title="${file.name}">${file.name}</h6>
        <div class="d-grid gap-1 mt-2">
          <a href="${verUrl}" target="_blank" class="btn btn-primary btn-sm">👁 Ver archivo</a>
          <a href="${verUrl}?download=${file.name}" class="btn btn-success btn-sm">⬇ Descargar</a>
        </div>
      </div>
    `;

    listaArchivos.appendChild(col);
  });
}

// 🚀 Ejecutar
cargarArchivos();
