<?php
/**
 * DOCUMENTS MANAGER - Sistem pentru gestionarea documentelor
 * Fișier: documents_manager.php
 * 
 * Pentru integrarea în admin_dashboard.php adaugă:
 * <?php include 'documents_manager.php'; ?>
 */

// Verifică dacă este încărcată deja baza de date
if (!isset($pdo)) {
    // Include conexiunea la baza de date dacă nu este deja inclusă
    if (file_exists('db.php')) {
        include_once 'db.php';
    }
}

// Calculează statistici pentru documente
$documente_active = 0;
try {
    if (isset($pdo)) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM documents WHERE status = 'active'");
        $stmt->execute();
        $documente_active = $stmt->fetch()['total'] ?? 0;
    }
} catch (PDOException $e) {
    error_log("Eroare la încărcarea statisticilor documentelor: " . $e->getMessage());
}

/**
 * Funcție pentru a afișa statisticile documentelor în bara de sus
 */
function renderDocumentsStats() {
    global $documente_active;
    return '
    <div class="stat-item">
        <h3 id="documents-count">' . $documente_active . '</h3>
        <p>Documente</p>
    </div>';
}

/**
 * Funcție pentru a afișa card-ul documentelor în dashboard
 */
function renderDocumentsCard() {
    return '
    <button type="button" class="dashboard-card card-documents" onclick="openDocumentsModal()">
        <div class="card-icon">📁</div>
        <h3 class="card-title">Documente pentru Clienți</h3>
        <p class="card-description">Încarcă ghiduri, formulare și resurse pentru mamele care te urmăresc</p>
        <div class="card-action">
            📤 Gestionează documente
        </div>
    </button>';
}

/**
 * Funcție pentru a afișa CSS-ul necesar pentru documente
 */
function renderDocumentsCSS() {
    return '
    <style>
    /* STYLES PENTRU DOCUMENTS MANAGER */
    .card-documents .card-icon {
        background: linear-gradient(135deg, #a8e6cf, #7fcdcd);
        color: white;
    }
    
    .card-documents .card-action {
        background: linear-gradient(135deg, #a8e6cf, #7fcdcd);
        color: white;
    }
    
    /* Modal Styles pentru Documente */
    .documents-modal .modal-content {
        border: none;
        border-radius: 25px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.15);
        overflow: hidden;
    }
    
    .documents-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        padding: 25px 30px;
    }
    
    .documents-header .modal-title {
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    /* Tab Navigation pentru Documente */
    .documents-tab {
        border: none;
        background: none;
        color: #667eea;
        font-weight: 600;
        padding: 15px 25px;
        border-radius: 15px 15px 0 0;
        margin-right: 5px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .documents-tab:hover {
        background: linear-gradient(135deg, #667eea/10, #764ba2/10);
        color: #5a67d8;
        transform: translateY(-2px);
    }
    
    .documents-tab.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
    }
    
    /* Upload Area */
    .documents-upload-area {
        border: 3px dashed #cbd5e0;
        border-radius: 20px;
        padding: 60px 40px;
        text-align: center;
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        transition: all 0.4s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
    .documents-upload-area:hover {
        border-color: #667eea;
        background: linear-gradient(135deg, #f0f4ff 0%, #e6efff 100%);
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15);
    }
    
    .documents-upload-area.dragover {
        border-color: #4299e1;
        background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 50%, #90cdf4 100%);
        transform: scale(1.02);
    }
    
    .upload-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 25px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
    
    .documents-upload-area:hover .upload-icon {
        transform: scale(1.1) rotate(10deg);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    }
    
    /* Form Styling pentru Documente */
    .form-floating.documents {
        position: relative;
        margin-bottom: 25px;
    }
    
    .form-floating.documents .form-control,
    .form-floating.documents .form-select {
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        padding: 20px 15px 10px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #f8fafc;
    }
    
    .form-floating.documents .form-control:focus,
    .form-floating.documents .form-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
        background: white;
        transform: translateY(-2px);
    }
    
    .form-floating.documents label {
        color: #4a5568;
        font-weight: 600;
        padding: 15px;
        transition: all 0.3s ease;
    }
    
    /* Buton Save Document */
    .btn-save-document {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        font-weight: 700;
        padding: 18px 40px;
        border-radius: 50px;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.4s ease;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        width: 100%;
        margin-top: 20px;
    }
    
    .btn-save-document:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    }
    
    /* Document Items */
    .document-item {
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
    
    .document-item::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }
    
    .document-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }
    
    .document-item:hover::before {
        transform: scaleX(1);
    }
    
    .document-badge {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 8px 16px;
        border-radius: 25px;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .document-icon {
        font-size: 3rem;
        padding: 15px;
        background: linear-gradient(135deg, #f0f4ff, #e6efff);
        border-radius: 15px;
        text-align: center;
        margin-right: 20px;
        min-width: 70px;
    }
    
    .btn-delete-document {
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
    
    .btn-delete-document:hover {
        transform: scale(1.1);
        box-shadow: 0 5px 15px rgba(252, 129, 129, 0.4);
    }
    
    /* Progress Bar */
    .upload-progress {
        position: relative;
        height: 6px;
        background: #e2e8f0;
        border-radius: 10px;
        margin-top: 20px;
        overflow: hidden;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }
    
    .upload-progress.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .progress-bar-documents {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
        background-size: 200% 100%;
        border-radius: 10px;
        width: 0%;
        transition: width 0.3s ease;
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    /* Badges */
    .badge {
        padding: 8px 15px;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .bg-success {
        background: linear-gradient(135deg, #48bb78, #38a169) !important;
    }
    
    .bg-warning {
        background: linear-gradient(135deg, #ed8936, #dd6b20) !important;
    }
    
    .bg-info {
        background: linear-gradient(135deg, #4299e1, #3182ce) !important;
    }
    
    /* Container pentru preț */
    #price-container {
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Loading și Empty States */
    .documents-loading,
    .documents-empty {
        text-align: center;
        padding: 60px 40px;
        color: #4a5568;
    }
    
    .documents-loading .spinner-border {
        width: 3rem;
        height: 3rem;
        color: #667eea;
    }
    
    .documents-empty i {
        font-size: 4rem;
        color: #cbd5e0;
        margin-bottom: 20px;
    }
    
    /* Responsive pentru documente */
    @media (max-width: 768px) {
        .documents-upload-area {
            padding: 40px 20px;
        }
        
        .upload-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
        }
        
        .btn-save-document {
            padding: 15px 30px;
            font-size: 1rem;
        }
        
        .document-item {
            padding: 20px 15px;
        }
    }
    
    /* Scroll customizat pentru lista de documente */
    #documents-list {
        min-height: 400px;
        max-height: 500px;
        overflow-y: auto;
        padding: 10px 0;
    }
    
    #documents-list::-webkit-scrollbar {
        width: 8px;
    }
    
    #documents-list::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
    }
    
    #documents-list::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 10px;
    }
    
    #documents-list::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a67d8, #6b46c1);
    }
    </style>';
}

/**
 * Funcție pentru a afișa HTML-ul modalului pentru documente
 */
function renderDocumentsModal() {
    return '
    <!-- MODAL PENTRU DOCUMENTE -->
    <div class="modal fade documents-modal" id="documentsModal" tabindex="-1" aria-labelledby="documentsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header documents-header">
                    <h5 class="modal-title" id="documentsModalLabel">
                        <i class="fas fa-folder-open me-3"></i>Gestionare Documente
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Tab Navigation -->
                    <ul class="nav nav-tabs" id="documentsTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link documents-tab active" id="upload-tab" data-bs-toggle="tab" data-bs-target="#upload-document" type="button" role="tab">
                                <i class="fas fa-cloud-upload-alt me-2"></i>Încarcă Document Nou
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link documents-tab" id="documents-list-tab" data-bs-toggle="tab" data-bs-target="#list-documents" type="button" role="tab">
                                <i class="fas fa-list me-2"></i>Toate Documentele
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="documentsTabContent">
                        <!-- Tab pentru Upload -->
                        <div class="tab-pane fade show active" id="upload-document" role="tabpanel">
                            <div class="p-4">
                                <div class="text-center mb-4">
                                    <i class="fas fa-file-upload fa-3x text-primary mb-3"></i>
                                    <h4 class="text-primary">Încarcă un document nou</h4>
                                    <p class="text-muted">Adaugă ghiduri, resurse și materiale pentru clienții tăi</p>
                                </div>

                                <!-- Upload Area -->
                                <div class="documents-upload-area" id="upload-area">
                                    <div class="upload-icon">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                    </div>
                                    <h5 class="text-documents">Glisează fișierul aici sau click pentru selectare</h5>
                                    <p class="text-muted">Acceptă: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, imagini</p>
                                    <p class="text-muted small">Dimensiunea maximă: 10MB</p>
                                    
                                    <!-- Progress Bar -->
                                    <div class="upload-progress" id="upload-progress">
                                        <div class="progress-bar-documents" id="progress-bar"></div>
                                    </div>
                                </div>

                                <!-- Form Upload -->
                                <form id="document-upload-form" class="mt-4">
                                    <input type="file" id="document-file" class="d-none" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp">
                                    
                                    <!-- File Info -->
                                    <div id="file-info" class="alert alert-info" style="display: none;">
                                        <i class="fas fa-file me-2"></i>
                                        <strong>Fișier selectat:</strong> <span id="selected-file-name"></span>
                                        (<span id="selected-file-size"></span>)
                                    </div>

                                    <!-- Form fields -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-floating documents">
                                                <input type="text" class="form-control" id="document-title" placeholder="Ex: Ghid Alăptare Naturală" required>
                                                <label for="document-title">
                                                    <i class="fas fa-heading me-2"></i>Titlul Documentului *
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating documents">
                                                <select class="form-select" id="document-category">
                                                    <option value="ghiduri">📖 Ghiduri și Tutoriale</option>
                                                    <option value="formulare">📋 Formulare</option>
                                                    <option value="resurse">📚 Resurse Educaționale</option>
                                                    <option value="checklist">✅ Checklist-uri</option>
                                                    <option value="general">📁 General</option>
                                                </select>
                                                <label for="document-category">
                                                    <i class="fas fa-tags me-2"></i>Categoria
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-floating documents">
                                        <textarea class="form-control" id="document-description" placeholder="Descrierea documentului..." style="height: 100px;"></textarea>
                                        <label for="document-description">
                                            <i class="fas fa-align-left me-2"></i>Descrierea (opțională)
                                        </label>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-floating documents">
                                                <select class="form-select" id="document-type" required>
                                                    <option value="free">💚 Gratuit pentru toți</option>
                                                    <option value="paid">💰 Document cu plată</option>
                                                </select>
                                                <label for="document-type">
                                                    <i class="fas fa-money-bill-wave me-2"></i>Tipul de acces *
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating documents" id="price-container" style="display: none;">
                                                <input type="number" class="form-control" id="document-price" placeholder="Ex: 25" min="1" step="0.01">
                                                <label for="document-price">
                                                    <i class="fas fa-tag me-2"></i>Prețul (RON) *
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="document-featured">
                                        <label class="form-check-label fw-bold" for="document-featured">
                                            ⭐ Marchează ca document recomandat (va apărea evidențiat)
                                        </label>
                                    </div>

                                    <button type="submit" class="btn-save-document">
                                        <i class="fas fa-save me-2"></i>Publică Documentul
                                    </button>
                                </form>
                            </div>
                        </div>

                        <!-- Tab pentru Lista Documentelor -->
                        <div class="tab-pane fade" id="list-documents" role="tabpanel">
                            <div class="p-4">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h5><i class="fas fa-folder-open me-2"></i>Documentele tale</h5>
                                    <button class="btn btn-outline-primary btn-sm" onclick="refreshDocumentsList()">
                                        <i class="fas fa-sync-alt me-1"></i>Reîncarcă
                                    </button>
                                </div>

                                <div id="documents-loading" class="documents-loading" style="display: none;">
                                    <div class="spinner-border text-primary" role="status"></div>
                                    <p class="mt-3 text-muted">Se încarcă documentele...</p>
                                </div>
                                
                                <div id="documents-list"></div>
                                
                                <div id="documents-empty" class="documents-empty" style="display: none;">
                                    <i class="fas fa-folder-open"></i>
                                    <h5 class="text-muted mb-3">Nu există documente încă</h5>
                                    <p class="text-muted">Începe prin a încărca primul document pentru clienții tăi</p>
                                    <button class="btn btn-outline-primary" onclick="document.getElementById(\'upload-tab\').click()">
                                        <i class="fas fa-plus me-2"></i>Încarcă Primul Document
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>';
}

/**
 * Funcție pentru integrare completă
 */
function integrateDocumentsManager() {
    echo renderDocumentsCSS();
    echo renderDocumentsModal();
}

?>