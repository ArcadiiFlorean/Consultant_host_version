<?php
include_once 'db.php';

session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: admin_login.php');
    exit();
}

$booking_id = $_GET['id'] ?? null;
if (!$booking_id || !is_numeric($booking_id)) {
    header('Location: view_bookings.php?error=invalid_id');
    exit();
}

try {
    // Începem tranzacția
    $pdo->beginTransaction();
    
    // Găsim slot_id pentru a-l elibera
    $stmt = $pdo->prepare("SELECT slot_id FROM bookings WHERE id = ?");
    $stmt->execute([$booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($booking) {
        // Ștergem rezervarea
        $deleteStmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
        $deleteResult = $deleteStmt->execute([$booking_id]);
        
        // Eliberăm slotul dacă există
        if ($booking['slot_id']) {
            $updateSlot = $pdo->prepare("UPDATE available_slots SET status = 'available' WHERE id = ?");
            $updateSlot->execute([$booking['slot_id']]);
        }
        
        // Confirmăm tranzacția
        $pdo->commit();
        
        if ($deleteResult) {
            header('Location: view_bookings.php?success=deleted');
        } else {
            header('Location: view_bookings.php?error=delete_failed');
        }
    } else {
        header('Location: view_bookings.php?error=not_found');
    }
    
} catch (PDOException $e) {
    // Anulăm tranzacția în caz de eroare
    $pdo->rollBack();
    
    error_log("Delete booking error: " . $e->getMessage());
    header('Location: view_bookings.php?error=database_error');
}

exit();
?>