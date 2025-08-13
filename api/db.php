<?php
$host = 'localhost';
$dbname = 'dbbgd05fqwnbyk';
$username = 'upboslwy7gtf5';
$password = '6ghaazsuwcuk';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    // Returnează mereu JSON, nu text simplu
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'data' => [],
        'message' => 'Conexiunea la baza de date a eșuat',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit; // important, să nu continue scriptul
}
?>
