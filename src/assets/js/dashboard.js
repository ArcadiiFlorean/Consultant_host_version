// src/assets/js/dashboard.js - Logica principală pentru dashboard

document.addEventListener("DOMContentLoaded", function() {
    initDashboard();
});

function initDashboard() {
    setupCardAnimations();
    setupStatsAnimations();
    console.log("🎉 Dashboard inițializat cu succes!");
    
    // Afișează un mesaj de bun venit
    setTimeout(() => {
        if (typeof showAlert === "function") {
            showAlert("🌸 Hello dragostea mea  ", "success");
        }
    }, 1000);
}

function setupCardAnimations() {
    const cards = document.querySelectorAll(".dashboard-card");
    
    cards.forEach((card, index) => {
        // Animații hover
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-10px) scale(1.02) rotateZ(1deg)";
            this.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        });
        
        card.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0) scale(1) rotateZ(0deg)";
        });
        
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Efecte de click pentru cardurile cu buton
        if (card.tagName === "BUTTON") {
            card.addEventListener("click", function() {
                this.style.transform = "scale(0.95)";
                setTimeout(() => {
                    this.style.transform = "";
                }, 150);
            });
        }
    });
}

function setupStatsAnimations() {
    // Floating animation pentru statistici
    setInterval(() => {
        const stats = document.querySelectorAll(".stat-item h3");
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = "scale(1.05)";
                stat.style.color = getRandomAccentColor();
                setTimeout(() => {
                    stat.style.transform = "scale(1)";
                    stat.style.color = "";
                }, 200);
            }, index * 100);
        });
    }, 15000); // La fiecare 15 secunde
}

function getRandomAccentColor() {
    const colors = ["#fd79a8", "#a8e6cf", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Funcții pentru modal-uri
window.openTestimonialsModal = function() {
    const modal = new bootstrap.Modal(document.getElementById("testimonialsModal"));
    modal.show();
    
    // Trigger eveniment pentru încărcarea datelor
    const event = new CustomEvent("testimonialsModalOpened");
    document.dispatchEvent(event);
    
    console.log("📝 Modal testimonials deschis");
};

window.openDocumentsModal = function() {
    const modal = new bootstrap.Modal(document.getElementById("documentsModal"));
    modal.show();
    
    // Trigger eveniment pentru încărcarea datelor
    const event = new CustomEvent("documentsModalOpened");
    document.dispatchEvent(event);
    
    console.log("📁 Modal documente deschis");
};

// Gestionează erorile globale
window.addEventListener("error", function(e) {
    console.error("Eroare JavaScript:", e.error);
    
    if (typeof showAlert === "function") {
        showAlert("⚠️ A apărut o eroare neașteptată. Încearcă să reîmprospătezi pagina.", "warning");
    }
});

// Gestionează erorile de rețea
window.addEventListener("unhandledrejection", function(e) {
    console.error("Eroare Promise:", e.reason);
    
    if (e.reason && e.reason.message && e.reason.message.includes("fetch")) {
        if (typeof showAlert === "function") {
            showAlert("🌐 Problemă de conectivitate. Verifică conexiunea la internet.", "warning");
        }
    }
});

console.log("✅ dashboard.js încărcat cu succes!");