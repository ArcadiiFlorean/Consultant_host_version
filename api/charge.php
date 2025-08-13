<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../vendor/autoload.php';

// Load configuration
$config = require __DIR__ . '/../config.php';

\Stripe\Stripe::setApiKey($config['stripe_secret_key']);

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['amount']) || !isset($input['paymentMethodId'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Lipsesc datele necesare: amount sau paymentMethodId'
    ]);
    exit;
}

try {
    $intent = \Stripe\PaymentIntent::create([
        'amount' => $input['amount'],
        'currency' => 'gbp',
        'payment_method' => $input['paymentMethodId'],
        'confirmation_method' => 'manual',
        'confirm' => true,
        'return_url' => $config['return_url']
    ]);

    echo json_encode([
        'success' => true,
        'status' => $intent->status,
        'payment_intent_id' => $intent->id
    ]);
    
} catch (\Stripe\Exception\ApiErrorException $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>