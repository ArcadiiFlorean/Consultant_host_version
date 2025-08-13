<?php 
session_start(); 
if (!isset($_SESSION['admin_logged_in'])) {     
    header("Location: admin_login.php");     
    exit; 
} 
include 'db.php';  

if ($_SERVER["REQUEST_METHOD"] === "POST") {     
    if (isset($_POST['action']) && $_POST['action'] === 'update') {
        // Actualizare serviciu existent
        $stmt = $pdo->prepare("UPDATE services SET name=?, price=?, currency=?, description=?, popular=?, icon=?, features=? WHERE id=?");     
        $features = isset($_POST['features']) ? implode('|', array_filter($_POST['features'])) : '';
        $popular = isset($_POST['popular']) ? 1 : 0;
        $stmt->execute([
            $_POST['name'], 
            $_POST['price'], 
            $_POST['currency'], 
            $_POST['description'], 
            $popular,
            $_POST['icon'],
            $features,
            $_POST['id']
        ]);
        $message = "Serviciul a fost actualizat cu succes!";
    } elseif (isset($_POST['action']) && $_POST['action'] === 'add') {
        // Adăugare serviciu nou
        $stmt = $pdo->prepare("INSERT INTO services (name, price, currency, description, popular, icon, features) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $features = isset($_POST['features']) ? implode('|', array_filter($_POST['features'])) : '';
        $popular = isset($_POST['popular']) ? 1 : 0;
        $stmt->execute([
            $_POST['name'], 
            $_POST['price'], 
            $_POST['currency'], 
            $_POST['description'], 
            $popular,
            $_POST['icon'],
            $features
        ]);
        $message = "Serviciul a fost adăugat cu succes!";
    } elseif (isset($_POST['action']) && $_POST['action'] === 'delete') {
        // Ștergere serviciu
        $stmt = $pdo->prepare("DELETE FROM services WHERE id=?");
        $stmt->execute([$_POST['id']]);
        $message = "Serviciul a fost șters cu succes!";
    }
}  

$services = $pdo->query("SELECT * FROM services ORDER BY popular DESC, id ASC")->fetchAll(); 
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestionare Servicii - Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #dc9071 0%, #b06b4c 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
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
            backdrop-filter: blur(10px);
        }
        
        .header {
            background: linear-gradient(135deg, #dc9071 0%, #b06b4c 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
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
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
            border: none;
            font-weight: 600;
            text-align: center;
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
        
        .section-title {
            color: #2c3e50;
            font-weight: 700;
            font-size: 1.5rem;
            margin: 40px 0 25px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            flex: 1;
            height: 3px;
            background: linear-gradient(135deg, #dc9071, #b06b4c);
            border-radius: 2px;
            margin-left: 20px;
        }
        
        .service-form {
            background: linear-gradient(135deg, #fef6f2 0%, #f5f5f5 100%);
            border: none;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .service-form::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(220, 144, 113, 0.05) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .service-form:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }
        
        .service-form:hover::before {
            opacity: 1;
        }
        
        .add-form {
            border-left: 5px solid #2ecc71;
        }
        
        .edit-form {
            border-left: 5px solid #dc9071;
        }
        
        .popular-form {
            border-left: 5px solid #f39c12;
            background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%);
        }
        
        .form-group {
            margin-bottom: 25px;
            position: relative;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .form-control, .form-select {
            border: 2px solid #e1e8ed;
            border-radius: 12px;
            padding: 15px 20px;
            font-size: 1em;
            transition: all 0.3s ease;
            background: white;
            font-weight: 500;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: #dc9071;
            box-shadow: 0 0 0 0.2rem rgba(220, 144, 113, 0.25);
            background: white;
            outline: none;
        }
        
        .form-control:hover, .form-select:hover {
            border-color: #b06b4c;
        }
        
        textarea.form-control {
            resize: vertical;
            min-height: 100px;
        }
        
        .features-container {
            background: white;
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #e1e8ed;
        }
        
        .feature-input {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .feature-input input {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
        }
        
        .add-feature-btn {
            background: #dc9071;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 15px;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .add-feature-btn:hover {
            background: #b06b4c;
        }
        
        .remove-feature-btn {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 0.8em;
        }
        
        .popular-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #fff8e1, #ffecb3);
            padding: 15px 20px;
            border-radius: 12px;
            border: 2px solid #f39c12;
        }
        
        .popular-checkbox input {
            width: 20px;
            height: 20px;
            accent-color: #f39c12;
        }
        
        .popular-checkbox label {
            margin: 0;
            font-weight: 600;
            color: #e67e22;
            cursor: pointer;
        }
        
        .btn-group {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
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
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .btn-add {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
        }
        
        .btn-add:hover {
            background: linear-gradient(135deg, #27ae60, #1e8449);
            color: white;
        }
        
        .btn-save {
            background: linear-gradient(135deg, #dc9071, #b06b4c);
            color: white;
        }
        
        .btn-save:hover {
            background: linear-gradient(135deg, #b06b4c, #8b5a3c);
            color: white;
        }
        
        .btn-delete {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }
        
        .btn-delete:hover {
            background: linear-gradient(135deg, #c0392b, #a93226);
            color: white;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: #dc9071;
            text-decoration: none;
            font-weight: 600;
            margin-top: 30px;
            padding: 15px 25px;
            border-radius: 25px;
            background: rgba(220, 144, 113, 0.1);
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            background: rgba(220, 144, 113, 0.2);
            transform: translateX(-5px);
            color: #b06b4c;
            text-decoration: none;
        }
        
        .service-counter {
            background: rgba(220, 144, 113, 0.1);
            color: #dc9071;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
        }
        
        .service-preview {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            border-left: 4px solid #dc9071;
        }
        
        .preview-title {
            font-size: 1.1em;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .preview-price {
            font-size: 1.5em;
            font-weight: bold;
            color: #dc9071;
            margin-bottom: 5px;
        }
        
        .preview-features {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }
        
        .preview-features li {
            padding: 5px 0;
            color: #666;
            font-size: 0.9em;
        }
        
        .preview-features li:before {
            content: "✓ ";
            color: #dc9071;
            font-weight: bold;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
                flex-direction: column;
                gap: 10px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .service-form {
                padding: 25px 20px;
            }
            
            .btn-group {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
        
        /* Animații pentru formulare */
        .service-form {
            animation: slideInLeft 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .add-form { animation-delay: 0.1s; }
        .edit-form:nth-of-type(1) { animation-delay: 0.2s; }
        .edit-form:nth-of-type(2) { animation-delay: 0.3s; }
        .edit-form:nth-of-type(3) { animation-delay: 0.4s; }
        
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
    </style>
</head>
<body>
    <div class="container">
        <div class="main-card">
            <div class="header">
                <h1>
                    💼 Gestionare Servicii
                </h1>
                <p>Administrează serviciile oferite pentru consultanța în alăptare</p>
            </div>
            
            <div class="content">
                <?php if (isset($message)): ?>
                    <div class="message">
                        ✅ <?= htmlspecialchars($message) ?>
                    </div>
                <?php endif; ?>

                <div class="service-counter">
                    📊 Total servicii: <?= count($services) ?>
                </div>

                <h2 class="section-title">
                    ➕ Adaugă Serviciu Nou
                </h2>
                <form method="POST" class="service-form add-form" id="addForm">
                    <input type="hidden" name="action" value="add">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="new_name">
                                🏷️ Nume serviciu
                            </label>
                            <input type="text" id="new_name" name="name" class="form-control" 
                                   placeholder="ex: Consultație inițială alăptare" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="new_icon">
                                🎨 Tip icon
                            </label>
                            <select id="new_icon" name="icon" class="form-select" required>
                                <option value="">Selectează iconul</option>
                                <option value="consultation">💬 Consultație</option>
                                <option value="premium">⭐ Premium</option>
                                <option value="emergency">🚨 Urgență</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="new_price">
                                💰 Preț (numai cifre)
                            </label>
                            <input type="number" id="new_price" name="price" class="form-control" 
                                   placeholder="ex: 150" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="new_currency">
                                💱 Monedă
                            </label>
                            <select id="new_currency" name="currency" class="form-select" required>
                                <option value="GBP">£ GBP (Pounds)</option>
                                <option value="EUR">€ EUR</option>
                                <option value="USD">$ USD</option>
                                <option value="RON">RON</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="new_description">
                            📝 Descriere
                        </label>
                        <textarea id="new_description" name="description" class="form-control" 
                                  placeholder="Descrierea detaliată a serviciului oferit..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            ⭐ Caracteristici incluse
                        </label>
                        <div class="features-container">
                            <div id="features-list">
                                <div class="feature-input">
                                    <input type="text" name="features[]" placeholder="ex: Evaluare completă" class="form-control">
                                    <button type="button" class="remove-feature-btn" onclick="removeFeature(this)">×</button>
                                </div>
                            </div>
                            <button type="button" class="add-feature-btn" onclick="addFeature()">
                                + Adaugă caracteristică
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="popular-checkbox">
                            <input type="checkbox" id="new_popular" name="popular" value="1">
                            <label for="new_popular">⭐ Marchează ca "Cel mai popular"</label>
                        </div>
                    </div>
                    
                    <div class="btn-group">
                        <button type="submit" class="btn btn-add">
                            ➕ Adaugă Serviciu
                        </button>
                    </div>
                </form>

                <?php if (!empty($services)): ?>
                    <h2 class="section-title">
                        ✏️ Servicii Existente
                    </h2>
                    
                    <?php foreach ($services as $index => $s): 
                        $features = $s['features'] ? explode('|', $s['features']) : [];
                        $formClass = $s['popular'] ? 'service-form edit-form popular-form' : 'service-form edit-form';
                    ?> 
                    <form method="POST" class="<?= $formClass ?>">
                        <input type="hidden" name="action" value="update">
                        <input type="hidden" name="id" value="<?= $s['id'] ?>">
                        
                        <?php if ($s['popular']): ?>
                            <div style="text-align: center; margin-bottom: 20px;">
                                <span style="background: #f39c12; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; font-weight: 600;">
                                    ⭐ SERVICIU POPULAR ⭐
                                </span>
                            </div>
                        <?php endif; ?>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="name_<?= $s['id'] ?>">
                                    🏷️ Nume serviciu
                                </label>
                                <input type="text" id="name_<?= $s['id'] ?>" name="name" class="form-control" 
                                       value="<?= htmlspecialchars($s['name']) ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="icon_<?= $s['id'] ?>">
                                    🎨 Tip icon
                                </label>
                                <select id="icon_<?= $s['id'] ?>" name="icon" class="form-select" required>
                                    <option value="consultation" <?= $s['icon'] === 'consultation' ? 'selected' : '' ?>>💬 Consultație</option>
                                    <option value="premium" <?= $s['icon'] === 'premium' ? 'selected' : '' ?>>⭐ Premium</option>
                                    <option value="emergency" <?= $s['icon'] === 'emergency' ? 'selected' : '' ?>>🚨 Urgență</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="price_<?= $s['id'] ?>">
                                    💰 Preț
                                </label>
                                <input type="number" id="price_<?= $s['id'] ?>" name="price" class="form-control" 
                                       value="<?= htmlspecialchars($s['price']) ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="currency_<?= $s['id'] ?>">
                                    💱 Monedă
                                </label>
                                <select id="currency_<?= $s['id'] ?>" name="currency" class="form-select" required>
                                    <option value="GBP" <?= ($s['currency'] ?? 'GBP') === 'GBP' ? 'selected' : '' ?>>£ GBP (Pounds)</option>
                                    <option value="EUR" <?= ($s['currency'] ?? 'GBP') === 'EUR' ? 'selected' : '' ?>>€ EUR</option>
                                    <option value="USD" <?= ($s['currency'] ?? 'GBP') === 'USD' ? 'selected' : '' ?>>$ USD</option>
                                    <option value="RON" <?= ($s['currency'] ?? 'GBP') === 'RON' ? 'selected' : '' ?>>RON</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="desc_<?= $s['id'] ?>">
                                📝 Descriere
                            </label>
                            <textarea id="desc_<?= $s['id'] ?>" name="description" class="form-control" required><?= htmlspecialchars($s['description'] ?? '') ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                ⭐ Caracteristici incluse
                            </label>
                            <div class="features-container">
                                <div class="features-list-<?= $s['id'] ?>">
                                    <?php foreach ($features as $feature): ?>
                                        <?php if (trim($feature)): ?>
                                            <div class="feature-input">
                                                <input type="text" name="features[]" value="<?= htmlspecialchars(trim($feature)) ?>" class="form-control">
                                                <button type="button" class="remove-feature-btn" onclick="removeFeature(this)">×</button>
                                            </div>
                                        <?php endif; ?>
                                    <?php endforeach; ?>
                                    <?php if (empty($features) || count(array_filter($features)) === 0): ?>
                                        <div class="feature-input">
                                            <input type="text" name="features[]" placeholder="ex: Evaluare completă" class="form-control">
                                            <button type="button" class="remove-feature-btn" onclick="removeFeature(this)">×</button>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <button type="button" class="add-feature-btn" onclick="addFeatureToService(<?= $s['id'] ?>)">
                                    + Adaugă caracteristică
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="popular-checkbox">
                                <input type="checkbox" id="popular_<?= $s['id'] ?>" name="popular" value="1" <?= $s['popular'] ? 'checked' : '' ?>>
                                <label for="popular_<?= $s['id'] ?>">⭐ Marchează ca "Cel mai popular"</label>
                            </div>
                        </div>
                        
                        <!-- Preview -->
                        <div class="service-preview">
                            <div class="preview-title"><?= htmlspecialchars($s['name']) ?></div>
                            <div class="preview-price"><?= htmlspecialchars($s['price']) ?> <?= htmlspecialchars($s['currency'] ?? 'GBP') ?></div>
                            <p style="color: #666; margin: 10px 0;"><?= htmlspecialchars($s['description']) ?></p>
                            <?php if (!empty($features) && count(array_filter($features)) > 0): ?>
                                <ul class="preview-features">
                                    <?php foreach ($features as $feature): ?>
                                        <?php if (trim($feature)): ?>
                                            <li><?= htmlspecialchars(trim($feature)) ?></li>
                                        <?php endif; ?>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                        
                        <div class="btn-group">
                            <button type="submit" class="btn btn-save">
                                💾 Salvează Modificările
                            </button>
                            
                            <button type="submit" name="action" value="delete" class="btn btn-delete" 
                                    onclick="return confirm('⚠️ Ești sigur că vrei să ștergi acest serviciu?\n\nAceastă acțiune nu poate fi anulată!')">
                                🗑️ Șterge Serviciu
                            </button>
                        </div>
                    </form> 
                    <?php endforeach; ?>
                    
                <?php else: ?>
                    <div class="empty-state" style="text-align: center; padding: 60px 20px; color: #7f8c8d;">
                        <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #34495e;">📋 Nu există servicii</h3>
                        <p>Începe prin a adăuga primul serviciu folosind formularul de mai sus.</p>
                    </div>
                <?php endif; ?>

                <a href="admin_dashboard.php" class="back-link">
                    ← Înapoi la Dashboard
                </a>
            </div>
        </div>
    </div>

    <script>
        // Adaugă caracteristică nouă pentru formularul de adăugare
        function addFeature() {
            const featuresList = document.getElementById('features-list');
            const newFeature = document.createElement('div');
            newFeature.className = 'feature-input';
            newFeature.innerHTML = `
                <input type="text" name="features[]" placeholder="ex: Suport 24/7" class="form-control">
                <button type="button" class="remove-feature-btn" onclick="removeFeature(this)">×</button>
            `;
            featuresList.appendChild(newFeature);
        }
        
        // Adaugă caracteristică pentru un serviciu specific
        function addFeatureToService(serviceId) {
            const featuresList = document.querySelector('.features-list-' + serviceId);
            const newFeature = document.createElement('div');
            newFeature.className = 'feature-input';
            newFeature.innerHTML = `
                <input type="text" name="features[]" placeholder="ex: Suport 24/7" class="form-control">
                <button type="button" class="remove-feature-btn" onclick="removeFeature(this)">×</button>
            `;
            featuresList.appendChild(newFeature);
        }
        
        // Elimină caracteristică
        function removeFeature(button) {
            const featureInput = button.parentElement;
            const container = featureInput.parentElement;
            
            // Nu permite ștergerea dacă e singura caracteristică
            if (container.children.length > 1) {
                featureInput.remove();
            } else {
                alert('Trebuie să existe cel puțin o caracteristică!');
            }
        }

        // Efecte interactive
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const submitBtn = this.querySelector('button[type="submit"]:not([name="action"])') || 
                                    this.querySelector('button[type="submit"]');
                    
                    if (submitBtn && !submitBtn.name) {
                        submitBtn.classList.add('loading');
                        submitBtn.innerHTML = submitBtn.innerHTML.replace('💾', '⏳');
                    }
                });
            });
            
            // Animație pentru input focus
            const inputs = document.querySelectorAll('.form-control, .form-select');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'scale(1.02)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'scale(1)';
                });
            });
            
            // Auto-save draft pentru formular nou
            const newForm = document.querySelector('.add-form');
            if (newForm) {
                const inputs = newForm.querySelectorAll('.form-control, .form-select');
                inputs.forEach(input => {
                    input.addEventListener('input', function() {
                        localStorage.setItem('draft_' + this.name, this.value);
                    });
                    
                    // Restore draft
                    const draft = localStorage.getItem('draft_' + input.name);
                    if (draft && !input.value) {
                        input.value = draft;
                    }
                });
                
                // Clear draft on submit
                newForm.addEventListener('submit', function() {
                    inputs.forEach(input => {
                        localStorage.removeItem('draft_' + input.name);
                    });
                });
            }
            
            // Preview în timp real pentru formularul de adăugare
            const previewElements = {
                name: document.getElementById('new_name'),
                price: document.getElementById('new_price'),
                currency: document.getElementById('new_currency'),
                description: document.getElementById('new_description')
            };
            
            // Validare formulare
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', function(e) {
                    const requiredFields = form.querySelectorAll('[required]');
                    let isValid = true;
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            field.style.borderColor = '#e74c3c';
                            isValid = false;
                        } else {
                            field.style.borderColor = '#e1e8ed';
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                        alert('⚠️ Te rugăm să completezi toate câmpurile obligatorii!');
                    }
                });
            });
            
            // Smooth scroll pentru secțiuni
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Toast notifications pentru mesaje de succes
            const message = document.querySelector('.message');
            if (message) {
                setTimeout(() => {
                    message.style.animation = 'slideOutUp 0.5s ease-out forwards';
                    setTimeout(() => {
                        message.style.display = 'none';
                    }, 500);
                }, 3000);
            }
        });
        
        // Animația pentru slideOutUp
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideOutUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
            
            .loading {
                opacity: 0.7;
                pointer-events: none;
            }
            
            .loading::after {
                content: '⏳';
                margin-left: 5px;
            }
        `;
        document.head.appendChild(style);
    </script>
</body>
</html>