<?php
header("Content-Type: application/json");

// Configuración de la base de datos
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mis_trabajos";  // aquí usas tu base real

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error en la conexión BD"]);
    exit;
}

// Validar datos
if (!isset($_FILES["archivo"]) || !isset($_POST["semana"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$semana = $_POST["semana"];
$archivo = $_FILES["archivo"]["name"];
$tmpName = $_FILES["archivo"]["tmp_name"];
$tipo = $_FILES["archivo"]["type"]; // mime type
$carpetaDestino = "archivos/" . strtolower(str_replace(" ", "", $semana));

// Crear carpeta si no existe
if (!file_exists($carpetaDestino)) {
    mkdir($carpetaDestino, 0777, true);
}

$rutaDestino = $carpetaDestino . "/" . basename($archivo);

if (move_uploaded_file($tmpName, $rutaDestino)) {
    // Guardar en la tabla `archivos`
    $stmt = $conn->prepare("INSERT INTO archivos (nombre_archivo, ruta, tipo, semana, fecha_subida) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $archivo, $rutaDestino, $tipo, $semana);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "✅ Archivo subido y registrado en la BD"]);
    } else {
        echo json_encode(["success" => false, "message" => "Archivo movido, pero error al guardar en BD"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error al mover el archivo"]);
}

$conn->close();
?>
