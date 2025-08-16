<?php
// api/services.php - Versiunea corectată și debuggată

// Headers pentru CORS și JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include conexiunea la baza de date
include_once '../db.php'; // Ajustează calea după structura ta

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetServices();
            break;
        case 'POST':
            handleCreateService();
            break;
        case 'PUT':
            handleUpdateService();
            break;
        case 'DELETE':
            handleDeleteService();
            break;
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'data' => []
    ]);
}

function handleGetServices() {
    global $pdo;
    
    try {
        // Query pentru a obține toate serviciile active
        $stmt = $pdo->prepare("
            SELECT 
                id,
                name,
                description,
                price,
                currency,
                duration,
                features,
                icon,
                popular,
                status,
                created_at,
                updated_at
            FROM services 
            WHERE status = 'active' 
            ORDER BY popular DESC, id ASC
        ");
        
        $stmt->execute();
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Debug - logează ce găsim în baza de date
        error_log("Services found: " . count($services));
        error_log("Services data: " . json_encode($services));
        
        // Procesează serviciile pentru a se asigura că toate câmpurile sunt corecte
        $processedServices = [];
        foreach ($services as $service) {
            $processedServices[] = [
                'id' => (int)$service['id'],
                'name' => $service['name'] ?? 'Serviciu fără nume',
                'description' => $service['description'] ?? 'Fără descriere',
                'price' => (float)$service['price'],
                'currency' => $service['currency'] ?? 'RON',
                'duration' => (int)($service['duration'] ?? 60),
                'features' => $service['features'] ? json_decode($service['features'], true) : [],
                'icon' => $service['icon'] ?? 'consultation',
                'popular' => (bool)($service['popular'] ?? false),
                'status' => $service['status'] ?? 'active',
                'created_at' => $service['created_at'],
                'updated_at' => $service['updated_at']
            ];
        }
        
        // IMPORTANT: Returnează răspunsul în formatul așteptat de React
        $response = [
            'success' => true,
            'data' => $processedServices, // React caută 'data'
            'count' => count($processedServices),
            'message' => 'Services loaded successfully'
        ];
        
        error_log("Final response: " . json_encode($response));
        
        http_response_code(200);
        echo json_encode($response);
        
    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage(),
            'data' => []
        ]);
    }
}

function handleCreateService() {
    global $pdo;
    
    try {
        // Obține datele JSON din request
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('Invalid JSON data');
        }
        
        // Validează câmpurile obligatorii
        $required = ['name', 'description', 'price'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                throw new Exception("Field '$field' is required");
            }
        }
        
        // Prepare statement pentru inserare
        $stmt = $pdo->prepare("
            INSERT INTO services (
                name, description, price, currency, duration, 
                features, icon, popular, status, created_at, updated_at
            ) VALUES (
                :name, :description, :price, :currency, :duration,
                :features, :icon, :popular, 'active', NOW(), NOW()
            )
        ");
        
        // Pregătește datele pentru inserare
        $features = isset($input['features']) ? json_encode($input['features']) : json_encode([]);
        
        $params = [
            ':name' => $input['name'],
            ':description' => $input['description'],
            ':price' => (float)$input['price'],
            ':currency' => $input['currency'] ?? 'RON',
            ':duration' => (int)($input['duration'] ?? 60),
            ':features' => $features,
            ':icon' => $input['icon'] ?? 'consultation',
            ':popular' => isset($input['popular']) ? (bool)$input['popular'] : false
        ];
        
        $stmt->execute($params);
        $serviceId = $pdo->lastInsertId();
        
        // Returnează serviciul creat
        $newService = [
            'id' => (int)$serviceId,
            'name' => $input['name'],
            'description' => $input['description'],
            'price' => (float)$input['price'],
            'currency' => $input['currency'] ?? 'RON',
            'duration' => (int)($input['duration'] ?? 60),
            'features' => json_decode($features, true),
            'icon' => $input['icon'] ?? 'consultation',
            'popular' => isset($input['popular']) ? (bool)$input['popular'] : false,
            'status' => 'active'
        ];
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $newService
        ]);
        
    } catch (Exception $e) {
        error_log("Create Service Error: " . $e->getMessage());
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'data' => null
        ]);
    }
}

function handleUpdateService() {
    // Similar cu handleCreateService dar pentru UPDATE
    // TODO: Implementează UPDATE logic
}

function handleDeleteService() {
    // TODO: Implementează DELETE logic
}
?>