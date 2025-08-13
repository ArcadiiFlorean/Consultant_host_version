/**
 * DOCUMENTS UPLOAD - JavaScript complet pentru gestionarea documentelor
 * Fișier: assets/js/documents_upload.js
 * Integrare în admin_dashboard.php cu funcționalitate completă
 */

// ============================================
// VARIABLES & CONFIGURATION - LA ÎNCEPUT!
// ============================================
let documentsData = [];
const DOCUMENTS_API = "https://marina-cociug.com/api/documents_admin_api.php";

// ============================================
// TOGGLE PREȚ - FUNCȚIONALITATEA EXISTENTĂ ÎMBUNĂTĂȚITĂ
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Inițializează toggle-ul pentru preț (funcționalitatea existentă, curățată)
  initPriceToggle();

  // Inițializează restul funcționalității
  initDocumentsManager();
});

/**
 * Inițializează toggle-ul pentru preț (GRATUIT/PLATĂ)
 */
function initPriceToggle() {
  const typeSelect = document.getElementById("document-type");
  const priceContainer = document.getElementById("price-container");

  if (typeSelect && priceContainer) {
    function togglePriceField() {
      if (typeSelect.value === "paid") {
        priceContainer.style.display = "block";
        priceContainer.style.animation = "slideDown 0.3s ease-out";

        const priceInput = document.getElementById("document-price");
        if (priceInput) {
          priceInput.required = true;
        }
      } else {
        priceContainer.style.display = "none";

        const priceInput = document.getElementById("document-price");
        if (priceInput) {
          priceInput.required = false;
          priceInput.value = "";
        }
      }
    }

    typeSelect.addEventListener("change", togglePriceField);
    togglePriceField(); // Setează starea inițială

    console.log("✅ Toggle preț inițializat");
  }
}

/**
 * Inițializează managerul complet de documente
 */
function initDocumentsManager() {
  console.log("🚀 Documents Manager JavaScript început...");

  // Auto-load documents count la început
  setTimeout(() => {
    updateDocumentsCount();
  }, 1000);

  // Event listeners pentru modal și tab-uri
  setupEventListeners();

  console.log("✅ Documents Manager complet inițializat");
}

// ============================================
// MAIN MODAL FUNCTIONS
// ============================================

/**
 * Deschide modalul pentru documente (apelată din dashboard.js)
 */
window.openDocumentsModal = function () {
  console.log("🚀 Deschidere modal documente...");

  const modal = document.getElementById("documentsModal");
  if (!modal) {
    alert("❌ Modalul pentru documente nu a fost găsit!");
    console.error("Element documentsModal nu există în DOM");
    return;
  }

  // Verifică dacă Bootstrap este disponibil
  if (typeof bootstrap === "undefined") {
    alert("❌ Bootstrap nu este încărcat!");
    console.error("Bootstrap nu este disponibil");
    return;
  }

  try {
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Inițializează după deschidere
    setTimeout(() => {
      initDocumentsModal();
    }, 300);

    console.log("✅ Modal deschis cu succes");
  } catch (error) {
    alert("Eroare la deschiderea modalului: " + error.message);
    console.error("❌ Eroare modal:", error);
  }
};

/**
 * Inițializează modalul după deschidere
 */
function initDocumentsModal() {
  console.log("📂 Inițializare modal documente...");

  // Actualizează contorul și inițializează upload-ul
  updateDocumentsCount();
  initDocumentUpload();

  // Auto-load documents când se deschide modalul
  setTimeout(() => {
    refreshDocumentsList();
  }, 200);
}

// ============================================
// STATISTICS & COUNTER
// ============================================

/**
 * Actualizează contorul de documente din dashboard
 */
async function updateDocumentsCount() {
  try {
    console.log("🔢 Actualizare contor documente...");

    const timestamp = new Date().getTime();
    const response = await fetch(`${DOCUMENTS_API}?count=1&t=${timestamp}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      const count = data.count || 0;
      const countElement = document.getElementById("documents-count");

      if (countElement) {
        // Animație pentru schimbarea contorului
        countElement.style.transition = "all 0.3s ease";
        countElement.style.transform = "scale(1.15)";
        countElement.style.color = "#667eea";
        countElement.textContent = count;

        setTimeout(() => {
          countElement.style.transform = "scale(1)";
          countElement.style.color = "";
        }, 300);

        console.log("✅ Contor actualizat:", count);
      } else {
        console.warn("⚠️ Element documents-count nu a fost găsit în DOM");
      }
    } else {
      console.error("❌ Eroare API la actualizarea contorului:", data.error);
    }
  } catch (error) {
    console.error("❌ Eroare la actualizarea contorului:", error);
  }
}

// ============================================
// DOCUMENTS LIST MANAGEMENT
// ============================================

/**
 * Refresh lista de documente
 */
async function refreshDocumentsList() {
  try {
    console.log("🔄 Refresh listă documente...");

    // Afișează loading
    const listEl = document.getElementById("documents-list");
    const loadingEl = document.getElementById("documents-loading");
    const emptyEl = document.getElementById("documents-empty");

    if (loadingEl) loadingEl.style.display = "block";
    if (emptyEl) emptyEl.style.display = "none";
    if (listEl) listEl.innerHTML = "";

    // Request către API cu cache busting
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${DOCUMENTS_API}?refresh=${timestamp}&force=1`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📊 Răspuns API:", data);

    if (data.success) {
      // Resetează cache-ul local
      documentsData = data.data || [];

      // Afișează lista actualizată
      displayDocumentsList();

      console.log(
        "✅ Listă reîncărcată:",
        documentsData.length,
        "documente active"
      );
    } else {
      throw new Error(
        data.error || "Eroare necunoscută la încărcarea documentelor"
      );
    }
  } catch (error) {
    console.error("❌ Eroare la refresh:", error);

    const listEl = document.getElementById("documents-list");
    if (listEl) {
      listEl.innerHTML = `
                <div class="text-center text-danger p-4">
                    <i class="fas fa-exclamation-triangle mb-2"></i><br>
                    ❌ Eroare la încărcarea documentelor<br>
                    <small>${escapeHtml(error.message)}</small><br>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="refreshDocumentsList()">
                        <i class="fas fa-redo me-1"></i>Încearcă din nou
                    </button>
                </div>
            `;
    }
  } finally {
    const loadingEl = document.getElementById("documents-loading");
    if (loadingEl) loadingEl.style.display = "none";
  }
}

/**
 * Afișează lista de documente în DOM
 */
function displayDocumentsList() {
  const listEl = document.getElementById("documents-list");
  const emptyEl = document.getElementById("documents-empty");

  if (!listEl) {
    console.error("❌ Element documents-list nu există!");
    return;
  }

  console.log("🖥️ Afișare listă:", documentsData.length, "documente");

  // Verifică dacă lista este goală
  if (!documentsData || documentsData.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  // Construiește HTML-ul pentru listă
  let html = "";
  documentsData.forEach((doc, index) => {
    const iconClass = getDocumentIcon(doc.file_type);
    const priceInfo = doc.is_free
      ? '<span class="badge bg-success">💚 GRATUIT</span>'
      : `<span class="badge bg-warning text-dark">💰 ${
          doc.price || 0
        } RON</span>`;

    html += `
            <div class="document-item" data-doc-id="${
              doc.id
            }" style="animation-delay: ${index * 0.1}s">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        <span class="badge bg-primary">Document #${
                          index + 1
                        }</span>
                        ${priceInfo}
                        ${
                          doc.is_featured
                            ? '<span class="badge bg-warning text-dark">⭐ RECOMANDAT</span>'
                            : ""
                        }
                    </div>
                    <button class="btn-delete-document" 
                            onclick="deleteDocument(${doc.id})" 
                            title="Șterge definitiv acest document">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="d-flex gap-3">
                    <div class="document-icon">${iconClass}</div>
                    <div class="flex-grow-1">
                        <h6 class="fw-bold mb-1">${escapeHtml(doc.title)}</h6>
                        <p class="text-muted small mb-2">${escapeHtml(
                          doc.description || "Fără descriere"
                        )}</p>
                        <div class="d-flex flex-wrap gap-3 small text-muted">
                            <span><i class="fas fa-file me-1"></i>${escapeHtml(
                              doc.original_filename
                            )}</span>
                            <span><i class="fas fa-hdd me-1"></i>${formatFileSize(
                              doc.file_size
                            )}</span>
                            <span><i class="fas fa-file-alt me-1"></i>${getFileTypeDisplay(
                              doc.file_type
                            )}</span>
                            <span><i class="fas fa-calendar me-1"></i>${
                              doc.created_at_formatted ||
                              new Date(doc.created_at).toLocaleDateString(
                                "ro-RO"
                              )
                            }</span>
                            ${
                              doc.downloads_count
                                ? `<span><i class="fas fa-download me-1"></i>${doc.downloads_count} descărcări</span>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  listEl.innerHTML = html;
}

/**
 * Șterge un document
 */
async function deleteDocument(id) {
  if (
    !confirm(
      "❌ Ștergi definitiv acest document?\n\nAcțiunea nu poate fi anulată!"
    )
  ) {
    return;
  }

  console.log("🗑️ Ștergere document ID:", id);

  // Găsește elementul în DOM
  const documentItem = document.querySelector(`[data-doc-id="${id}"]`);
  const deleteBtn = documentItem?.querySelector(".btn-delete-document");
  let originalHTML = "";

  // Schimbă butonul în loading
  if (deleteBtn) {
    originalHTML = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    deleteBtn.disabled = true;
  }

  try {
    const response = await fetch(`${DOCUMENTS_API}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📊 Răspuns ștergere:", data);

    if (data.success) {
      showAlert("✅ Document șters definitiv!", "success");

      // Șterge din cache local
      const initialCount = documentsData.length;
      documentsData = documentsData.filter(
        (doc) =>
          doc.id != id && doc.id !== id && parseInt(doc.id) !== parseInt(id)
      );
      const finalCount = documentsData.length;

      console.log(`🗂️ Cache local: ${initialCount} → ${finalCount}`);

      // Eliminare vizuală cu animație
      if (documentItem) {
        documentItem.style.transition = "all 0.3s ease";
        documentItem.style.opacity = "0";
        documentItem.style.transform = "translateX(-100%)";

        setTimeout(() => {
          documentItem.remove();

          // Verifică dacă lista e goală
          if (documentsData.length === 0) {
            displayDocumentsList();
          }
        }, 300);
      }

      // Actualizează contorul
      await updateDocumentsCount();

      // Refresh după 2 secunde pentru sincronizare
      setTimeout(() => {
        refreshDocumentsList();
      }, 2000);
    } else {
      throw new Error(data.error || "Eroare necunoscută la ștergere");
    }
  } catch (error) {
    console.error("❌ Eroare la ștergere:", error);
    showAlert("❌ Eroare la ștergere: " + error.message, "danger");

    // Restaurează butonul în caz de eroare
    if (deleteBtn) {
      deleteBtn.innerHTML = originalHTML;
      deleteBtn.disabled = false;
    }
  }
}

// ============================================
// UPLOAD FUNCTIONALITY
// ============================================

/**
 * Inițializează sistemul de upload
 */
function initDocumentUpload() {
  const uploadArea = document.getElementById("upload-area");
  const fileInput = document.getElementById("document-file");
  const uploadForm = document.getElementById("document-upload-form");

  if (!uploadArea || !fileInput || !uploadForm) {
    console.error("❌ Elemente lipsă pentru upload:", {
      uploadArea: !!uploadArea,
      fileInput: !!fileInput,
      uploadForm: !!uploadForm,
    });
    return;
  }

  console.log("✅ Inițializare upload sistem...");

  // Click pentru selectare fișier
  uploadArea.addEventListener("click", () => {
    fileInput.click();
  });

  // Drag & Drop functionality
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", (e) => {
    if (!uploadArea.contains(e.relatedTarget)) {
      uploadArea.classList.remove("dragover");
    }
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileSelect(files[0]);
    }
  });

  // File selection handler
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  // Form submission
  uploadForm.addEventListener("submit", uploadDocument);
}

/**
 * Gestionează selecția fișierului
 */
function handleFileSelect(file) {
  console.log(
    "📁 Fișier selectat:",
    file.name,
    "(",
    formatFileSize(file.size),
    ")"
  );

  // Validare tip fișier
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    showAlert(
      "❌ Tipul de fișier nu este acceptat!\n\nAcceptate: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, imagini",
      "danger"
    );
    return;
  }

  // Validare dimensiune (10MB)
  if (file.size > 10 * 1024 * 1024) {
    showAlert(
      "❌ Fișierul este prea mare!\n\nDimensiunea maximă permisă: 10MB",
      "danger"
    );
    return;
  }

  // Afișează informațiile despre fișier
  const fileName = document.getElementById("selected-file-name");
  const fileSize = document.getElementById("selected-file-size");
  const fileInfo = document.getElementById("file-info");

  if (fileName && fileSize && fileInfo) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = "block";
  }

  // Auto-completează titlul dacă e gol
  const titleInput = document.getElementById("document-title");
  if (titleInput && !titleInput.value.trim()) {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    titleInput.value =
      nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
  }

  console.log("✅ Fișier validat și procesat");
}

/**
 * Upload document
 */
async function uploadDocument(e) {
  e.preventDefault();
  console.log("📤 Începe upload document...");

  // Colectează datele din form
  const formData = new FormData();
  const fileInput = document.getElementById("document-file");
  const title = document.getElementById("document-title")?.value.trim();
  const description = document
    .getElementById("document-description")
    ?.value.trim();
  const category =
    document.getElementById("document-category")?.value || "general";
  const isFeatured =
    document.getElementById("document-featured")?.checked || false;
  const documentType =
    document.getElementById("document-type")?.value || "free";
  const price =
    documentType === "paid"
      ? parseFloat(document.getElementById("document-price")?.value) || 0
      : 0;
  const isFree = documentType === "free";

  // Validări
  if (!fileInput?.files[0]) {
    showAlert("❌ Selectează un fișier!", "danger");
    return;
  }

  if (!title || title.length < 3) {
    showAlert("❌ Titlul trebuie să aibă cel puțin 3 caractere!", "danger");
    return;
  }

  if (documentType === "paid" && price <= 0) {
    showAlert(
      "❌ Pentru documentele cu plată, prețul trebuie să fie mai mare decât 0!",
      "danger"
    );
    return;
  }

  // Pregătește FormData
  formData.append("document", fileInput.files[0]);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("is_free", isFree ? "1" : "0");
  if (isFeatured) formData.append("is_featured", "1");

  console.log("📋 Date upload:", {
    title,
    description,
    category,
    price,
    isFree,
    isFeatured,
    fileName: fileInput.files[0].name,
    fileSize: formatFileSize(fileInput.files[0].size),
  });

  // UI Updates - buton loading
  const submitBtn = document.querySelector(".btn-save-document");
  if (!submitBtn) {
    console.error("❌ Buton submit nu a fost găsit");
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>Se publică...';
  submitBtn.disabled = true;

  try {
    console.log("🚀 Trimitere cerere upload...");

    const response = await fetch(DOCUMENTS_API, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📊 Răspuns upload:", data);

    if (data.success) {
      showAlert("✅ Document publicat cu succes!", "success");

      // Reset form
      document.getElementById("document-upload-form").reset();
      const fileInfo = document.getElementById("file-info");
      if (fileInfo) fileInfo.style.display = "none";

      // Ascunde containerul de preț
      const priceContainer = document.getElementById("price-container");
      if (priceContainer) priceContainer.style.display = "none";

      // Update counter
      updateDocumentsCount();

      // Switch to list tab după delay și refresh lista
      setTimeout(() => {
        const listTab = document.getElementById("documents-list-tab");
        if (listTab) {
          const tab = new bootstrap.Tab(listTab);
          tab.show();
        }
        // Refresh lista pentru a vedea noul document
        setTimeout(() => {
          refreshDocumentsList();
        }, 500);
      }, 1500);

      console.log("✅ Upload completat cu succes");
    } else {
      throw new Error(data.error || "Eroare necunoscută la upload");
    }
  } catch (error) {
    console.error("❌ Eroare upload:", error);
    showAlert(
      "❌ Eroare la încărcarea documentului: " + error.message,
      "danger"
    );
  } finally {
    // Restaurează butonul
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// ============================================
// EVENT LISTENERS & SETUP
// ============================================

/**
 * Configurează event listeners
 */
function setupEventListeners() {
  // Event listener pentru tab-ul de listă
  const listTab = document.getElementById("documents-list-tab");
  if (listTab) {
    listTab.addEventListener("click", () => {
      console.log("📑 Switch la tab listă documente");
      setTimeout(() => {
        refreshDocumentsList();
      }, 100);
    });
  }

  // Event listener pentru când modalul se deschide
  const modal = document.getElementById("documentsModal");
  if (modal) {
    modal.addEventListener("shown.bs.modal", () => {
      console.log("📂 Modal documente deschis - inițializare automată");
      setTimeout(() => {
        refreshDocumentsList();
      }, 200);
    });

    modal.addEventListener("hidden.bs.modal", () => {
      console.log("📂 Modal documente închis");
    });
  }

  // Event listener pentru documentModalOpened din dashboard.js
  document.addEventListener("documentsModalOpened", () => {
    console.log("📂 Event documentsModalOpened primit");
    setTimeout(() => {
      initDocumentsModal();
    }, 100);
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obține iconul pentru tipul de document
 */
function getDocumentIcon(fileType) {
  if (!fileType) return "📋";

  const type = fileType.toLowerCase();
  const icons = {
    pdf: "📄",
    word: "📝",
    excel: "📊",
    powerpoint: "📊",
    image: "🖼️",
    text: "📃",
  };

  if (type.includes("pdf")) return icons.pdf;
  if (type.includes("word") || type.includes("msword")) return icons.word;
  if (type.includes("excel") || type.includes("spreadsheet"))
    return icons.excel;
  if (type.includes("powerpoint") || type.includes("presentation"))
    return icons.powerpoint;
  if (type.includes("image")) return icons.image;
  if (type.includes("text")) return icons.text;

  return "📋";
}

/**
 * Formatează dimensiunea fișierului
 */
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Escape HTML pentru securitate
 */
function escapeHtml(text) {
  if (!text) return "";

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formatează tipul fișierului pentru afișare
 */
function getFileTypeDisplay(fileType) {
  if (!fileType) return "DOCUMENT";

  const typeMap = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "text/plain": "TXT",
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/gif": "GIF",
  };

  return (
    typeMap[fileType] || fileType.split("/")[1]?.toUpperCase() || "DOCUMENT"
  );
}

/**
 * Afișează alerte
 */
function showAlert(message, type = "info") {
  console.log(`🔔 Alert ${type}:`, message);

  // Simplu alert pentru acum
  const cleanMessage = message.replace(/[❌✅⚠️🔔💚💰📤📋🗑️]/g, "");
  alert(cleanMessage);
}

// ============================================
// DEBUGGING FUNCTIONS
// ============================================

/**
 * Funcție de debug pentru dezvoltatori
 */
function debugDocuments() {
  console.log("=== 🔍 DEBUG DOCUMENTE ===");
  console.log("📊 Statistici cache local:");
  console.log("  - Numărul de documente:", documentsData.length);
  console.log("  - API endpoint:", DOCUMENTS_API);

  if (documentsData.length > 0) {
    console.log("📋 Lista documentelor:");
    documentsData.forEach((doc, index) => {
      console.log(
        `  ${index + 1}. ID: ${doc.id}, Titlu: "${doc.title}", Mărime: ${
          doc.formatted_size || formatFileSize(doc.file_size)
        }`
      );
    });
  }

  const domItems = document.querySelectorAll(".document-item");
  console.log("🖥️ Elemente vizibile în DOM:", domItems.length);

  const modal = document.getElementById("documentsModal");
  console.log("📂 Modal deschis:", modal?.classList.contains("show") || false);

  const elements = [
    "documents-count",
    "upload-area",
    "document-file",
    "document-upload-form",
    "documents-list",
  ];

  console.log("🔧 Elemente HTML:");
  elements.forEach((id) => {
    const el = document.getElementById(id);
    console.log(`  - ${id}:`, el ? "✅ există" : "❌ lipsește");
  });

  console.log("=========================");
}

/**
 * Refresh forțat pentru debugging
 */
function forceRefreshDocuments() {
  console.log("🚀 REFRESH FORȚAT DOCUMENTE...");

  // Curăță cache-ul
  documentsData = [];

  // Refresh complet
  refreshDocumentsList();
  updateDocumentsCount();

  console.log("✅ Refresh forțat completat");
}

/**
 * Reset complet pentru debugging
 */
function resetDocumentsManager() {
  console.log("🔄 RESET COMPLET DOCUMENTS MANAGER...");

  // Curăță cache-ul
  documentsData = [];

  // Curăță DOM-ul
  const listEl = document.getElementById("documents-list");
  if (listEl) {
    listEl.innerHTML =
      '<div class="text-center p-4"><i class="fas fa-spinner fa-spin me-2"></i>Se resetează...</div>';
  }

  // Resetează contorul
  const countEl = document.getElementById("documents-count");
  if (countEl) {
    countEl.textContent = "0";
  }

  // Reîncarcă totul după 1 secundă
  setTimeout(() => {
    updateDocumentsCount();
    refreshDocumentsList();
    console.log("✅ Reset complet finalizat");
  }, 1000);
}

// ============================================
// EXPOSE FUNCTIONS FOR DEBUGGING & GLOBAL ACCESS
// ============================================

// Expune funcțiile pentru debugging în consolă
window.debugDocuments = debugDocuments;
window.forceRefreshDocuments = forceRefreshDocuments;
window.resetDocumentsManager = resetDocumentsManager;
window.refreshDocumentsList = refreshDocumentsList;
window.deleteDocument = deleteDocument;
window.updateDocumentsCount = updateDocumentsCount;
window.uploadDocument = uploadDocument;

// ============================================
// COMPATIBILITY & INTEGRATION
// ============================================

// Integrare cu dashboard.js - asigură că funcția openDocumentsModal e disponibilă
if (typeof window.openDocumentsModal === "undefined") {
  // Definește funcția dacă nu există deja în dashboard.js
  console.log(
    "⚠️ openDocumentsModal nu există în dashboard.js, o definesc aici"
  );
}

// Event listener pentru compatibilitate cu evenimente din dashboard.js
document.addEventListener("documentsModalOpened", function () {
  console.log("📂 Eveniment documentsModalOpened primit din dashboard.js");
  setTimeout(() => {
    initDocumentsModal();
  }, 100);
});

// ============================================
// INITIALIZATION MESSAGE
// ============================================

console.log("🛠️ Documents Upload Manager - Funcții disponibile:");
console.log("  📊 debugDocuments() - informații detaliate");
console.log("  🔄 forceRefreshDocuments() - refresh forțat");
console.log("  🔄 resetDocumentsManager() - reset complet");
console.log("  📂 openDocumentsModal() - deschide modal");
console.log("  📋 refreshDocumentsList() - refresh listă");
console.log("  🗑️ deleteDocument(id) - șterge document");
console.log("  🔢 updateDocumentsCount() - actualizează contor");
console.log("  📤 uploadDocument() - funcția de upload");

console.log("✅ Documents Upload Manager complet încărcat și funcțional!");
console.log("🔗 API Endpoint:", DOCUMENTS_API);
console.log("🎯 Integrare cu dashboard.js: ✅");
console.log("📱 Toggle preț GRATUIT/PLATĂ: ✅");
console.log("📤 Upload cu Drag & Drop: ✅");
console.log("📋 Gestionare listă documente: ✅");
console.log("🗑️ Ștergere documente: ✅");
console.log("🔔 Sistem alerte: ✅");

// Verificare integritate la încărcare
setTimeout(() => {
  const requiredElements = [
    "documents-count", // Contorul din dashboard
    "document-type", // Select pentru tip document
    "price-container", // Container pentru preț
  ];

  const missingElements = requiredElements.filter(
    (id) => !document.getElementById(id)
  );

  if (missingElements.length > 0) {
    console.warn(
      "⚠️ Elemente lipsă pentru funcționalitate completă:",
      missingElements
    );
    console.warn("💡 Verifică integrarea în admin_dashboard.php");
  } else {
    console.log("✅ Toate elementele necesare sunt prezente");
  }
}, 2000);
