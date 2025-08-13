<?php
/**
 * DOCUMENTS ADMIN API - Backend pentru gestionarea documentelor
 * Fișier: documents_admin_api.php
 */

session_start();
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

// Verifică autentificarea admin
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Acces neautorizat']);
    exit;
}

// Include conexiunea la baza de date
include 'db.php';

// Funcție pentru logarea erorilor
function logError($message) {
    error_log("[DOCUMENTS API] " . $message);
}

// Funcție pentru formatarea dimensiunii fișierului
function formatFileSize($bytes) {
    if ($bytes == 0) return '0 B';
    $k = 1024;
    $sizes = ['B', 'KB', 'MB', 'GB'];
    $i = floor(log($bytes) / log($k));
    return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
}

// Funcție pentru obținerea tipului de icon
function getFileIcon($mimeType) {
    $icons = [
        'application/pdf' => '📄',
        'application/msword' => '📝',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => '📝',
        'application/vnd.ms-excel' => '📊',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => '📊',
        'application/vnd.ms-powerpoint' => '📊',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => '📊',
        'text/plain' => '📃',
        'image/jpeg' => '🖼️',
        'image/png' => '🖼️',
        'image/gif' => '🖼️',
        'image/webp' => '🖼️'
    ];
    
    return $icons[$mimeType] ?? '📋';
}

// Funcție pentru crearea tabelului dacă nu există
function createDocumentsTable($pdo) {
    try {
        $sql = "CREATE TABLE IF NOT EXISTS documents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            original_filename VARCHAR(255) NOT NULL,
            stored_filename VARCHAR(255) NOT NULL,
            file_path VARCHAR(500) NOT NULL,
            file_size BIGINT NOT NULL,
            file_type VARCHAR(100) NOT NULL,
            category VARCHAR(100) DEFAULT 'general',
            price DECIMAL(10,2) DEFAULT 0.00,
            is_free BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
            downloads_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_category (category),
            INDEX idx_is_featured (is_featured),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $pdo->exec($sql);
        return true;
    } catch (PDOException $e) {
        logError("Eroare la crearea tabelului: " . $e->getMessage());
        return false;
    }
}

// Inițializează tabelul
createDocumentsTable($pdo);

// Gestionarea metodelor HTTP
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGetRequest($pdo);
            break;
            
        case 'POST':
            handlePostRequest($pdo);
            break;
            
        case 'DELETE':
            handleDeleteRequest($pdo);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Metodă HTTP nesuportată']);
            break;
    }
} catch (Exception $e) {
    logError("Eroare generală: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Eroare internă a serverului']);
}

/**
 * Gestionarea cererilor GET
 */
function handleGetRequest($pdo) {
    // Verifică dacă se cere doar numărul
    if (isset($_GET['count'])) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM documents WHERE status = 'active'");
        $stmt->execute();
        $count = $stmt->fetch()['count'];
        
        echo json_encode([
            'success' => true,
            'count' => intval($count)
        ]);
        return;
    }
    
    // Verifică dacă se cere debug info
    if (isset($_GET['debug'])) {
        $stmt = $pdo->prepare("SELECT status, COUNT(*) as count FROM documents GROUP BY status");
        $stmt->execute();
        $statusCounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'debug_info' => [
                'status_counts' => $statusCounts,
                'timestamp' => date('Y-m-d H:i:s'),
                'total_files' => array_sum(array_column($statusCounts, 'count'))
            ]
        ]);
        return;
    }
    
    // Încarcă toate documentele active
    try {
        $stmt = $pdo->prepare("
            SELECT 
                id, title, description, original_filename, file_size, 
                file_type, category, price, is_free, is_featured, 
                downloads_count, created_at,
                DATE_FORMAT(created_at, '%d.%m.%Y la %H:%i') as created_at_formatted
            FROM documents 
            WHERE status = 'active' 
            ORDER BY is_featured DESC, created_at DESC
        ");
        $stmt->execute();
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Formatează datele pentru afișare
        foreach ($documents as &$doc) {
            $doc['formatted_size'] = formatFileSize($doc['file_size']);
            $doc['file_icon'] = getFileIcon($doc['file_type']);
            $doc['is_free'] = (bool)$doc['is_free'];
            $doc['is_featured'] = (bool)$doc['is_featured'];
            $doc['price'] = floatval($doc['price']);
        }
        
        echo json_encode([
            'success' => true,
            'data' => $documents,
            'count' => count($documents),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (PDOException $e) {
        logError("Eroare la încărcarea documentelor: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Eroare la încărcarea documentelor']);
    }
}

/**
 * Gestionarea cererilor POST (upload documente)
 */
function handlePostRequest($pdo) {
    // Verifică dacă există fișierul
    if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'error' => 'Nu a fost încărcat niciun fișier sau a apărut o eroare']);
        return;
    }
    
    // Validarea datelor
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = $_POST['category'] ?? 'general';
    $price = floatval($_POST['price'] ?? 0);
    $isFree = isset($_POST['is_free']) && $_POST['is_free'] == '1';
    $isFeatured = isset($_POST['is_featured']) && $_POST['is_featured'] == '1';
    
    if (empty($title)) {
        echo json_encode(['success' => false, 'error' => 'Titlul este obligatoriu']);
        return;
    }
    
    if (!$isFree && $price <= 0) {
        echo json_encode(['success' => false, 'error' => 'Prețul trebuie să fie mai mare decât 0 pentru documentele cu plată']);
        return;
    }
    
    $uploadedFile = $_FILES['document'];
    $originalFilename = $uploadedFile['name'];
    $fileSize = $uploadedFile['size'];
    $fileType = $uploadedFile['type'];
    $tmpName = $uploadedFile['tmp_name'];
    
    // Validarea tipului de fișier
    $allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
    ];
    
    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Tipul de fișier nu este permis']);
        return;
    }
    
    // Validarea dimensiunii (10MB)
    if ($fileSize > 10 * 1024 * 1024) {
        echo json_encode(['success' => false, 'error' => 'Fișierul este prea mare (maxim 10MB)']);
        return;
    }
    
    // Creează directorul pentru documente dacă nu există
    $uploadDir = 'uploads/documents/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            echo json_encode(['success' => false, 'error' => 'Nu s-a putut crea directorul pentru documente']);
            return;
        }
    }
    
    // Generează un nume unic pentru fișier
    $fileExtension = pathinfo($originalFilename, PATHINFO_EXTENSION);
    $storedFilename = 'doc_' . uniqid() . '_' . time() . '.' . $fileExtension;
    $filePath = $uploadDir . $storedFilename;
    
    // Mută fișierul în directorul de destinație
    if (!move_uploaded_file($tmpName, $filePath)) {
        echo json_encode(['success' => false, 'error' => 'Eroare la salvarea fișierului']);
        return;
    }
    
    // Salvează în baza de date
    try {
    $stmt = $pdo->prepare("
    INSERT INTO documents (
        title, description, original_filename, filename, 
        file_path, file_size, file_type, category, price, 
        is_free, is_featured, status
    ) VALUES (
        :title, :description, :original_filename, :filename,
        :file_path, :file_size, :file_type, :category, :price,
        :is_free, :is_featured, 'active'
    )
");
        
  $result = $stmt->execute([
    ':title' => $title,
    ':description' => $description,
    ':original_filename' => $originalFilename,
    ':filename' => $storedFilename,  // ← COLOANA CORECTĂ
    ':file_path' => $filePath,
    ':file_size' => $fileSize,
    ':file_type' => $fileType,
    ':category' => $category,
    ':price' => $price,
    ':is_free' => $isFree ? 1 : 0,
    ':is_featured' => $isFeatured ? 1 : 0
]);
        
        if ($result) {
            $documentId = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Document încărcat cu succes',
                'document_id' => $documentId,
                'filename' => $storedFilename
            ]);
        } else {
            // Șterge fișierul dacă nu s-a salvat în baza de date
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            echo json_encode(['success' => false, 'error' => 'Eroare la salvarea în baza de date']);
        }
        
    } catch (PDOException $e) {
        logError("Eroare la salvarea documentului: " . $e->getMessage());
        
        // Șterge fișierul în caz de eroare
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        echo json_encode(['success' => false, 'error' => 'Eroare la salvarea documentului']);
    }
}

/**
 * Gestionarea cererilor DELETE
 */
function handleDeleteRequest($pdo) {
    $documentId = intval($_GET['id'] ?? 0);
    
    if ($documentId <= 0) {
        echo json_encode(['success' => false, 'error' => 'ID document invalid']);
        return;
    }
    
    try {
        // Găsește documentul
      $stmt = $pdo->prepare("SELECT file_path, filename FROM documents WHERE id = :id AND status = 'active'");
        $stmt->execute([':id' => $documentId]);
        $document = $stmt->fetch();
        
        if (!$document) {
            echo json_encode(['success' => false, 'error' => 'Documentul nu a fost găsit']);
            return;
        }
        
        // Șterge fișierul de pe disk
        if (file_exists($document['file_path'])) {
            if (!unlink($document['file_path'])) {
                logError("Nu s-a putut șterge fișierul: " . $document['file_path']);
            }
        }
        
        // Șterge din baza de date (soft delete)
        $stmt = $pdo->prepare("UPDATE documents SET status = 'deleted' WHERE id = :id");
        $result = $stmt->execute([':id' => $documentId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Document șters cu succes'
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Eroare la ștergerea documentului']);
        }
        
    } catch (PDOException $e) {
        logError("Eroare la ștergerea documentului: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Eroare la ștergerea documentului']);
    }
}

/**
 * Funcție pentru curățarea documentelor orfane
 */
function cleanOrphanedFiles($pdo) {
    try {
        // Găsește toate fișierele din directorul de documente
        $uploadDir = 'uploads/documents/';
        if (!is_dir($uploadDir)) {
            return 0;
        }
        
        $files = scandir($uploadDir);
        $cleaned = 0;
        
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            // Verifică dacă fișierul există în baza de date
            $stmt = $pdo->prepare("SELECT id FROM documents WHERE stored_filename = :filename AND status != 'deleted'");
            $stmt->execute([':filename' => $file]);
            
            if (!$stmt->fetch()) {
                // Fișierul nu există în baza de date, îl ștergem
                $filePath = $uploadDir . $file;
                if (file_exists($filePath) && unlink($filePath)) {
                    $cleaned++;
                    logError("Fișier orfan șters: " . $filePath);
                }
            }
        }
        
        return $cleaned;
        
    } catch (Exception $e) {
        logError("Eroare la curățarea fișierelor orfane: " . $e->getMessage());
        return 0;
    }
}

// Curățare automată la fiecare 10 cereri
if (rand(1, 10) === 1) {
    cleanOrphanedFiles($pdo);
}

?>