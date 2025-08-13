<?php
// ============================================
// 1. ÎMBUNĂTĂȚIT get_available_slots.php
// ============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Pentru CORS dacă frontend e pe alt port
include 'db.php';

try {
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
    
    echo json_encode([
        'success' => true,
        'slots' => $slots,
        'count' => count($slots)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Eroare la încărcarea sloturilor'
    ]);
}