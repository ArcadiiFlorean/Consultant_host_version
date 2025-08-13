<?php
// Schimbă în:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Restul codului rămâne la fel...
include 'db.php';

try {
    // Folosește tabela CORECTĂ: public_documents
    $stmt = $pdo->prepare("
        SELECT 
            id, title, description, original_filename, 
            file_type, file_size, category, price, is_free, 
            is_featured, downloads_count, created_at,
            formatted_size, category_name, file_icon
        FROM public_documents 
        ORDER BY is_featured DESC, created_at DESC
    ");
    $stmt->execute();
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatează datele
    foreach ($documents as &$doc) {
        $doc['is_free'] = (bool)$doc['is_free'];
        $doc['is_featured'] = (bool)$doc['is_featured'];
        $doc['price'] = floatval($doc['price']);
        $doc['downloads_count'] = intval($doc['downloads_count']);
        
        // Adaugă câmpul filename pentru compatibilitate
        $doc['filename'] = 'doc_' . $doc['id'] . '.docx'; // Temporary filename
    }
    
    echo json_encode([
        'success' => true,
        'data' => $documents,
        'count' => count($documents),
        'message' => 'Documente încărcate din public_documents',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Eroare: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>