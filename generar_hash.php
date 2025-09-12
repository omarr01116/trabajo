<?php
// Contraseña que quieres usar
$password = "12345";

// Generar hash BCRYPT
$hash = password_hash($password, PASSWORD_DEFAULT);

echo $hash;
?>
