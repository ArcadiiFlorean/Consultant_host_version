<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tratează cererile OPTIONS pentru CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // Include configurația bazei de date
include_once 'db.php';
    
    // Verifică conexiunea la baza de date
    if (!isset($pdo) || !$pdo) {
        throw new Exception('Database connection failed');
    }
    
    // Interogarea pentru a obține toate serviciile
    $stmt = $pdo->prepare("
        SELECT 
            id,
            name,
            price,
            COALESCE(currency, 'GBP') as currency,
            COALESCE(description, '') as description,
            COALESCE(popular, 0) as popular,
            COALESCE(icon, 'consultation') as icon,
            COALESCE(features, '') as features
        FROM services 
        ORDER BY popular DESC, id ASC
    ");
    
    $stmt->execute();
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Procesează serviciile pentru a formata features-urile
    $processedServices = [];
    
    foreach ($services as $service) {
        // Convertește features din string în array
        $featuresArray = [];
        if (!empty($service['features'])) {
            $featuresArray = array_filter(
                array_map('trim', explode('|', $service['features'])),
                function($feature) {
                    return !empty($feature);
                }
            );
        }
        
        // Formatează serviciul pentru frontend
        $processedService = [
            'id' => (int)$service['id'],
            'name' => (string)$service['name'],
            'price' => (string)$service['price'],
            'currency' => (string)$service['currency'],
            'description' => (string)$service['description'],
            'popular' => (bool)$service['popular'],
            'icon' => (string)$service['icon'],
            'features' => $featuresArray
        ];
        
        $processedServices[] = $processedService;
    }
    
    // Returnează răspunsul JSON
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $processedServices,
        'message' => 'Services loaded successfully',
        'total' => count($processedServices),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'data' => [],
        'message' => 'Database error occurred',
        'error' => 'Connection failed',
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'data' => [],
        'message' => 'Server error occurred',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
}
?>