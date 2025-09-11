// main.js — maneja index, semana, login y subida simulada

// Helpers
async function loadServerData() {
  try {
    const res = await axios.get("js/data.json");
    return res.data.semanas || {};
  } catch (e) {
    console.error("No se pudo cargar js/data.json:", e);
    return {};
  }
}

function getLocalUploads() {
  const raw = localStorage.getItem("uploadedFiles");
  return raw ? JSON.parse(raw) : {}; // { "1": [ {nombre, archivo(dataURL), tipo} ] }
}

function saveLocalUploads(obj) {
  localStorage.setItem("uploadedFiles", JSON.stringify(obj));
}

// Index: listar semanas
async function renderIndex() {
  const el = document.getElementById("weeksList");
  if (!el) return;
  const server = await loadServerData();
  const local = getLocalUploads();

  // union de keys
  const weeks = new Set([...Object.keys(server), ...Object.keys(local)]);
  if (weeks.size === 0) {
    el.innerHTML = "<p>No hay semanas definidas.</p>";
    return;
  }

  let html = "<ul>";
  Array.from(weeks).sort((a,b) => a-b).forEach(w => {
    const countServer = (server[w]||[]).length;
    const countLocal = (local[w]||[]).length;
    const total = countServer + countLocal;
    html += `<li>
      <a href="semana.html?semana=${w}">Semana ${w}</a>
      <span>${total} archivo(s)</span>
    </li>`;
  });
  html += "</ul>";
  el.innerHTML = html;
}

// Semana: mostrar archivos de esa semana
async function renderSemana() {
  const el = document.getElementById("listaTrabajos");
  const title = document.getElementById("tituloSemana");
  if (!el || !title) return;

  const params = new URLSearchParams(window.location.search);
  const semana = params.get("semana") || "1";
  title.textContent = `Trabajos - Semana ${semana}`;

  const server = await loadServerData();
  const local = getLocalUploads();

  const items = [...(server[semana]||[]), ...(local[semana]||[])];

  if (items.length === 0) {
    el.innerHTML = "<p>No hay trabajos para esta semana.</p>";
    return;
  }

  let html = "<ul>";
  items.forEach((t, idx) => {
    // if file is local (dataURL) we can't use download attr for docx reliably; still provide link
    if (t.tipo === "pdf") {
      html += `<li>
        <div>
          <strong>📄 ${t.nombre}</strong>
        </div>
        <div>
          <a href="${t.archivo}" target="_blank">Ver</a>
          &nbsp;|&nbsp;
          <a href="${t.archivo}" download>Descargar</a>
        </div>
      </li>`;
    } else if (t.tipo === "word") {
      html += `<li>
        <div><strong>📝 ${t.nombre}</strong></div>
        <div><a href="${t.archivo}" download>Descargar (Word)</a></div>
      </li>`;
    } else if (t.tipo === "image") {
      html += `<li>
        <div><strong>🖼 ${t.nombre}</strong></div>
        <div><a href="${t.archivo}" target="_blank">Abrir imagen</a></div>
      </li>`;
    } else {
      html += `<li><div><strong>${t.nombre}</strong></div><div><a href="${t.archivo}" target="_blank">Abrir</a></div></li>`;
    }
  });
  html += "</ul>";
  el.innerHTML = html;
}

// Login (simulado)
function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("mensaje");

    if (usuario === "estudiante" && password === "123") {
      window.location.href = "estudiante.html";
    } else {
      msg.textContent = "Credenciales incorrectas. Usa estudiante / 123";
    }
  });
}

// Logout
function logout() {
  window.location.href = "index.html";
}

// Panel estudiante: subir archivo (simulado, guarda en localStorage como dataURL)
function setupStudentUpload() {
  const form = document.getElementById("uploadForm");
  if (!form) return;
  const status = document.getElementById("localUploads");
  const refreshLocalList = () => {
    const local = getLocalUploads();
    const html = Object.keys(local).sort((a,b)=>a-b).map( s => {
      const items = local[s];
      return `<h4>Semana ${s} (${items.length})</h4>` + items.map(i=>`<div>• ${i.nombre}</div>`).join("");
    }).join("");
    status.innerHTML = html || "No hay subidas locales.";
  };
  refreshLocalList();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const week = document.getElementById("semana").value;
    const fileInput = document.getElementById("archivo");
    if (!fileInput.files.length) return alert("Selecciona un archivo.");

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(ev) {
      const dataURL = ev.target.result;
      let tipo = "word";
      if (file.type === "application/pdf") tipo = "pdf";
      else if (file.type.startsWith("image/")) tipo = "image";

      const local = getLocalUploads();
      if (!local[week]) local[week] = [];
      local[week].push({
        nombre: file.name,
        archivo: dataURL,
        tipo
      });
      saveLocalUploads(local);
      alert("Archivo guardado localmente (prueba). Para hacerlo permanente, copie el archivo en 'archivos/semanaX' y actualice js/data.json en el repo.");
      refreshLocalList();
      form.reset();
    };
    reader.readAsDataURL(file);
  });
}

// Auto-run based on page
document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  const path = window.location.pathname;
  if (path.endsWith("index.html") || path === "/" || path.endsWith("/mis-chambas/")) {
    renderIndex();
  }
  if (path.endsWith("semana.html")) {
    renderSemana();
  }
  if (path.endsWith("estudiante.html")) {
    setupStudentUpload();
  }
});
