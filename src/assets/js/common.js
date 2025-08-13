// src/assets/js/common.js - Funcții comune pentru dashboard

function showAlert(message, type = "info") {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            z-index: 9999; 
            min-width: 300px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: slideInRight 0.5s ease-out;
        ">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", alertHtml);
    
    setTimeout(() => {
        const alert = document.querySelector(".alert:last-of-type");
        if (alert) alert.remove();
    }, 5000);
}

function showConfirmDialog(title, message, type = "primary") {
    return new Promise((resolve) => {
        const modalId = "confirmModal_" + Date.now();
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 20px; border: none;">
                        <div class="modal-header bg-${type} text-white" style="border-radius: 20px 20px 0 0;">
                            <h5 class="modal-title">${title}</h5>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="fas fa-exclamation-triangle fa-3x text-${type} mb-3"></i>
                            <p class="mb-0">${message}</p>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-2"></i>Anulează
                            </button>
                            <button type="button" class="btn btn-${type}" id="confirmYes_${modalId}">
                                <i class="fas fa-check me-2"></i>Confirmă
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML("beforeend", modalHtml);
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        document.getElementById(`confirmYes_${modalId}`).onclick = () => {
            resolve(true);
            modal.hide();
        };
        
        document.getElementById(modalId).addEventListener("hidden.bs.modal", () => {
            document.getElementById(modalId).remove();
            resolve(false);
        });
    });
}

function formatFileSize(bytes) {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
    else if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + " MB";
    else if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return bytes + " bytes";
}

function formatRomanianDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "long", 
        day: "numeric"
    });
}

function animateCounter(elementId, finalValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const startTime = Date.now();
    
    function updateCounter() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// CSS pentru animații (se adaugă dinamic)
if (!document.getElementById("commonAnimations")) {
    const style = document.createElement("style");
    style.id = "commonAnimations";
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Exportă funcțiile global
window.showAlert = showAlert;
window.showConfirmDialog = showConfirmDialog;
window.formatFileSize = formatFileSize;
window.formatRomanianDate = formatRomanianDate;
window.animateCounter = animateCounter;

console.log("✅ common.js încărcat cu succes!");