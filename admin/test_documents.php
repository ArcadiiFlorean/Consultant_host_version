<?php
// Test simplu pentru verificarea documentelor
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Includem conexiunea la baza de date
include 'db.php';

try {
    // Test conexiune baza de date
    if (!$pdo) {
        throw new Exception('Nu s-a putut conecta la baza de date');
    }
    
    // Test tabel documents
    $stmt = $pdo->prepare("SHOW TABLES LIKE 'documents'");
    $stmt->execute();
    $tableExists = $stmt->fetch();
    
    if (!$tableExists) {
        throw new Exception('Tabelul documents nu există');
    }
    
    // Test selectare documente
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM documents WHERE status = 'active'");
    $stmt->execute();
    $count = $stmt->fetch()['total'];
    
    // Test selectare documente cu toate câmpurile
    $stmt = $pdo->prepare("
        SELECT 
            id, title, description, category, original_filename, 
            file_type, file_size, price, is_free, is_featured, 
            downloads_count, created_at
        FROM documents 
        WHERE status = 'active' 
        LIMIT 5
    ");
    $stmt->execute();
    $sampleDocuments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Test uploads directory
    $uploadsDir = 'uploads/documents/';
    $uploadsExists = is_dir($uploadsDir);
    $uploadsWritable = is_writable($uploadsDir);
    
    // Listează fișiere în uploads
    $filesInUploads = [];
    if ($uploadsExists) {
        $files = scandir($uploadsDir);
        $filesInUploads = array_filter($files, function($file) {
            return $file !== '.' && $file !== '..';
        });
    }
    
    echo json_encode([
        'success' => true,
        'database_connection' => 'OK',
        'documents_table_exists' => true,
        'total_documents' => intval($count),
        'uploads_directory_exists' => $uploadsExists,
        'uploads_directory_writable' => $uploadsWritable,
        'files_in_uploads' => array_values($filesInUploads),
        'sample_documents' => $sampleDocuments,
        'server_info' => [
            'php_version' => PHP_VERSION,
            'current_time' => date('Y-m-d H:i:s'),
            'script_path' => __FILE__
        ]
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => __FILE__,
        'line' => $e->getLine()
    ], JSON_PRETTY_PRINT);
}
?>