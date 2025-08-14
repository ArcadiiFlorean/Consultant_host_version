<?php
// ============================================
// get_available_slots.php - VERSIUNE COMPLETĂ
// ============================================

// Setează headers pentru JSON și CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Datele tale de conectare (fără să depinzi de db.php)
    $host = 'localhost';
    $dbname = 'dbbgd05fqwnbyk';
    $username = 'upboslwy7gtf5';
    $password = '6ghaazsuwcuk';
    
    // Conectare la baza de date
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Query-ul tău original
    $stmt = $pdo->prepare("
        SELECT slot_date, slot_time, 
               CONCAT(slot_date, 'T', slot_time) as datetime_combined
        FROM available_slots 
        WHERE status = 'available' 
        AND CONCAT(slot_date, ' ', slot_time) > NOW() 
        ORDER BY slot_date, slot_time
    ");
    
    $stmt->execute();
    $slots = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Returnează rezultatul în format JSON
    echo json_encode([
        'success' => true,
        'slots' => $slots,
        'count' => count($slots),
        'debug' => [
            'table_used' => 'available_slots',
            'timestamp' => date('Y-m-d H:i:s'),
            'total_slots_found' => count($slots)
        ]
    ]);
    
} catch (PDOException $e) {
    // Eroare de baza de date
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
        'debug' => [
            'timestamp' => date('Y-m-d H:i:s'),
            'error_type' => 'PDO Exception'
        ]
    ]);
    
} catch (Exception $e) {
    // Alte erori
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage(),
        'debug' => [
            'timestamp' => date('Y-m-d H:i:s'),
            'error_type' => 'General Exception'
        ]
    ]);
}
?>