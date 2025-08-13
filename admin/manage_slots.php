<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: admin_login.php");
    exit;
}

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['slots'])) {
    // ✅ SOLUȚIA: Nu șterge sloturile rezervate!
    // Opțiunea 1: Dacă ai coloana 'status' în tabel
    $pdo->exec("DELETE FROM available_slots WHERE status = 'available'");
    
    // Opțiunea 2: Dacă NU ai coloana 'status', decomentează linia de jos și comentează cea de sus:
    // $pdo->exec("DELETE FROM available_slots WHERE id NOT IN (SELECT DISTINCT slot_id FROM bookings WHERE slot_id IS NOT NULL)");

    foreach ($_POST['slots'] as $slot) {
        list($date, $time) = explode('|', $slot);
        
        // Verifică dacă slotul există deja
        $checkExisting = $pdo->prepare("SELECT id FROM available_slots WHERE slot_date = ? AND slot_time = ?");
        $checkExisting->execute([$date, $time]);
        $existing = $checkExisting->fetch();
        
        if (!$existing) {
            // Adaugă doar dacă nu există
            $stmt = $pdo->prepare("INSERT INTO available_slots (slot_date, slot_time, status) VALUES (?, ?, 'available')");
            $stmt->execute([$date, $time]);
        }
    }

    $message = "✅ Program actualizat cu succes! Rezervările existente au fost păstrate.";
}

// Preluare sloturi existente
$existingSlots = $pdo->query("SELECT CONCAT(slot_date, '|', slot_time) as slot FROM available_slots")->fetchAll(PDO::FETCH_COLUMN);

// Obține zilele săptămânii în română
$daysOfWeek = [
    0 => 'Duminică',
    1 => 'Luni', 
    2 => 'Marți',
    3 => 'Miercuri',
    4 => 'Joi',
    5 => 'Vineri',
    6 => 'Sâmbătă'
];
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestionare Program - Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .container {
            max-width: 1400px;
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
        
        .main-card {
            background: white;
            border-radius: 25px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
            margin: 0;
        }
        
        .content {
            padding: 40px;
        }
        
        .message {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
            animation: slideInDown 0.5s ease-out;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .control-panel {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 5px solid #667eea;
        }
        
        .quick-actions {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        
        .quick-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .quick-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .quick-btn.danger {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
        }
        
        .quick-btn.success {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
        }
        
        .week-container {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .day-column {
            background: white;
            border-radius: 15px;
            padding: 20px 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            border-top: 4px solid transparent;
        }
        
        .day-column:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 35px rgba(0,0,0,0.12);
        }
        
        .day-header {
            text-align: center;
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 10px;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Culori pentru zilele săptămânii */
        .day-0 .day-header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); } /* Duminică */
        .day-1 .day-header { background: linear-gradient(135deg, #4ecdc4, #26d0ce); } /* Luni */
        .day-2 .day-header { background: linear-gradient(135deg, #45b7d1, #2980b9); } /* Marți */
        .day-3 .day-header { background: linear-gradient(135deg, #96ceb4, #85c1a3); } /* Miercuri */
        .day-4 .day-header { background: linear-gradient(135deg, #f39c12, #e67e22); } /* Joi */
        .day-5 .day-header { background: linear-gradient(135deg, #9b59b6, #8e44ad); } /* Vineri */
        .day-6 .day-header { background: linear-gradient(135deg, #3498db, #2980b9); } /* Sâmbătă */
        
        .day-0 { border-top-color: #ff6b6b; }
        .day-1 { border-top-color: #4ecdc4; }
        .day-2 { border-top-color: #45b7d1; }
        .day-3 { border-top-color: #96ceb4; }
        .day-4 { border-top-color: #f39c12; }
        .day-5 { border-top-color: #9b59b6; }
        .day-6 { border-top-color: #3498db; }
        
        .time-slot {
            margin-bottom: 8px;
            position: relative;
        }
        
        .time-slot input[type="checkbox"] {
            display: none;
        }
        
        .time-slot label {
            display: block;
            padding: 10px 12px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            text-align: center;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #495057;
        }
        
        .time-slot label:hover {
            background: #e9ecef;
            border-color: #667eea;
            transform: scale(1.02);
        }
        
        .time-slot input[type="checkbox"]:checked + label {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-color: #667eea;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .day-stats {
            text-align: center;
            margin-top: 15px;
            padding: 8px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #667eea;
        }
        
        .save-section {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 20px;
            margin-top: 30px;
        }
        
        .save-btn {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            border: none;
            padding: 18px 40px;
            border-radius: 25px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
        }
        
        .save-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(46, 204, 113, 0.4);
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            margin-top: 30px;
            padding: 15px 25px;
            border-radius: 25px;
            background: rgba(102, 126, 234, 0.1);
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateX(-5px);
            color: #764ba2;
            text-decoration: none;
        }
        
        .total-selected {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 1000;
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
            .week-container {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .week-container {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .quick-actions {
                justify-content: center;
            }
            
            .quick-btn {
                flex: 1;
                min-width: 120px;
            }
        }
        
        @media (max-width: 480px) {
            .week-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-card">
            <div class="header">
                <h1>⏰ Gestionare Program</h1>
                <p>Selectează zilele și orele când ești disponibil(ă) pentru consultații</p>
            </div>
            
            <div class="content">
                <?php if (isset($message)): ?>
                    <div class="message"><?= $message ?></div>
                <?php endif; ?>
                
                <div class="control-panel">
                    <h5 style="margin-bottom: 15px; color: #2c3e50;">🚀 Acțiuni Rapide</h5>
                    <div class="quick-actions">
                        <button type="button" class="quick-btn" onclick="selectWorkingHours()">
                            ⏰ Program Lucru (9-17)
                        </button>
                        <button type="button" class="quick-btn" onclick="selectWeekdays()">
                            📅 Doar Zilele Lucrătoare
                        </button>
                        <button type="button" class="quick-btn" onclick="selectAll()">
                            ✅ Selectează Tot
                        </button>
                        <button type="button" class="quick-btn danger" onclick="clearAll()">
                            ❌ Șterge Tot
                        </button>
                    </div>
                    <div style="font-size: 0.9rem; color: #6c757d; font-style: italic;">
                        💡 Folosește butoanele de mai sus pentru selecții rapide, apoi personalizează manual
                    </div>
                </div>

                <form method="POST" id="scheduleForm">
                    <div class="week-container">
                        <?php
                        $startDate = new DateTime();
                        $selectedCount = 0;
                        
                        for ($d = 0; $d < 7; $d++) {
                            $date = $startDate->format('Y-m-d');
                            $dayIndex = $startDate->format('w');
                            $dayName = $daysOfWeek[$dayIndex];
                            $daySlots = [];
                            $daySelectedCount = 0;
                            
                            echo "<div class='day-column day-$dayIndex'>";
                            echo "<div class='day-header'>$dayName<br><small>{$startDate->format('d.m')}</small></div>";
                            
                            for ($h = 9; $h <= 17; $h++) {
                                // Slot 00
                                $time00 = sprintf('%02d:00:00', $h);
                                $slotKey00 = $date . '|' . $time00;
                                $checked00 = in_array($slotKey00, $existingSlots) ? 'checked' : '';
                                if ($checked00) $daySelectedCount++;
                                
                                echo "<div class='time-slot'>
                                        <input type='checkbox' name='slots[]' id='$slotKey00' value='$slotKey00' $checked00>
                                        <label for='$slotKey00'>" . sprintf('%02d:00', $h) . "</label>
                                      </div>";
                                
                                // Slot 30
                                $time30 = sprintf('%02d:30:00', $h);
                                $slotKey30 = $date . '|' . $time30;
                                $checked30 = in_array($slotKey30, $existingSlots) ? 'checked' : '';
                                if ($checked30) $daySelectedCount++;
                                
                                echo "<div class='time-slot'>
                                        <input type='checkbox' name='slots[]' id='$slotKey30' value='$slotKey30' $checked30>
                                        <label for='$slotKey30'>" . sprintf('%02d:30', $h) . "</label>
                                      </div>";
                            }
                            
                            echo "<div class='day-stats'>
                                    <span class='selected-count'>$daySelectedCount</span> / 18 sloturi
                                  </div>";
                            echo "</div>";
                            
                            $selectedCount += $daySelectedCount;
                            $startDate->modify('+1 day');
                        }
                        ?>
                    </div>
                    
                    <div class="save-section">
                        <button type="submit" class="save-btn">
                            💾 Salvează Programul
                        </button>
                        <div style="margin-top: 15px; color: #6c757d;">
                            Modificările vor fi aplicate imediat pentru rezervările viitoare
                        </div>
                    </div>
                </form>

                <a href="admin_dashboard.php" class="back-link">
                    ← Înapoi la Dashboard
                </a>
            </div>
        </div>
    </div>
    
    <div class="total-selected" id="totalSelected">
        📊 <span id="totalCount"><?= count($existingSlots) ?></span> sloturi selectate
    </div>

    <script>
        // Funcții pentru acțiuni rapide
        function selectWorkingHours() {
            clearAll();
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const time = checkbox.id.split('|')[1];
                const hour = parseInt(time.split(':')[0]);
                if (hour >= 9 && hour <= 17) {
                    checkbox.checked = true;
                }
            });
            updateCounts();
        }
        
        function selectWeekdays() {
            clearAll();
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const date = checkbox.id.split('|')[0];
                const dayOfWeek = new Date(date).getDay();
                if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Luni-Vineri
                    checkbox.checked = true;
                }
            });
            updateCounts();
        }
        
        function selectAll() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            updateCounts();
        }
        
        function clearAll() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateCounts();
        }
        
        function updateCounts() {
            // Actualizează contoarele pentru fiecare zi
            const dayColumns = document.querySelectorAll('.day-column');
            let totalSelected = 0;
            
            dayColumns.forEach(column => {
                const checkboxes = column.querySelectorAll('input[type="checkbox"]:checked');
                const count = checkboxes.length;
                const countElement = column.querySelector('.selected-count');
                if (countElement) {
                    countElement.textContent = count;
                }
                totalSelected += count;
            });
            
            // Actualizează contorul total
            document.getElementById('totalCount').textContent = totalSelected;
        }
        
        // Event listeners pentru actualizarea automată a contorilor
        document.addEventListener('DOMContentLoaded', function() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateCounts);
            });
            
            // Animație pentru salvare
            const form = document.getElementById('scheduleForm');
            form.addEventListener('submit', function() {
                const saveBtn = document.querySelector('.save-btn');
                saveBtn.innerHTML = '⏳ Se salvează...';
                saveBtn.disabled = true;
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'a':
                        e.preventDefault();
                        selectAll();
                        break;
                    case 'd':
                        e.preventDefault();
                        clearAll();
                        break;
                    case 'w':
                        e.preventDefault();
                        selectWorkingHours();
                        break;
                }
            }
        });
    </script>
</body>
</html>