
<?php
header('Content-Type: application/json');

function save_email($email) {
    $file = __DIR__ . '/newsletter-subscribers.json';
    $subscribers = [];
    if (file_exists($file)) {
        $json = file_get_contents($file);
        $subscribers = json_decode($json, true) ?: [];
    }
    if (!in_array($email, $subscribers)) {
        $subscribers[] = $email;
        file_put_contents($file, json_encode($subscribers, JSON_PRETTY_PRINT));
    }
}

function send_welcome_email($to) {
    $subject = "Welcome to Portals of Samadhi Newsletter!";
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: Portals of Samadhi <newsletter@portalsofsamadhi.com>' . "\r\n";
    $message = '<div style="font-family:Segoe UI,Arial,sans-serif;background:#f8fafc;padding:2rem 0;text-align:center;">
        <div style="background:#fff;border-radius:1.2rem;max-width:480px;margin:2rem auto;padding:2.5rem 2rem;box-shadow:0 8px 32px 0 rgba(34,197,94,0.10);">
            <img src="https://portalsofsamadhi.com/poslogo.webp" alt="Portals of Samadhi" style="width:80px;margin-bottom:1.5rem;" />
            <h2 style="color:#17603A;font-size:1.6rem;margin-bottom:1rem;">Thank you for joining our community!</h2>
            <p style="color:#222;font-size:1.08rem;line-height:1.7;margin-bottom:1.5rem;">You are now subscribed to the Portals of Samadhi newsletter.<br>We’ll keep you updated with our latest services, events, and spiritual insights.<br><br><b>Welcome to a new journey of wellness and inspiration!</b></p>
            <div style="margin-top:2rem;font-size:0.98rem;color:#17603A;">With gratitude,<br><b>Portals of Samadhi Team</b></div>
            <div style="margin-top:2.5rem;font-size:0.85rem;color:#888;">If you did not sign up, you can ignore this email.</div>
        </div>
    </div>';
    @mail($to, $subject, $message, $headers);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input['email'])) {
        $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'error' => 'Please enter a valid email address.']);
            exit;
        }
        save_email($email);
        send_welcome_email($email);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for subscribing! Check your inbox for a beautiful welcome message from our team.'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Please enter your email address.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
}
