<?php
include_once 'db.php';

session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: admin_login.php');
    exit();
}

$booking_id = $_GET['id'] ?? null;
if (!$booking_id || !is_numeric($booking_id)) {
    die("ID rezervare invalid");
}

// Procesează formularul de editare
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $date = $_POST['date'];
    $hour = $_POST['hour'];
    $consult_type = $_POST['consult_type'];
    $payment_method = $_POST['payment_method'];
    $notes = trim($_POST['notes']);
    
    try {
        $sql = "UPDATE bookings SET 
                name = ?, email = ?, phone = ?, date = ?, hour = ?, 
                consult_type = ?, payment_method = ?, notes = ?
                WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            $name, $email, $phone, $date, $hour, 
            $consult_type, $payment_method, $notes, $booking_id
        ]);
        
        if ($result) {
            header('Location: view_bookings.php?success=updated');
            exit();
        }
    } catch (PDOException $e) {
        $error = "Eroare la actualizare: " . $e->getMessage();
    }
}

// Preia datele rezervării
try {
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->execute([$booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$booking) {
        die("Rezervarea nu a fost găsită");
    }
} catch (PDOException $e) {
    die("Eroare: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editează Rezervarea #<?php echo $booking_id; ?></title>
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
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .card-header h4::before {
            content: '✏️';
            font-size: 1.2em;
        }
        
        .card-body {
            padding: 40px;
            background: white;
        }
        
        .alert {
            border-radius: 15px;
            border: none;
            font-weight: 600;
            padding: 15px 20px;
            margin-bottom: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .alert-danger {
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
        }
        
        .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .form-control, .form-select {
            border: 2px solid #e1e8ed;
            border-radius: 12px;
            padding: 15px 20px;
            font-size: 1em;
            transition: all 0.3s ease;
            background: #f8f9fa;
            font-weight: 500;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
            background: white;
            outline: none;
        }
        
        .form-control:hover, .form-select:hover {
            border-color: #764ba2;
            background: white;
        }
        
        textarea.form-control {
            resize: vertical;
            min-height: 120px;
        }
        
        .row {
            margin-bottom: 20px;
        }
        
        .mb-3 {
            position: relative;
        }
        
        .mb-3:hover .form-label {
            color: #667eea;
        }
        
        /* Stiluri pentru butoane */
        .btn {
            border-radius: 25px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
            padding: 15px 30px;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #5a6fd8, #6a4190);
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
        
        .btn-info {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
        }
        
        .btn-info:hover {
            background: linear-gradient(135deg, #2980b9, #1f5582);
            color: white;
        }
        
        .d-flex.gap-2 {
            gap: 15px !important;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f1f3f4;
        }
        
        /* Efecte speciale pentru inputs */
        .form-control::placeholder {
            color: #95a5a6;
            font-style: italic;
        }
        
        .form-control:valid {
            border-color: #2ecc71;
        }
        
        .form-control:invalid:focus {
            border-color: #e74c3c;
            box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .card-body {
                padding: 25px;
            }
            
            .card-header {
                padding: 20px;
            }
            
            .btn {
                width: 100%;
                margin: 5px 0;
                justify-content: center;
            }
            
            .d-flex.gap-2 {
                flex-direction: column;
            }
            
            .form-control, .form-select {
                padding: 12px 15px;
            }
        }
        
        /* Animații pentru form groups */
        .mb-3 {
            animation: slideInLeft 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .mb-3:nth-child(1) { animation-delay: 0.1s; }
        .mb-3:nth-child(2) { animation-delay: 0.15s; }
        .mb-3:nth-child(3) { animation-delay: 0.2s; }
        .mb-3:nth-child(4) { animation-delay: 0.25s; }
        .mb-3:nth-child(5) { animation-delay: 0.3s; }
        .mb-3:nth-child(6) { animation-delay: 0.35s; }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Focus indicators */
        .form-control:focus + .focus-indicator {
            transform: scaleX(1);
        }
        
        .focus-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        /* Success state */
        .form-saved {
            animation: pulse 2s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-10 col-lg-8 mx-auto">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Editează Rezervarea #<?php echo $booking_id; ?></h4>
                    </div>
                    <div class="card-body">
                        <?php if (isset($error)): ?>
                            <div class="alert alert-danger"><?php echo $error; ?></div>
                        <?php endif; ?>
                        
                        <form method="POST" id="editForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">👤 Nume</label>
                                        <input type="text" name="name" class="form-control" 
                                               value="<?php echo htmlspecialchars($booking['name']); ?>" 
                                               placeholder="Numele complet al clientului" required>
                                        <div class="focus-indicator"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">📧 Email</label>
                                        <input type="email" name="email" class="form-control" 
                                               value="<?php echo htmlspecialchars($booking['email']); ?>" 
                                               placeholder="adresa@email.com" required>
                                        <div class="focus-indicator"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">📞 Telefon</label>
                                        <input type="text" name="phone" class="form-control" 
                                               value="<?php echo htmlspecialchars($booking['phone']); ?>" 
                                               placeholder="0700 000 000" required>
                                        <div class="focus-indicator"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">🩺 Tip consultație</label>
                                        <input type="text" name="consult_type" class="form-control" 
                                               value="<?php echo htmlspecialchars($booking['consult_type']); ?>"
                                               placeholder="Tipul consultației">
                                        <div class="focus-indicator"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">📅 Data</label>
                                        <input type="date" name="date" class="form-control" 
                                               value="<?php echo htmlspecialchars($booking['date']); ?>" required>
                                        <div class="focus-indicator"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">🕐 Ora</label>
                                        <input type="time" name="hour" class="form-control" 
                                               value="<?php echo htmlspecialchars($booking['hour']); ?>" required>
                                        <div class="focus-indicator"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">💳 Metoda de plată</label>
                                <select name="payment_method" class="form-select">
                                    <option value="card" <?php echo $booking['payment_method'] === 'card' ? 'selected' : ''; ?>>💳 Card bancar</option>
                                    <option value="cash" <?php echo $booking['payment_method'] === 'cash' ? 'selected' : ''; ?>>💰 Numerar</option>
                                    <option value="transfer" <?php echo $booking['payment_method'] === 'transfer' ? 'selected' : ''; ?>>🏦 Transfer bancar</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">📝 Notițe</label>
                                <textarea name="notes" class="form-control" rows="4" 
                                          placeholder="Notițe suplimentare despre rezervare..."><?php echo htmlspecialchars($booking['notes']); ?></textarea>
                                <div class="focus-indicator"></div>
                            </div>
                            
                            <div class="d-flex gap-2 justify-content-between">
                                <div>
                                    <button type="submit" class="btn btn-primary">
                                        💾 Salvează modificările
                                    </button>
                                </div>
                                <div>
                                    <a href="view_booking.php?id=<?php echo $booking_id; ?>" class="btn btn-info">
                                        👁️ Vezi detalii
                                    </a>
                                    <a href="view_bookings.php" class="btn btn-secondary">
                                        ❌ Anulează
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Adaugă efecte interactive
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('editForm');
            const inputs = form.querySelectorAll('.form-control, .form-select');
            
            // Animație la focus
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'scale(1.02)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'scale(1)';
                });
            });
            
            // Validare în timp real
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '⏳ Se salvează...';
                submitBtn.disabled = true;
                
                // Simulare efect de salvare
                setTimeout(() => {
                    form.classList.add('form-saved');
                }, 100);
            });
        });
    </script>
</body>
</html>