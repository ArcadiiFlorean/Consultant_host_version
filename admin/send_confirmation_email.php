<?php
// admin/send_confirmation_email.php

require_once 'db.php';
require_once '../vendor/autoload.php'; // Pentru PHPMailer (dacă folosești Composer)

// Sau include PHPMailer manual:
// require_once 'phpmailer/src/PHPMailer.php';
// require_once 'phpmailer/src/SMTP.php';
// require_once 'phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;
    
    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->configureSMTP();
    }
    
    private function configureSMTP() {
        try {
            // Configurare SMTP (exemplu cu Gmail)
            $this->mailer->isSMTP();
            $this->mailer->Host       = 'smtp.gmail.com';
            $this->mailer->SMTPAuth   = true;
            $this->mailer->Username   = 'your-email@gmail.com'; // Schimbă cu email-ul tău
            $this->mailer->Password   = 'your-app-password';     // App password din Gmail
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port       = 587;
            
            // Setări generale
            $this->mailer->setFrom('your-email@gmail.com', 'Consultant Alăptare');
            $this->mailer->isHTML(true);
            $this->mailer->CharSet = 'UTF-8';
            
        } catch (Exception $e) {
            error_log("SMTP Configuration Error: " . $e->getMessage());
        }
    }
    
    public function sendBookingConfirmation($bookingData) {
        try {
            // Setează emailul destinatar
            $this->mailer->addAddress($bookingData['email'], $bookingData['firstName'] . ' ' . $bookingData['lastName']);
            
            // Subject
            $this->mailer->Subject = '✅ Confirmare Rezervare - Consultație Alăptare';
            
            // Generează template-ul HTML
            $htmlBody = $this->generateConfirmationTemplate($bookingData);
            $this->mailer->Body = $htmlBody;
            
            // Versiune text pentru clienții care nu suportă HTML
            $this->mailer->AltBody = $this->generatePlainTextConfirmation($bookingData);
            
            // Trimite emailul
            $result = $this->mailer->send();
            
            // Log success
            error_log("Confirmation email sent successfully to: " . $bookingData['email']);
            
            return [
                'success' => true,
                'message' => 'Email de confirmare trimis cu succes!'
            ];
            
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Eroare la trimiterea emailului: ' . $e->getMessage()
            ];
        } finally {
            // Curăță destinatarii pentru următorul email
            $this->mailer->clearAddresses();
        }
    }
    
    private function generateConfirmationTemplate($data) {
        $bookingDate = new DateTime($data['date']);
        $formattedDate = $bookingDate->format('l, d F Y'); // Miercuri, 15 ianuarie 2025
        $formattedTime = $data['hour'];
        
        return '
        <!DOCTYPE html>
        <html lang="ro">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmare Rezervare</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f8f9fa;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 28px;
                    margin-bottom: 10px;
                    font-weight: 700;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 18px;
                    margin-bottom: 25px;
                    color: #2c3e50;
                }
                
                .booking-details {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    border-left: 5px solid #667eea;
                }
                
                .booking-details h3 {
                    color: #667eea;
                    font-size: 20px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                    font-weight: bold;
                    background: linear-gradient(135deg, #e8f5e8, #d4edda);
                    margin: 15px -15px -15px -15px;
                    padding: 15px;
                    border-radius: 8px;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #495057;
                }
                
                .detail-value {
                    font-weight: 500;
                    color: #2c3e50;
                }
                
                .price {
                    font-size: 24px;
                    color: #28a745;
                    font-weight: bold;
                }
                
                .important-info {
                    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                    border: 1px solid #ffd93d;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                }
                
                .important-info h4 {
                    color: #856404;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                }
                
                .important-info ul {
                    margin-left: 20px;
                    color: #856404;
                }
                
                .important-info li {
                    margin-bottom: 8px;
                }
                
                .contact-info {
                    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                    text-align: center;
                }
                
                .contact-info h4 {
                    color: #1565c0;
                    margin-bottom: 15px;
                }
                
                .contact-detail {
                    margin: 8px 0;
                    color: #1976d2;
                }
                
                .footer {
                    background: #f8f9fa;
                    padding: 25px 30px;
                    text-align: center;
                    color: #6c757d;
                    font-size: 14px;
                }
                
                .footer p {
                    margin-bottom: 10px;
                }
                
                .social-links {
                    margin-top: 15px;
                }
                
                .social-links a {
                    color: #667eea;
                    text-decoration: none;
                    margin: 0 10px;
                    font-weight: 500;
                }
                
                @media (max-width: 600px) {
                    .content {
                        padding: 25px 20px;
                    }
                    
                    .booking-details {
                        padding: 20px;
                    }
                    
                    .detail-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .detail-value {
                        margin-top: 5px;
                        font-weight: 600;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>🎉 Rezervare Confirmată!</h1>
                    <p>Consultația ta a fost programată cu succes</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Dragă <strong>' . htmlspecialchars($data['firstName'] . ' ' . $data['lastName']) . '</strong>,
                    </div>
                    
                    <p>Îți mulțumim pentru încrederea acordată! Rezervarea ta pentru consultația de alăptare a fost confirmată și plata a fost procesată cu succes.</p>
                    
                    <div class="booking-details">
                        <h3>📋 Detaliile Rezervării</h3>
                        
                        <div class="detail-row">
                            <span class="detail-label">🏥 Serviciu:</span>
                            <span class="detail-value">' . htmlspecialchars($data['serviceName']) . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📅 Data:</span>
                            <span class="detail-value">' . $formattedDate . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">🕐 Ora:</span>
                            <span class="detail-value">' . $formattedTime . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">👤 Client:</span>
                            <span class="detail-value">' . htmlspecialchars($data['firstName'] . ' ' . $data['lastName']) . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📧 Email:</span>
                            <span class="detail-value">' . htmlspecialchars($data['email']) . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📱 Telefon:</span>
                            <span class="detail-value">' . htmlspecialchars($data['phone']) . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">💰 Total Plătit:</span>
                            <span class="detail-value price">£' . number_format($data['servicePrice'], 2) . '</span>
                        </div>
                    </div>
                    
                    <div class="important-info">
                        <h4>⚠️ Informații Importante</h4>
                        <ul>
                            <li><strong>Confirmarea este obligatorie:</strong> Te rog să confirmi prezența cu 24h înainte</li>
                            <li><strong>Anulări:</strong> Anulările se pot face cu minim 48h înainte</li>
                            <li><strong>Întârzieri:</strong> Te rugăm să ajungi cu 5-10 minute înainte</li>
                            <li><strong>Întrebări:</strong> Nu ezita să mă contactezi pentru orice nelămurire</li>
                        </ul>
                    </div>
                    
                    <div class="contact-info">
                        <h4>📞 Informații de Contact</h4>
                        <div class="contact-detail"><strong>Telefon:</strong> +40 712 345 678</div>
                        <div class="contact-detail"><strong>Email:</strong> contact@consultant-alaptare.ro</div>
                        <div class="contact-detail"><strong>WhatsApp:</strong> +40 712 345 678</div>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
                        Mă bucur să te pot ajuta în această călătorie frumoasă a alăptării! 
                        Îți voi oferi tot suportul și informațiile necesare pentru o experiență pozitivă.
                    </p>
                    
                    <p style="margin-top: 20px; font-style: italic; color: #666;">
                        Cu drag,<br>
                        <strong>[Numele Tău] - Consultant Alăptare Certificat</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <p>Acest email a fost generat automat. Te rugăm să nu răspunzi direct la acest mesaj.</p>
                    <p><strong>Consultant Alăptare Professional</strong> | Certificat IBCLC</p>
                    
                    <div class="social-links">
                        <a href="#">Facebook</a> |
                        <a href="#">Instagram</a> |
                        <a href="#">Website</a>
                    </div>
                </div>
            </div>
        </body>
        </html>';
    }
    
    private function generatePlainTextConfirmation($data) {
        $bookingDate = new DateTime($data['date']);
        $formattedDate = $bookingDate->format('l, d F Y');
        
        return "
REZERVARE CONFIRMATĂ!

Dragă " . $data['firstName'] . " " . $data['lastName'] . ",

Îți mulțumim pentru încrederea acordată! Rezervarea ta a fost confirmată:

DETALII REZERVARE:
- Serviciu: " . $data['serviceName'] . "
- Data: " . $formattedDate . "
- Ora: " . $data['hour'] . "
- Client: " . $data['firstName'] . " " . $data['lastName'] . "
- Email: " . $data['email'] . "
- Telefon: " . $data['phone'] . "
- Total plătit: £" . number_format($data['servicePrice'], 2) . "

INFORMAȚII IMPORTANTE:
- Confirmă prezența cu 24h înainte
- Anulările se fac cu minim 48h înainte
- Ajunge cu 5-10 minute înainte de program

CONTACT:
Telefon: +40 712 345 678
Email: contact@consultant-alaptare.ro

Cu drag,
[Numele Tău] - Consultant Alăptare Certificat
        ";
    }
    
    // Metodă pentru trimiterea de notificări către admin
    public function sendAdminNotification($bookingData) {
        try {
            $this->mailer->addAddress('admin@consultant-alaptare.ro', 'Admin');
            $this->mailer->Subject = '🔔 Rezervare Nouă - ' . $bookingData['serviceName'];
            
            $htmlBody = $this->generateAdminNotificationTemplate($bookingData);
            $this->mailer->Body = $htmlBody;
            
            $result = $this->mailer->send();
            
            return [
                'success' => true,
                'message' => 'Notificare admin trimisă cu succes!'
            ];
            
        } catch (Exception $e) {
            error_log("Admin notification failed: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Eroare la notificarea admin: ' . $e->getMessage()
            ];
        } finally {
            $this->mailer->clearAddresses();
        }
    }
    
    private function generateAdminNotificationTemplate($data) {
        $bookingDate = new DateTime($data['date']);
        $formattedDate = $bookingDate->format('l, d F Y');
        
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Rezervare Nouă</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f8f9fa; }
                .detail { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #dc3545; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🔔 REZERVARE NOUĂ!</h2>
                </div>
                <div class="content">
                    <h3>Detalii Client:</h3>
                    <div class="detail"><strong>Nume:</strong> ' . htmlspecialchars($data['firstName'] . ' ' . $data['lastName']) . '</div>
                    <div class="detail"><strong>Email:</strong> ' . htmlspecialchars($data['email']) . '</div>
                    <div class="detail"><strong>Telefon:</strong> ' . htmlspecialchars($data['phone']) . '</div>
                    <div class="detail"><strong>Serviciu:</strong> ' . htmlspecialchars($data['serviceName']) . '</div>
                    <div class="detail"><strong>Data:</strong> ' . $formattedDate . '</div>
                    <div class="detail"><strong>Ora:</strong> ' . $data['hour'] . '</div>
                    <div class="detail"><strong>Sumă plătită:</strong> £' . number_format($data['servicePrice'], 2) . '</div>
                </div>
            </div>
        </body>
        </html>';
    }
}

// Funcție pentru a trimite emailul de confirmare
function sendBookingConfirmationEmail($bookingData) {
    $emailService = new EmailService();
    
    // Trimite email de confirmare către client
    $clientResult = $emailService->sendBookingConfirmation($bookingData);
    
    // Trimite notificare către admin
    $adminResult = $emailService->sendAdminNotification($bookingData);
    
    return [
        'client_email' => $clientResult,
        'admin_notification' => $adminResult
    ];
}

// Exemplu de utilizare:
/*
$bookingData = [
    'firstName' => 'Maria',
    'lastName' => 'Popescu',
    'email' => 'maria@example.com',
    'phone' => '+40 712 345 678',
    'serviceName' => 'Consultație la Domiciliu',
    'servicePrice' => 100.00,
    'date' => '2025-02-15',
    'hour' => '10:00'
];

$result = sendBookingConfirmationEmail($bookingData);
print_r($result);
*/
?>