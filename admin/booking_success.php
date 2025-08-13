<?php
session_start();

// Verificăm dacă rezervarea a fost procesată cu succes
if (!isset($_SESSION['booking_success']) || !$_SESSION['booking_success']) {
    header('Location: book.php');
    exit();
}

// Preluăm detaliile rezervării
$booking_details = $_SESSION['booking_details'] ?? [];
$booking_id = $_SESSION['booking_id'] ?? 0;

// Curățăm sesiunea
unset($_SESSION['booking_success']);
unset($_SESSION['booking_details']);
unset($_SESSION['booking_id']);
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rezervare Confirmată</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 30px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .success-icon {
            font-size: 4em;
            color: #28a745;
            margin-bottom: 20px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        
        .booking-details {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
            text-align: left;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .detail-label {
            font-weight: bold;
            color: #495057;
        }
        
        .detail-value {
            color: #212529;
        }
        
        .booking-id {
            background: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 1.2em;
            color: #495057;
        }
        
        .important-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            color: #856404;
        }
        
        .actions {
            margin-top: 30px;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 0 10px;
            border: none;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                padding: 20px;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Rezervarea ta a fost confirmată!</h1>
        <p class="subtitle">Îți mulțumim pentru încrederea acordată!</p>
        
        <div class="booking-id">
            <strong>ID Rezervare: #<?php echo str_pad($booking_id, 6, '0', STR_PAD_LEFT); ?></strong>
        </div>
        
        <div class="booking-details">
            <h3>Detaliile rezervării tale:</h3>
            
            <div class="detail-row">
                <span class="detail-label">Nume:</span>
                <span class="detail-value"><?php echo htmlspecialchars($booking_details['name'] ?? 'N/A'); ?></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><?php echo htmlspecialchars($booking_details['email'] ?? 'N/A'); ?></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Telefon:</span>
                <span class="detail-value"><?php echo htmlspecialchars($booking_details['phone'] ?? 'N/A'); ?></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Tip consultație:</span>
                <span class="detail-value"><?php echo htmlspecialchars($booking_details['consult_type'] ?? 'N/A'); ?></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Data:</span>
                <span class="detail-value"><?php echo htmlspecialchars($booking_details['date'] ?? 'N/A'); ?></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Ora:</span>
                <span class="detail-value"><?php echo htmlspecialchars(substr($booking_details['hour'] ?? 'N/A', 0, 5)); ?></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Metodă de plată:</span>
                <span class="detail-value"><?php echo htmlspecialchars($booking_details['payment_method'] ?? 'N/A'); ?></span>
            </div>
        </div>
        
        <div class="important-note">
            <strong>📧 Important:</strong> Vei primi în scurt timp un email de confirmare cu toate detaliile și instrucțiunile pentru consultație.
        </div>
        
        <div class="actions">
            <a href="book.php" class="btn btn-secondary">Fă o nouă rezervare</a>
            <a href="index.php" class="btn btn-primary">Înapoi la pagina principală</a>
        </div>
    </div>
</body>
</html>