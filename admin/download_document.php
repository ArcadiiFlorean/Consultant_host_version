<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Include conexiunea la baza de date (folosește același fișier ca API-ul)
include 'db.php';

try {
    // Verifică dacă ID-ul documentului este furnizat
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        throw new Exception('ID document lipsește');
    }

    $documentId = intval($_GET['id']);

    // Conectare la baza de date (folosește $pdo din db.php)
    if (!isset($pdo)) {
        throw new Exception('Eroare la conectarea la baza de date');
    }

    // Obține informațiile documentului
    $stmt = $pdo->prepare("
        SELECT 
            id,
            title,
            original_filename,
            filename,
            file_path,
            file_type,
            file_size,
            is_free,
            status,
            downloads_count
        FROM documents 
        WHERE id = ? AND status = 'active'
    ");
    
    $stmt->execute([$documentId]);
    $document = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$document) {
        throw new Exception('Document nu a fost găsit sau nu este activ');
    }

    // Construiește calea completă către fișier
    $filePath = $document['file_path']; // Calea completă este deja în baza de date

    // Verifică dacă fișierul există fizic
    if (!file_exists($filePath)) {
        throw new Exception('Fișierul nu există pe server');
    }

    // Pentru documente cu plată, adaugă aici verificarea plății
    if (!$document['is_free']) {
        // TODO: Verifică dacă utilizatorul a plătit pentru acest document
        // De exemplu, verifică în sesiune sau baza de date
        /*
        session_start();
        if (!isset($_SESSION['purchased_documents']) || 
            !in_array($documentId, $_SESSION['purchased_documents'])) {
            throw new Exception('Documentul necesită plată');
        }
        */
    }

    // Incrementează contorul de descărcări
    $updateStmt = $pdo->prepare("UPDATE documents SET downloads_count = downloads_count + 1 WHERE id = ?");
    $updateStmt->execute([$documentId]);

    // Setează header-ele pentru descărcare
    header('Content-Type: ' . $document['file_type']);
    header('Content-Disposition: attachment; filename="' . $document['original_filename'] . '"');
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

    // Citește și trimite fișierul
    readfile($filePath);
    
    // Log descărcarea (opțional)
    error_log("Document descărcat: ID={$documentId}, Filename={$document['original_filename']}");
    
    exit;

} catch (Exception $e) {
    // Resetează header-ele și trimite eroarea ca JSON
    header_remove();
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(400);
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
    error_log("Eroare descărcare document: " . $e->getMessage());
}
?>