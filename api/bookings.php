<?php
// Headers pentru JSON și CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Gestionăm requesturile OPTIONS pentru CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Debug: Log ce se întâmplă
error_log("=== API BOOKINGS DEBUG ===");
error_log("Method: " . $_SERVER['REQUEST_METHOD']);

// Verificăm dacă requestul este POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Metoda nu este permisă'
    ]);
    exit();
}

try {
    error_log("Step 1: POST method received");
    
    // Test 1: Preluăm datele JSON
    $input = file_get_contents('php://input');
    error_log("Step 2: Input received: " . $input);
    
    $data = json_decode($input, true);
    error_log("Step 3: JSON decoded");
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Date JSON invalide: ' . json_last_error_msg());
    }
    
    error_log("Step 4: JSON validation passed");
    
    // Test 2: Include database
    error_log("Step 5: Including database...");
    include_once 'db.php';
    error_log("Step 6: Database included successfully");
    
    // Test 3: Verificăm conexiunea PDO
    if (!isset($pdo)) {
        throw new Exception('PDO connection not available');
    }
    error_log("Step 7: PDO connection available");
    
    // Extragem și validăm datele
    $name = trim($data['firstName'] ?? '') . ' ' . trim($data['lastName'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $consult_type = $data['serviceId'] ?? '';
    $date = $data['date'] ?? '';
    $hour = $data['hour'] ?? '';
    $payment_method = $data['paymentMethod'] ?? 'card';
    $notes = trim($data['notes'] ?? '');
    
    error_log("Step 8: Data extracted - name: $name, email: $email, date: $date, hour: $hour");
    
    // Array pentru erori
    $errors = [];
    
    // Validări simple
    if (empty(trim($name))) {
        $errors[] = "Numele este obligatoriu";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email valid este obligatoriu";
    }
    
    if (empty($date)) {
        $errors[] = "Data este obligatorie";
    }
    
    if (empty($hour)) {
        $errors[] = "Ora este obligatorie";
    } else {
        // Standardizăm formatul orei
        if (preg_match('/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/', $hour)) {
            $hour = $hour . ':00';
        }
    }
    
    if (!empty($errors)) {
        throw new Exception(implode(', ', $errors));
    }
    
    error_log("Step 9: Validation passed");
    
    // Începem tranzacția
    $pdo->beginTransaction();
    error_log("Step 10: Transaction started");
    
    // Verificăm dacă clientul există sau îl creăm
    $checkClient = $pdo->prepare("SELECT id FROM clients WHERE email = ?");
    $checkClient->execute([$email]);
    $client = $checkClient->fetch(PDO::FETCH_ASSOC);
    
    if ($client) {
        $client_id = $client['id'];
        error_log("Step 10.1: Existing client found with ID: $client_id");
    } else {
        // Creăm client nou
        $insertClient = $pdo->prepare("INSERT INTO clients (name, email, phone, created_at) VALUES (?, ?, ?, NOW())");
        $insertClient->execute([$name, $email, $phone]);
        $client_id = $pdo->lastInsertId();
        error_log("Step 10.2: New client created with ID: $client_id");
    }
    
    // Găsim slot_id pentru data și ora selectate
    $findSlot = $pdo->prepare("SELECT id FROM available_slots WHERE slot_date = ? AND slot_time = ? AND status = 'available'");
    $findSlot->execute([$date, $hour]);
    $slot = $findSlot->fetch(PDO::FETCH_ASSOC);
    
    if (!$slot) {
        throw new Exception("Slotul selectat nu mai este disponibil pentru data $date la ora $hour");
    }
    
    $slot_id = $slot['id'];
    error_log("Step 10.3: Found slot_id: $slot_id for slot_date: $date, slot_time: $hour");
    
    // Inserăm rezervarea cu client_id și slot_id
    $sql = "INSERT INTO bookings (client_id, slot_id, name, email, phone, consult_type, date, hour, payment_method, notes, booked_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        $client_id,  // client_id
        $slot_id,    // slot_id 
        $name,
        $email,
        $phone,
        $consult_type,
        $date,
        $hour,
        $payment_method,
        $notes
    ]);
    
    if (!$result) {
        throw new Exception("Eroare la salvarea rezervării");
    }
    
    // Obținem ID-ul rezervării
    $booking_id = $pdo->lastInsertId();
    error_log("Step 11: Booking saved with ID: $booking_id");
    
    // Marcăm slotul ca ocupat
    $updateSlot = $pdo->prepare("UPDATE available_slots SET status = 'booked' WHERE id = ?");
    $updateSlot->execute([$slot_id]);
    error_log("Step 11.1: Slot marked as booked");
    
    // Confirmăm tranzacția
    $pdo->commit();
    error_log("Step 12: Transaction committed");
    
    // Returnăm succesul cu structura corectă
    echo json_encode([
        'success' => true,
        'message' => 'Rezervarea a fost salvată cu succes',
        'data' => [
            'bookingId' => $booking_id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'consult_type' => $consult_type,
            'date' => $date,
            'hour' => $hour,
            'payment_method' => $payment_method
        ]
    ]);
    
} catch (Exception $e) {
    error_log("ERROR: " . $e->getMessage());
    error_log("ERROR on line: " . $e->getLine());
    
    echo json_encode([
        'success' => false,
        'message' => 'Debug error: ' . $e->getMessage(),
        'line' => $e->getLine()
    ]);
}
?>