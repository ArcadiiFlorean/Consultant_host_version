<?php
// Includem conexiunea la baza de date
include_once 'db.php';

// Verificăm dacă utilizatorul este admin
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: admin_login.php');
    exit();
}

// Verificăm dacă avem ID-ul rezervării
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    die("ID rezervare invalid");
}

$booking_id = (int)$_GET['id'];

try {
    // Obținem detaliile rezervării cu toate informațiile
    $stmt = $pdo->prepare("
        SELECT b.*, 
               c.name as client_name, 
               c.email as client_email,
               c.phone as client_phone,
               c.created_at as client_created_at,
               s.slot_date, 
               s.slot_time,
               s.status as slot_status
        FROM bookings b 
        LEFT JOIN clients c ON b.client_id = c.id 
        LEFT JOIN available_slots s ON b.slot_id = s.id
        WHERE b.id = ?
    ");
    $stmt->execute([$booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$booking) {
        die("Rezervarea nu a fost găsită");
    }
    
    // Încercăm să obținem și serviciul dacă există o tabelă pentru asta
    $service_info = null;
    try {
        $serviceStmt = $pdo->prepare("SELECT * FROM services WHERE id = ? OR name = ?");
        $serviceStmt->execute([$booking['consult_type'], $booking['consult_type']]);
        $service_info = $serviceStmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        // Tabela services nu există, continuăm fără ea
    }
    
} catch (PDOException $e) {
    die("Eroare la încărcarea rezervării: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rezervare #<?php echo $booking_id; ?> - <?php echo htmlspecialchars($booking['name']); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .container {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
            overflow: hidden;
        }
        
        .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
            border-radius: 20px 20px 0 0 !important;
        }
        
        .card-header h4 {
            font-weight: 600;
            font-size: 1.4em;
            margin: 0;
        }
        
        .status-badge {
            font-size: 0.75em;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
.status-confirmed { 
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: 0 0 20px rgba(40, 167, 69, 0.6);
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}  
        .status-pending { 
            background-color: #fff3cd; 
            color: #856404; 
        }
        
        .status-cancelled { 
            background-color: #f8d7da; 
            color: #721c24; 
        }
        
        .card-header .btn {
            border-radius: 25px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.8em;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
        }
        
        .card-header .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .card-body {
            padding: 30px;
            background: white;
        }
        
        .info-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 5px solid #667eea;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .info-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
            pointer-events: none;
        }
        
        .info-section:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }
        
        .info-section h5 {
            color: #2c3e50;
            font-weight: 700;
            font-size: 1.3em;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .data-table {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border: none;
        }
        
        .data-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            width: 35%;
            padding: 15px 20px;
            border: none;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .data-table td {
            padding: 15px 20px;
            border: none;
            font-size: 1em;
            color: #2c3e50;
            border-bottom: 1px solid #f1f3f4;
        }
        
        .data-table tr:last-child td {
            border-bottom: none;
        }
        
        .data-table a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .data-table a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
        
        .timestamp {
            font-size: 0.85em;
            color: #6c757d;
            font-style: italic;
        }
        
        .highlight-changes {
            background: linear-gradient(45deg, #fff3cd, #ffeaa7);
            padding: 3px 8px;
            border-radius: 8px;
            font-weight: 600;
        }
        
        .btn {
            border-radius: 25px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
            padding: 12px 25px;
            transition: all 0.3s ease;
            border: none;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        .btn-warning {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
        }
        
        .btn-warning:hover {
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
        }
        
        .btn-info {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
        }
        
        .btn-info:hover {
            background: linear-gradient(135deg, #2980b9, #1f5582);
            color: white;
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }
        
        .btn-danger:hover {
            background: linear-gradient(135deg, #c0392b, #a93226);
            color: white;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
            color: white;
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, #7f8c8d, #6c7b7d);
            color: white;
        }
        
        .bg-light {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
            border-radius: 12px;
            border-left: 4px solid #667eea;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        }
        
        code {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 4px 8px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9em;
        }
        
        .text-muted {
            color: #6c757d !important;
            font-style: italic;
        }
        
        /* Responsive Design - IMPROVED */
        @media (max-width: 768px) {
            body {
                padding: 10px 0;
            }
            
            .container {
                padding: 0 10px;
            }
            
            /* Header responsive */
            .card-header {
                padding: 15px;
                text-align: center;
            }
            
            .card-header h4 {
                font-size: 1.1em;
                margin-bottom: 15px;
                line-height: 1.3;
            }
            
            .status-badge {
                font-size: 0.7em;
                padding: 4px 8px;
                display: block;
                margin: 10px auto;
                width: fit-content;
            }
            
            /* Header buttons - stacked vertically */
            .header-buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
                margin-top: 15px;
            }
            
            .card-header .btn {
                width: 100%;
                font-size: 0.75em;
                padding: 10px 15px;
                margin: 0;
                text-align: center;
            }
            
            .card-body {
                padding: 15px;
            }
            
            .info-section {
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .info-section h5 {
                font-size: 1.1em;
                margin-bottom: 15px;
            }
            
            /* Data tables responsive */
            .data-table {
                font-size: 0.85em;
            }
            
            .data-table th,
            .data-table td {
                padding: 10px 12px;
                font-size: 0.8em;
                word-break: break-word;
            }
            
            .data-table th {
                width: 40%;
                font-size: 0.75em;
            }
            
            /* Action buttons - better mobile layout */
            .action-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 20px;
            }
            
            .action-buttons .btn {
                width: 100%;
                font-size: 0.8em;
                padding: 12px 20px;
                margin: 0;
                text-align: center;
                white-space: nowrap;
            }
            
            /* Specific button groups */
            .btn-group-mobile {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .btn-group-mobile .btn {
                width: 100%;
                margin: 0;
            }
            
            /* Typography adjustments */
            .timestamp {
                font-size: 0.75em;
            }
            
            code {
                font-size: 0.75em;
                padding: 2px 6px;
            }
        }
        
        /* Extra small screens */
        @media (max-width: 480px) {
            .card-header h4 {
                font-size: 1em;
            }
            
            .status-badge {
                font-size: 0.65em;
                padding: 3px 6px;
            }
            
            .card-header .btn {
                font-size: 0.7em;
                padding: 8px 12px;
            }
            
            .data-table th,
            .data-table td {
                padding: 8px 10px;
                font-size: 0.75em;
            }
            
            .info-section h5 {
                font-size: 1em;
            }
            
            .action-buttons .btn {
                font-size: 0.75em;
                padding: 10px 15px;
            }
        }
        
        /* Animații speciale */
        .info-section {
            animation: slideInLeft 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .info-section:nth-child(1) { animation-delay: 0.1s; }
        .info-section:nth-child(2) { animation-delay: 0.2s; }
        .info-section:nth-child(3) { animation-delay: 0.3s; }
        .info-section:nth-child(4) { animation-delay: 0.4s; }
        .info-section:nth-child(5) { animation-delay: 0.5s; }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Print styles */
        @media print {
            body {
                background: white !important;
            }
            
            .card {
                box-shadow: none;
                border: 1px solid #ddd;
            }
            
            .card-header {
                background: #f8f9fa !important;
                color: black !important;
            }
            
            .btn {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8 mx-auto">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">
                            🗓️ Rezervare #<?php echo $booking_id; ?>
                            <span class="status-badge status-confirmed">Confirmată</span>
                        </h4>
                        <div class="header-buttons">
                            <a href="view_bookings.php" class="btn btn-secondary btn-sm">← Lista rezervări</a>
                            <a href="edit_booking.php?id=<?php echo $booking_id; ?>" class="btn btn-warning btn-sm">✏️ Editează</a>
                            <button onclick="window.print()" class="btn btn-primary btn-sm">🖨️ Printează</button>
                        </div>
                    </div>
                    <div class="card-body">
                        
                        <!-- Informații Client -->
                        <div class="info-section">
                            <h5>👤 Informații Client</h5>
                            <div class="row">
                                <div class="col-12">
                                    <table class="table table-sm data-table">
                                        <tr>
                                            <th>Nume complet:</th>
                                            <td><strong><?php echo htmlspecialchars($booking['name']); ?></strong></td>
                                        </tr>
                                        <tr>
                                            <th>Adresa email:</th>
                                            <td>
                                                <a href="mailto:<?php echo htmlspecialchars($booking['email']); ?>">
                                                    <?php echo htmlspecialchars($booking['email']); ?>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Număr telefon:</th>
                                            <td>
                                                <a href="tel:<?php echo htmlspecialchars($booking['phone']); ?>">
                                                    <?php echo htmlspecialchars($booking['phone']); ?>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>ID Client:</th>
                                            <td>#<?php echo htmlspecialchars($booking['client_id']); ?></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Detalii Rezervare -->
                        <div class="info-section">
                            <h5>📅 Detalii Rezervare</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <table class="table table-sm data-table">
                                        <tr>
                                            <th>Data programării:</th>
                                            <td>
                                                <strong><?php echo date('d F Y', strtotime($booking['date'])); ?></strong>
                                                <br><small class="text-muted"><?php echo date('l', strtotime($booking['date'])); ?></small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Ora programării:</th>
                                            <td><strong><?php echo date('H:i', strtotime($booking['hour'])); ?></strong></td>
                                        </tr>
                                        <tr>
                                            <th>Tip consultație:</th>
                                            <td>
                                                <?php if ($service_info): ?>
                                                    <strong><?php echo htmlspecialchars($service_info['name']); ?></strong>
                                                    <br><small><?php echo htmlspecialchars($service_info['description'] ?? ''); ?></small>
                                                <?php else: ?>
                                                    <strong><?php echo htmlspecialchars($booking['consult_type']); ?></strong>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Slot ID:</th>
                                            <td>#<?php echo htmlspecialchars($booking['slot_id']); ?></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <table class="table table-sm data-table">
                                        <tr>
                                            <th>Metoda de plată:</th>
                                            <td>
                                                <?php 
                                                $payment_methods = [
                                                    'card' => '💳 Card bancar',
                                                    'cash' => '💰 Numerar',
                                                    'transfer' => '🏦 Transfer bancar'
                                                ];
                                                echo $payment_methods[$booking['payment_method']] ?? $booking['payment_method'];
                                                ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Status slot:</th>
                                            <td>
                                                <span class="status-badge <?php echo $booking['slot_status'] === 'booked' ? 'status-confirmed' : 'status-pending'; ?>">
                                                    <?php echo ucfirst($booking['slot_status'] ?? 'necunoscut'); ?>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Data rezervării:</th>
                                            <td>
                                                <strong><?php echo date('d.m.Y H:i', strtotime($booking['booked_at'])); ?></strong>
                                                <br><small class="timestamp">acum <?php echo timeAgo($booking['booked_at']); ?></small>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Notițe și Observații -->
                        <?php if (!empty($booking['notes'])): ?>
                        <div class="info-section">
                            <h5>📝 Notițe și Observații</h5>
                            <div class="bg-light p-3 rounded">
                                <?php echo nl2br(htmlspecialchars($booking['notes'])); ?>
                            </div>
                        </div>
                        <?php endif; ?>

                        <!-- Informații Tehnice -->
                        <div class="info-section">
                            <h5>⚙️ Informații Sistem</h5>
                            <div class="row">
                                <div class="col-12">
                                    <table class="table table-sm data-table">
                                        <tr>
                                            <th>ID Rezervare:</th>
                                            <td><code>#<?php echo $booking_id; ?></code></td>
                                        </tr>
                                        <tr>
                                            <th>ID Client:</th>
                                            <td><code>#<?php echo $booking['client_id']; ?></code></td>
                                        </tr>
                                        <tr>
                                            <th>ID Slot:</th>
                                            <td><code>#<?php echo $booking['slot_id']; ?></code></td>
                                        </tr>
                                        <tr>
                                            <th>Creat la:</th>
                                            <td><?php echo date('d.m.Y H:i:s', strtotime($booking['booked_at'])); ?></td>
                                        </tr>
                                        <tr>
                                            <th>Slot original:</th>
                                            <td>
                                                <?php if ($booking['slot_date'] && $booking['slot_time']): ?>
                                                    <?php echo date('d.m.Y', strtotime($booking['slot_date'])); ?> la 
                                                    <?php echo date('H:i', strtotime($booking['slot_time'])); ?>
                                                <?php else: ?>
                                                    <em>Nu este disponibil</em>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Acțiuni - IMPROVED MOBILE LAYOUT -->
                        <div class="action-buttons">
                            <div class="btn-group-mobile">
                                <a href="edit_booking.php?id=<?php echo $booking_id; ?>" class="btn btn-warning">
                                    ✏️ Editează rezervarea
                                </a>
                                <button onclick="sendConfirmationEmail()" class="btn btn-info">
                                    📧 Trimite confirmare email
                                </button>
                            </div>
                            <div class="btn-group-mobile">
                                <button 
                                    onclick="confirmDelete(<?php echo $booking_id; ?>)" 
                                    class="btn btn-danger"
                                >
                                    🗑️ Șterge rezervarea
                                </button>
                                <a href="view_bookings.php" class="btn btn-secondary">
                                    ← Înapoi la listă
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function confirmDelete(id) {
            if (confirm('⚠️ ATENȚIE!\n\nSigur vrei să ștergi această rezervare?\n\nAceastă acțiune va:\n• Șterge definitiv rezervarea\n• Elibera slotul pentru alte rezervări\n• Nu poate fi anulată\n\nContinui?')) {
                window.location.href = 'delete_booking.php?id=' + id;
            }
        }
        
        function sendConfirmationEmail() {
            if (confirm('Trimiti email de confirmare clientului?')) {
                // Aici poți adăuga funcționalitatea de email
                alert('Funcționalitatea de email va fi implementată în curând.');
            }
        }
        
        // Highlight recent changes (dacă a fost editat recent)
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('edited') === 'true') {
                // Adaugă o notificare că rezervarea a fost editată recent
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show';
                alertDiv.innerHTML = `
                    <strong>✅ Succes!</strong> Rezervarea a fost actualizată cu succes.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                document.querySelector('.card-body').prepend(alertDiv);
                
                // Elimină parametrul din URL
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + urlParams.get('id');
                window.history.replaceState({path: newUrl}, '', newUrl);
            }
        });
    </script>
</body>
</html>

<?php
// Funcție helper pentru timeAgo
function timeAgo($datetime) {
    $time = time() - strtotime($datetime);
    
    if ($time < 60) return 'câteva secunde';
    if ($time < 3600) return floor($time/60) . ' minute';
    if ($time < 86400) return floor($time/3600) . ' ore';
    if ($time < 2592000) return floor($time/86400) . ' zile';
    if ($time < 31536000) return floor($time/2592000) . ' luni';
    return floor($time/31536000) . ' ani';
}
?>