<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Doar POST este permis
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metoda nu este permisă']);
    exit;
}

// Include conexiunea la baza de date (folosește același fișier ca API-ul)
include 'db.php';

try {
    // Citește datele din request
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['document_id']) || empty($data['document_id'])) {
        throw new Exception('ID document lipsește');
    }

    $documentId = intval($data['document_id']);

    // Conectare la baza de date (folosește $pdo din db.php)
    if (!isset($pdo)) {
        throw new Exception('Eroare la conectarea la baza de date');
    }

    // Incrementează contorul de descărcări
    $stmt = $pdo->prepare("UPDATE documents SET downloads_count = downloads_count + 1 WHERE id = ? AND status = 'active'");
    $result = $stmt->execute([$documentId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Contor actualizat cu succes',
            'document_id' => $documentId,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Document nu a fost găsit sau nu este activ'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
    error_log("Eroare incrementare download: " . $e->getMessage());
}
?>