<?php
// Pornește output buffering pentru a captura orice eroare
ob_start();

// Setează header-ele pentru JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Încearcă să captureze orice eroare
try {
    // Căile posibile pentru db.php (din src/components/ către admin/)
    $dbPaths = [
        '../../admin/db.php',              // Din src/components/ către admin/
        '../../../admin/db.php',           // Caz alternativ  
        __DIR__ . '/../../admin/db.php',   // Path absolut
        dirname(dirname(__DIR__)) . '/admin/db.php' // Către root apoi admin/
    ];
    
    $dbFound = false;
    $dbPath = '';
    
    foreach ($dbPaths as $path) {
        if (file_exists($path)) {
            $dbPath = $path;
            $dbFound = true;
            break;
        }
    }
    
    if (!$dbFound) {
        throw new Exception('Fișierul db.php nu a fost găsit în admin/');
    }
    
    // Încearcă să includă db.php
    require_once $dbPath;
    
    // Verifică dacă $pdo există
    if (!isset($pdo)) {
        throw new Exception('Conexiunea la baza de date nu este disponibilă în ' . $dbPath);
    }
    
    // Query simplu pentru a testa conexiunea
    $stmt = $pdo->query("SELECT 1");
    if (!$stmt) {
        throw new Exception('Nu se poate executa query-ul de test');
    }
    
    // Verifică dacă tabelul există
    $stmt = $pdo->query("SHOW TABLES LIKE 'testimonials_simple'");
    if ($stmt->rowCount() == 0) {
        throw new Exception('Tabelul testimonials_simple nu există');
    }
    
    // Încearcă să selecteze testimonialele
    $sql = "SELECT id, text, name, role, status, created_at, 
                   COALESCE(rating, 5) as rating 
            FROM testimonials_simple 
            WHERE status = 'active' 
            ORDER BY created_at DESC 
            LIMIT 20";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatează rezultatele
    $result = [];
    foreach ($testimonials as $testimonial) {
        $result[] = [
            'id' => (int)$testimonial['id'],
            'name' => $testimonial['name'],
            'text' => $testimonial['text'],
            'role' => $testimonial['role'],
            'rating' => (int)$testimonial['rating']
        ];
    }
    
    // Curăță orice output anterior și returnează JSON
    ob_clean();
    echo json_encode([
        'success' => true,
        'data' => $result,
        'count' => count($result),
        'message' => 'Testimoniale încărcate cu succes din baza de date',
        'debug_info' => [
            'db_path_used' => $dbPath,
            'current_dir' => getcwd()
        ]
    ]);
    
} catch (Exception $e) {
    // Curăță orice output anterior
    ob_clean();
    
    // Returnează eroarea ca JSON
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'data' => [],
        'debug_info' => [
            'current_dir' => getcwd(),
            'php_version' => PHP_VERSION,
            'checked_paths' => [
                '../../admin/db.php' => file_exists('../../admin/db.php'),
                '../../../admin/db.php' => file_exists('../../../admin/db.php'),
                __DIR__ . '/../../admin/db.php' => file_exists(__DIR__ . '/../../admin/db.php'),
                dirname(dirname(__DIR__)) . '/admin/db.php' => file_exists(dirname(dirname(__DIR__)) . '/admin/db.php')
            ]
        ]
    ]);
}

// Oprește output buffering
ob_end_flush();
?>