<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: admin_login.php");
    exit;
}

// Includem conexiunea la baza de date
include 'db.php';
include 'documents_manager.php';
// Calculează statistici reale din baza de date
try {
    // Total rezervări active (viitoare)
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM bookings WHERE date >= CURDATE()");
    $stmt->execute();
    $rezervari_active = $stmt->fetch()['total'];
    
    // Clienți noi (din ultima lună)
    $stmt = $pdo->prepare("SELECT COUNT(DISTINCT client_id) as total FROM bookings WHERE booked_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    $stmt->execute();
    $clienti_noi = $stmt->fetch()['total'];
    
    // Calculează satisfacția (exemplu: rezervări confirmate vs totale)
    $stmt = $pdo->prepare("SELECT 
        (COUNT(CASE WHEN payment_method IS NOT NULL THEN 1 END) * 100.0 / COUNT(*)) as satisfactie 
        FROM bookings WHERE date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)");
    $stmt->execute();
    $satisfactie = round($stmt->fetch()['satisfactie'] ?? 95);
    
    // STATISTICĂ PENTRU TESTIMONIALS
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM testimonials_simple WHERE status = 'active'");
    $stmt->execute();
    $recenzii_active = $stmt->fetch()['total'] ?? 0;
    
} catch (PDOException $e) {
    // Valori default în caz de eroare
    $rezervari_active = 0;
    $clienti_noi = 0;
    $satisfactie = 95;
    $recenzii_active = 0;
}
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Consultant Alăptare</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">


    <style>
/* Reset + bază */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
    min-height: 100vh;
    overflow-x: hidden;
}

.dashboard-container {
    min-height: 100vh;
    padding: 40px 20px;
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header {
    text-align: center;
    margin-bottom: 50px;
    color: white;
}

.header h1 {
    font-size: 3rem;
    font-weight: 700;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    margin-bottom: 15px;
    letter-spacing: -1px;
}

.header p {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 300;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

.dashboard-card {
    background: white;
    border-radius: 25px;
    padding: 40px 30px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: block;
    cursor: pointer;
    border: none;
    animation: slideInUp 0.6s ease-out;
    animation-fill-mode: both;
}

.dashboard-card:nth-child(1) { animation-delay: 0.1s; }
.dashboard-card:nth-child(2) { animation-delay: 0.2s; }
.dashboard-card:nth-child(3) { animation-delay: 0.3s; }
.dashboard-card:nth-child(4) { animation-delay: 0.4s; }
.dashboard-card:nth-child(5) { animation-delay: 0.5s; }

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dashboard-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 155, 155, 0.05) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.dashboard-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 80px rgba(0,0,0,0.25);
    text-decoration: none;
    color: inherit;
}

.dashboard-card:hover::before {
    opacity: 1;
}

.card-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 25px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    transition: all 0.3s ease;
}

.dashboard-card:hover .card-icon {
    transform: scale(1.1) rotate(5deg);
}

.card-services .card-icon {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
}
.card-slots .card-icon {
    background: linear-gradient(135deg, #4ecdc4, #26d0ce);
    color: white;
}
.card-bookings .card-icon {
    background: linear-gradient(135deg, #45b7d1, #2980b9);
    color: white;
}
.card-testimonials .card-icon {
    background: linear-gradient(135deg, #fd79a8, #e84393);
    color: white;
}
.card-logout .card-icon {
    background: linear-gradient(135deg, #96ceb4, #85c1a3);
    color: white;
}

.card-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 15px;
    letter-spacing: -0.5px;
}

.card-description {
    color: #7f8c8d;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 20px;
}

.card-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 25px;
    border-radius: 25px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.card-services .card-action {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
}
.card-slots .card-action {
    background: linear-gradient(135deg, #4ecdc4, #26d0ce);
    color: white;
}
.card-bookings .card-action {
    background: linear-gradient(135deg, #45b7d1, #2980b9);
    color: white;
}
.card-testimonials .card-action {
    background: linear-gradient(135deg, #fd79a8, #e84393);
    color: white;
}
.card-logout .card-action {
    background: linear-gradient(135deg, #96ceb4, #85c1a3);
    color: white;
}

.dashboard-card:hover .card-action {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.stats-bar {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 25px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-around;
    text-align: center;
    color: white;
    max-width: 1000px;
    animation: fadeIn 1s ease-out 0.5s both;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.stat-item h3 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 5px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.stat-item p {
    font-size: 0.9rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-container {
        padding: 20px 15px;
    }

    .header h1 {
        font-size: 2.2rem;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .dashboard-card {
        padding: 30px 20px;
    }

    .stats-bar {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
}

.card-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
}

/* Modal styles pentru testimonials */
.modal-content {
    border: none;
    border-radius: 25px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.15);
    overflow: hidden;
}

.modal-header {
    background: linear-gradient(135deg, #fd79a8, #e84393);
    border: none;
    padding: 25px 30px;
}

.modal-header .modal-title {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.nav-tabs .nav-link {
    border: none;
    background: none;
    color: #fd79a8;
    font-weight: 600;
    padding: 15px 25px;
    border-radius: 15px 15px 0 0;
    margin-right: 5px;
    transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
    background: linear-gradient(135deg, #fd79a8/10, #e84393/10);
    color: #e84393;
    transform: translateY(-2px);
}

.nav-tabs .nav-link.active {
    background: linear-gradient(135deg, #fd79a8, #e84393);
    color: white;
}

.testimonial-form {
    padding: 30px 20px;
}

.form-floating .form-control,
.form-floating .form-select {
    border: 2px solid #e2e8f0;
    border-radius: 15px;
    padding: 20px 15px 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8fafc;
}

.form-floating .form-control:focus,
.form-floating .form-select:focus {
    border-color: #fd79a8;
    box-shadow: 0 0 0 0.2rem rgba(253, 121, 168, 0.15);
    background: white;
    transform: translateY(-2px);
}

.form-floating label {
    color: #4a5568;
    font-weight: 600;
    padding: 15px;
    transition: all 0.3s ease;
}

.rating-container {
    text-align: center;
    margin: 25px 0;
}

.rating-stars {
    font-size: 2rem;
    gap: 10px;
    display: flex;
    justify-content: center;
    margin: 15px 0;
}

.rating-star {
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.3;
}

.rating-star.active,
.rating-star:hover {
    opacity: 1;
    transform: scale(1.2);
}

.btn-save-testimonial {
    background: linear-gradient(135deg, #fd79a8, #e84393);
    border: none;
    color: white;
    font-weight: 700;
    padding: 18px 40px;
    border-radius: 50px;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.4s ease;
    box-shadow: 0 10px 25px rgba(253, 121, 168, 0.3);
    width: 100%;
    margin-top: 20px;
}

.btn-save-testimonial:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 35px rgba(253, 121, 168, 0.4);
}

.testimonials-loading,
.testimonials-empty {
    text-align: center;
    padding: 60px 40px;
    color: #4a5568;
}

.testimonials-loading .spinner-border {
    width: 3rem;
    height: 3rem;
    color: #fd79a8;
}

.testimonials-empty i {
    font-size: 4rem;
    color: #cbd5e0;
    margin-bottom: 20px;
}

.testimonial-item {
    background: white;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.testimonial-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #fd79a8, #e84393);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.testimonial-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.12);
}

.testimonial-item:hover::before {
    transform: scaleX(1);
}

.btn-delete-testimonial {
    background: linear-gradient(135deg, #fc8181, #f56565);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.btn-delete-testimonial:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(252, 129, 129, 0.4);
}
/* CSS existent pentru carduri ... */

/* ADAUGĂ ACESTEA: */
.card-documents .card-icon {
    background: linear-gradient(135deg, #a8e6cf, #7fcdcd);
    color: white;
}

.card-documents .card-action {
    background: linear-gradient(135deg, #a8e6cf, #7fcdcd);
    color: white;
}
</style>
</head>
<body>

    <div class="dashboard-container">
        <div class="header">
            <h1>🌸 Pufet</h1>
            <p>Cu drag, pentru Pufica – sprijinul mamelor, inspirația mea</p>
        </div>

        <div class="stats-bar">
            <div class="stat-item">
                <h3><?php echo $rezervari_active; ?></h3>
                <p>Rezervări active</p>
            </div>
            <div class="stat-item">
                <h3><?php echo $clienti_noi; ?></h3>
                <p>Clienți noi</p>
            </div>
            <div class="stat-item">
                <h3><?php echo $satisfactie; ?>%</h3>
                <p>Satisfacție</p>
            </div>
            <div class="stat-item">
                <h3 id="testimonials-count"><?php echo $recenzii_active; ?></h3>
                <p>Recenzii</p>
            </div>
             <?php echo renderDocumentsStats(); ?>
        </div>

        <div class="dashboard-grid">
            <a href="manage_services.php" class="dashboard-card card-services">
                <div class="card-icon">💼</div>
                <h3 class="card-title">Gestionare Servicii</h3>
                <p class="card-description">Editează serviciile oferite, prețurile și descrierile pentru consultații</p>
                <div class="card-action">
                    ✏️ Editează servicii
                </div>
            </a>

            <a href="manage_slots.php" class="dashboard-card card-slots">
                <div class="card-icon">⏰</div>
                <h3 class="card-title">Programare Ore</h3>
                <p class="card-description">Setează și gestionează orele disponibile pentru programări</p>
                <div class="card-action">
                    🕒 Setează orele
                </div>
            </a>

            <a href="view_bookings.php" class="dashboard-card card-bookings">
                <div class="card-icon">📋</div>
                <h3 class="card-title">Rezervări</h3>
                <p class="card-description">Vizualizează, editează și gestionează toate rezervările clienților</p>
                <div class="card-action">
                    👁️ Vezi rezervări
                </div>
            </a>

            <button type="button" class="dashboard-card card-testimonials" onclick="openTestimonialsModal()">
                <div class="card-icon">💖</div>
                <h3 class="card-title">Recenzii Clienți</h3>
                <p class="card-description">Adaugă și gestionează recenziile clienților care apar automat pe site</p>
                <div class="card-action">
                    ⭐ Gestionează recenzii
                </div>
            </button>
 <?php echo renderDocumentsCard(); ?>
            <a href="logout.php" class="dashboard-card card-logout">
                <div class="card-icon">🚪</div>
                <h3 class="card-title">Deconectare</h3>
                <p class="card-description">Închide sesiunea și ieși din panoul de administrare în siguranță</p>
                <div class="card-action">
                    🔓 Logout
                </div>
            </a>
        </div>
    </div>

    <!-- Modal pentru Testimonials -->
    <div class="modal fade" id="testimonialsModal" tabindex="-1" aria-labelledby="testimonialsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="testimonialsModalLabel">
                        <i class="fas fa-heart me-3"></i>Gestionare Recenzii
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs" id="testimonialsTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="add-tab" data-bs-toggle="tab" data-bs-target="#add-testimonial" type="button" role="tab">
                                <i class="fas fa-plus-circle me-2"></i>Adaugă Recenzie Nouă
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="list-tab" data-bs-toggle="tab" data-bs-target="#list-testimonials" type="button" role="tab">
                                <i class="fas fa-list-stars me-2"></i>Toate Recenziile
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="testimonialsTabContent">
                        <div class="tab-pane fade show active" id="add-testimonial" role="tabpanel">
                            <div class="testimonial-form">
                                <div class="text-center mb-4">
                                    <i class="fas fa-quote-left fa-3x text-primary mb-3"></i>
                                    <h4 class="text-primary">Adaugă o nouă recenzie</h4>
                                    <p class="text-muted">Completează formularul pentru a adăuga o recenzie care va apărea automat pe site</p>
                                </div>

                                <form id="testimonialForm">
                                    <div class="form-floating mb-3">
                                        <textarea class="form-control" id="testimonialText" placeholder="Scrie aici textul recenziei..." required style="height: 150px;"></textarea>
                                        <label for="testimonialText">
                                            <i class="fas fa-comment me-2"></i>Textul Recenziei *
                                        </label>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-floating mb-3">
                                                <input type="text" class="form-control" id="testimonialName" placeholder="Ex: Ana Maria" required>
                                                <label for="testimonialName">
                                                    <i class="fas fa-user me-2"></i>Numele Clientei *
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating mb-3">
                                                <input type="text" class="form-control" id="testimonialRole" placeholder="Ex: Mamă din București" required>
                                                <label for="testimonialRole">
                                                    <i class="fas fa-map-marker-alt me-2"></i>Descrierea *
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="rating-container">
                                        <label class="form-label fw-bold text-center d-block">
                                            <i class="fas fa-star me-2 text-warning"></i>Rating (1-5 stele)
                                        </label>
                                        <div class="rating-stars" id="rating-stars">
                                            <span class="rating-star" data-rating="1">⭐</span>
                                            <span class="rating-star" data-rating="2">⭐</span>
                                            <span class="rating-star" data-rating="3">⭐</span>
                                            <span class="rating-star" data-rating="4">⭐</span>
                                            <span class="rating-star" data-rating="5">⭐</span>
                                        </div>
                                        <input type="hidden" id="testimonialRating" value="5">
                                    </div>
                                    
                                    <button type="submit" class="btn-save-testimonial">
                                        <i class="fas fa-heart me-2"></i>Salvează Recenzia
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="list-testimonials" role="tabpanel">
                            <div id="testimonials-loading" class="testimonials-loading" style="display: none;">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="mt-3 text-muted">Se încarcă recenziile...</p>
                            </div>
                            
                            <div id="testimonials-list"></div>
                            
                            <div id="testimonials-empty" class="testimonials-empty" style="display: none;">
                                <i class="fas fa-heart-broken"></i>
                                <h5 class="text-muted mb-3">Nu există recenzii încă</h5>
                                <p class="text-muted">Adaugă prima recenzie pentru a o vedea aici și pe site</p>
                                <button class="btn btn-outline-primary" onclick="document.getElementById('add-tab').click()">
                                    <i class="fas fa-plus me-2"></i>Adaugă Prima Recenzie
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
// ============================================
// CODUL PENTRU TESTIMONIALS
// ============================================
let testimonialsData = [];
let selectedRating = 5;
const API_BASE = 'testimonials_admin_api.php';

function openTestimonialsModal() {
    const modal = new bootstrap.Modal(document.getElementById('testimonialsModal'));
    modal.show();
    loadTestimonialsCount();
    initRatingSystem();
}

function initRatingSystem() {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            document.getElementById('testimonialRating').value = selectedRating;
            updateStarsDisplay();
        });
    });
    updateStarsDisplay();
}

function updateStarsDisplay() {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

async function loadTestimonialsCount() {
    try {
        const response = await fetch(`${API_BASE}?count=1`);
        const data = await response.json();
        if (data.success) {
            const countElement = document.getElementById('testimonials-count');
            if (countElement) {
                countElement.textContent = data.count;
            }
        }
    } catch (error) {
        console.error('Eroare la încărcarea contorului:', error);
    }
}

// Event listener pentru form
document.getElementById('testimonialForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const text = document.getElementById('testimonialText').value.trim();
    const name = document.getElementById('testimonialName').value.trim();
    const role = document.getElementById('testimonialRole').value.trim();
    const rating = selectedRating;
    
    if (!text || !name || !role) {
        showAlert('❌ Completează toate câmpurile obligatorii!', 'danger');
        return;
    }
    
    const submitBtn = document.querySelector('.btn-save-testimonial');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Se salvează...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                author: name,
                role: role,
                rating: rating
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('✅ Recenzia a fost adăugată cu succes!', 'success');
            document.getElementById('testimonialForm').reset();
            selectedRating = 5;
            updateStarsDisplay();
            loadTestimonialsCount();
            
            // Switch to list tab after delay
            setTimeout(() => {
                const listTab = document.getElementById('list-tab');
                if (listTab) {
                    listTab.click();
                }
            }, 1500);
        } else {
            showAlert('❌ Eroare: ' + (data.error || 'Eroare necunoscută'), 'danger');
        }
    } catch (error) {
        showAlert('❌ Eroare de conexiune: ' + error.message, 'danger');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Load testimonials when switching to list tab
document.getElementById('list-tab')?.addEventListener('click', loadTestimonialsList);

async function loadTestimonialsList() {
    const loadingEl = document.getElementById('testimonials-loading');
    const listEl = document.getElementById('testimonials-list');
    const emptyEl = document.getElementById('testimonials-empty');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (listEl) listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'none';
    
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        
        if (data.success) {
            testimonialsData = data.data || [];
            displayTestimonialsList();
        } else {
            throw new Error(data.error || 'Eroare la încărcarea recenziilor');
        }
    } catch (error) {
        console.error('Eroare la încărcarea recenziilor:', error);
        if (listEl) {
            listEl.innerHTML = `
                <div class="text-center text-danger p-4">
                    <i class="fas fa-exclamation-triangle mb-2"></i><br>
                    Eroare la încărcarea recenziilor<br>
                    <small>${error.message}</small>
                </div>
            `;
        }
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

function displayTestimonialsList() {
    const listEl = document.getElementById('testimonials-list');
    const emptyEl = document.getElementById('testimonials-empty');
    
    if (!testimonialsData || testimonialsData.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (listEl) listEl.innerHTML = '';
        return;
    }
    
    if (emptyEl) emptyEl.style.display = 'none';
    
    let html = '';
    testimonialsData.forEach((testimonial, index) => {
        const stars = '⭐'.repeat(testimonial.rating || 5);
        html += `
            <div class="testimonial-item" data-id="${testimonial.id}">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h6 class="fw-bold mb-1">${escapeHtml(testimonial.author)}</h6>
                        <small class="text-muted">${escapeHtml(testimonial.role || '')}</small>
                        <div class="mt-1">${stars}</div>
                    </div>
                    <button class="btn-delete-testimonial" onclick="deleteTestimonial(${testimonial.id})" title="Șterge recenzia">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <p class="text-muted">"${escapeHtml(testimonial.text)}"</p>
                <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>
                    ${new Date(testimonial.created_at).toLocaleDateString('ro-RO')}
                </small>
            </div>
        `;
    });
    
    if (listEl) listEl.innerHTML = html;
}

async function deleteTestimonial(id) {
    if (!confirm('Ștergi această recenzie? Acțiunea nu poate fi anulată.')) {
        return;
    }
    
    const testimonialItem = document.querySelector(`[data-id="${id}"]`);
    const deleteBtn = testimonialItem?.querySelector('.btn-delete-testimonial');
    
    if (deleteBtn) {
        const originalHTML = deleteBtn.innerHTML;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        deleteBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE}?id=${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('✅ Recenzia a fost ștearsă!', 'success');
                
                // Remove from cache
                testimonialsData = testimonialsData.filter(t => t.id != id);
                
                // Remove from DOM with animation
                if (testimonialItem) {
                    testimonialItem.style.transition = 'all 0.3s ease';
                    testimonialItem.style.opacity = '0';
                    testimonialItem.style.transform = 'translateX(-100%)';
                    setTimeout(() => {
                        testimonialItem.remove();
                        if (testimonialsData.length === 0) {
                            displayTestimonialsList();
                        }
                    }, 300);
                }
                
                // Update counter
                loadTestimonialsCount();
            } else {
                throw new Error(data.error || 'Eroare la ștergere');
            }
        } catch (error) {
            showAlert('❌ Eroare la ștergere: ' + error.message, 'danger');
            deleteBtn.innerHTML = originalHTML;
            deleteBtn.disabled = false;
        }
    }
}

// Helper function for escaping HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Alert function
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border-radius: 15px;
        border: none;
    `;
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 4000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard loaded - only testimonials functionality');
    
    // Auto-load testimonials count
    setTimeout(() => {
        loadTestimonialsCount();
    }, 1000);
});
    </script>
<?php integrateDocumentsManager(); ?>
<script src="../src/assets/js/dashboard.js"></script>
<script src="../src/assets/js/documents_upload.js"></script>
</body>
</html>