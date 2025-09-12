<?php
session_start();

// Configuración de la base de datos
$host = "sql202.infinityfree.com";
$db = "if0_39921547_mi_bd";
$user = "if0_39921547";   // Cambia si tu usuario es otro
$pass = "OxvjSj9Pcb";       // Cambia si tu contraseña de MySQL tiene valor

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Procesar login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, password, nombre_completo FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hash, $nombre_completo);
        $stmt->fetch();
        // Verificar contraseña
        if (password_verify($password, $hash)) {
            $_SESSION['id_usuario'] = $id;
            $_SESSION['nombre'] = $nombre_completo;
            // Redirige directamente a upload.html
            header("Location: upload.html");
            exit();
        } else {
            $error = "Contraseña incorrecta";
        }
    } else {
        $error = "Usuario no encontrado";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <h2>Login</h2>
  <?php if(isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
</body>
</html>
