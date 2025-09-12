<?php
// semana.php

// ===============================
// Configuración de la BD
// ===============================
$servername = "sql202.infinityfree.com";
$username   = "if0_39921547_mi_bd";
$password   = "OxvjSj9Pcb";
$database   = "if0_39921547_mi_bd";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// ===============================
// Validar parámetro semana
// ===============================
if (!isset($_GET['semana'])) {
    die("No se ha especificado una semana.");
}

$rawSemana = trim($_GET['semana']);

// Si el usuario pasó solo un número (ej. ?semana=1), convertir a "semana1".
// Si ya pasó "semana1", usar tal cual.
if (ctype_digit($rawSemana)) {
    $nombreSemana = "semana" . intval($rawSemana);
} else {
    // normalizar: quitar espacios y a minúsculas
    $nombreSemana = strtolower($rawSemana);
}

// ===============================
// Consulta: tomamos los archivos de la tabla 'archivos' filtrando por a.semana
// Usamos LEFT JOIN con 'trabajos' por si quieres mostrar metadatos adicionales
// ===============================
$sql = "
  SELECT
    a.id AS archivo_id,
    a.nombre_archivo,
    a.ruta,
    a.tipo,
    a.semana AS archivo_semana,
    a.fecha_subida,
    t.id AS trabajo_id,
    t.id_usuario,
    t.fecha AS trabajo_fecha
  FROM archivos a
  LEFT JOIN trabajos t ON a.nombre_archivo = t.archivo
  WHERE a.semana = ?
  ORDER BY a.fecha_subida DESC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Error al preparar consulta: " . $conn->error);
}
$stmt->bind_param("s", $nombreSemana);
$stmt->execute();
$result = $stmt->get_result();
$rows = $result->fetch_all(MYSQLI_ASSOC);

$stmt->close();
$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Archivos de <?php echo htmlspecialchars($nombreSemana); ?></title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

  <style>
    /* Fondo y tipografía */
    body {
      background: linear-gradient(135deg, #0d0d0d, #141414);
      color: #e6f7f1;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 100vh;
    }

    /* Línea superior neon */
    .top-line {
      height: 4px;
      background: linear-gradient(90deg, #00ff00, cyan, magenta, #00ff00);
      box-shadow: 0 0 20px #00ff00, 0 0 40px cyan, 0 0 60px magenta;
    }

    /* Header */
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin: 28px 0;
    }
    h2 {
      margin: 0;
      font-size: 2rem;
      color: #00ff00;
      text-shadow: 0 0 15px #00ff00, 0 0 35px cyan;
      animation: glow 2s infinite alternate;
    }
    @keyframes glow {
      from { text-shadow: 0 0 10px #00ff00, 0 0 20px cyan; }
      to   { text-shadow: 0 0 25px #00ff00, 0 0 45px cyan; }
    }

    /* Botón volver */
    .btn-back {
      border: 1px solid rgba(0,255,255,0.7);
      color: rgba(0,255,255,0.9);
      background: rgba(0,0,0,0.25);
      padding: 8px 14px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 0 8px rgba(0,255,255,0.06);
      transition: all .18s ease;
    }
    .btn-back:hover {
      background: #00ff00;
      color: #000;
      box-shadow: 0 0 22px #00ff00;
    }

    /* Grid de tarjetas */
    .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
      margin-top: 18px;
    }

    /* Tarjeta individual */
    .file-card {
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
      border-radius: 14px;
      padding: 18px;
      text-align: center;
      box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0 18px rgba(0,255,128,0.06);
      border: 1px solid rgba(0,255,0,0.12);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 150px;
    }
    .file-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 28px rgba(0,0,0,0.75), 0 0 28px #00ff00, 0 0 48px cyan;
    }

    /* Icono grande según tipo (estilo simple) */
    .file-icon {
      font-size: 44px;
      color: #00ff00;
      filter: drop-shadow(0 0 8px rgba(0,255,0,0.25));
      margin-bottom: 6px;
    }

    .file-name {
      font-weight: 700;
      color: #dfffe8;
      text-shadow: 0 0 8px rgba(0,255,255,0.06);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .file-info {
      font-size: 0.9rem;
      color: #bcd;
    }

    /* Botones */
    .actions { margin-top: auto; display:flex; gap:8px; justify-content:center; }
    .btn-view {
      background: rgba(0,255,255,0.06);
      border: 1px solid rgba(0,255,255,0.4);
      color: #0ff;
      padding: 8px 12px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      transition: all .15s;
    }
    .btn-view:hover { background: #0ff; color:#000; box-shadow:0 0 18px #0ff; }

    .btn-download {
      background: linear-gradient(90deg, #00ff00, #a8ff00);
      border: none;
      color: #000;
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: 700;
      box-shadow: 0 0 14px rgba(0,255,0,0.18);
    }
    .btn-download:hover {
      background: magenta;
      color: #fff;
      box-shadow: 0 0 26px magenta;
    }

    /* Mensaje vacío */
    .alert-neon {
      background: rgba(0,255,0,0.03);
      border: 1px solid rgba(0,255,0,0.12);
      color: #a7ffb3;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 0 12px rgba(0,255,0,0.06);
    }

    /* Responsive tweaks */
    @media (max-width: 480px) {
      .file-name { font-size: 0.95rem; }
      .file-icon { font-size: 36px; }
    }
  </style>
</head>
<body>
  <div class="top-line"></div>

  <div class="container mt-4">
    <div class="header-row">
      <a href="index.html" class="btn-back"><i class="bi bi-arrow-left"></i> Volver al inicio</a>
      <h2>📂 Archivos - <?php echo htmlspecialchars($nombreSemana); ?></h2>
      <div style="width:120px"></div>
    </div>

    <?php if (!empty($rows)): ?>
      <div class="card-container">
        <?php foreach ($rows as $row): 
            $ruta = htmlspecialchars($row['ruta']);
            $nombre = htmlspecialchars($row['nombre_archivo']);
            $tipo = htmlspecialchars($row['tipo']);
            $fecha = htmlspecialchars($row['fecha_subida']);

            // icono según tipo simple
            $icon = 'bi-file-earmark';
            if (stripos($tipo, 'pdf') !== false) $icon = 'bi-file-earmark-pdf';
            elseif (stripos($tipo, 'word') !== false || stripos($tipo, 'msword') !== false) $icon = 'bi-file-earmark-word';
            elseif (stripos($tipo, 'image') !== false) $icon = 'bi-file-earmark-image';
        ?>
          <div class="file-card">
            <div class="file-icon"><i class="bi <?php echo $icon; ?>"></i></div>
            <div class="file-name" title="<?php echo $nombre; ?>"><?php echo $nombre; ?></div>
            <div class="file-info"><?php echo $tipo; ?> — <?php echo $fecha; ?></div>

            <div class="actions">
              <a href="<?php echo $ruta; ?>" class="btn-view" target="_blank" rel="noopener"><i class="bi bi-eye"></i> Ver</a>
              <a href="<?php echo $ruta; ?>" download class="btn-download"><i class="bi bi-download"></i> Descargar</a>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php else: ?>
      <div class="alert-neon mt-3">No hay archivos para esta semana.</div>
    <?php endif; ?>

    <div class="text-center mt-5">
      <a href="index.html" class="btn-back"><i class="bi bi-arrow-left"></i> Volver al inicio</a>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
