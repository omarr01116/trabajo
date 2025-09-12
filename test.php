<?php
$host = "localhost";
$db = "mis_trabajos";
$user = "root";      // tu usuario de MySQL
$pass = "";          // tu contraseña de MySQL

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
} else {
    echo "✅ Conexión exitosa con la base de datos!";
}
?>
