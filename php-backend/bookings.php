
<?php
// php-backend/bookings.php: Handle booking submissions, send confirmation emails, and store bookings
header('Content-Type: application/json');
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - Booking request received\n", FILE_APPEND);

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['bookingData']) || !isset($data['paymentDetails'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing booking or payment details']);
    exit;
}

$bookingData = $data['bookingData'];
$paymentDetails = $data['paymentDetails'];

// Validate payment method is PayPal
if (strtolower($paymentDetails['paymentMethod']) !== 'paypal') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Only PayPal payments are accepted.']);
    exit;
}

// Save booking to bookings.json
$file = __DIR__ . '/../bookings.json';
if (!file_exists($file)) {
    file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
}
$bookings = json_decode(file_get_contents($file), true);
if (!is_array($bookings)) {
    $bookings = [];
}

$newBooking = [
    'id' => uniqid('booking_', true),
    'bookingData' => $bookingData,
    'paymentDetails' => $paymentDetails,
    'createdAt' => date('c')
];
$bookings[] = $newBooking;
file_put_contents($file, json_encode($bookings, JSON_PRETTY_PRINT));



// Send confirmation email to user and admin using PHPMailer
$userEmail = $bookingData['email'];
$adminEmail = $_ENV['TEAM_EMAIL'] ?? 'portalsofsamadhi@gmail.com';
$subject = 'Booking Confirmation - ' . $bookingData['serviceName'];
$message = "<h2>Thank you for your booking!</h2>"
    . "<p>Your appointment for <b>{$bookingData['serviceName']}</b> with <b>{$bookingData['practitionerName']}</b> is confirmed.</p>"
    . "<p><b>Date:</b> {$bookingData['date']}<br>"
    . "<b>Time:</b> {$bookingData['time']}<br>"
    . "<b>Duration:</b> {$bookingData['serviceDuration']}<br>"
    . "<b>Amount:</b> $ {$paymentDetails['amount']}<br>"
    . "<b>Payment Method:</b> {$paymentDetails['paymentMethod']}<br>"
    . "<b>Transaction ID:</b> {$paymentDetails['transactionId']}</p>"
    . (isset($bookingData['notes']) && $bookingData['notes'] ? "<p><b>Notes:</b> {$bookingData['notes']}</p>" : '')
    . "<p>We look forward to seeing you!<br>Portals of Samadhi Team</p>";
$adminMsg = "<h2>New Booking Received</h2>"
    . "<p><b>Service:</b> {$bookingData['serviceName']}<br>"
    . "<b>Practitioner:</b> {$bookingData['practitionerName']}<br>"
    . "<b>Date:</b> {$bookingData['date']}<br>"
    . "<b>Time:</b> {$bookingData['time']}<br>"
    . "<b>Client:</b> {$bookingData['name']} ({$bookingData['email']})<br>"
    . "<b>Phone:</b> {$bookingData['phone']}<br>"
    . (isset($bookingData['notes']) && $bookingData['notes'] ? "<b>Notes:</b> {$bookingData['notes']}<br>" : '')
    . "<b>Amount:</b> $ {$paymentDetails['amount']}<br>"
    . "<b>Transaction ID:</b> {$paymentDetails['transactionId']}<br>"
    . "<b>Payment Method:</b> {$paymentDetails['paymentMethod']}</p>";

function send_mail($to, $subject, $body, $isHtml = true) {
    $mail = new PHPMailer(true);
    try {
        file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - Attempting to send email to: $to\n", FILE_APPEND);
        
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'] ?? 'portalsofsamadhi@gmail.com';
    $mail->Password = $_ENV['SMTP_PASS'] ?? 'REDACTED_SMTP_PASS';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
        $mail->setFrom($_ENV['SMTP_USER'] ?? 'portalsofsamadhi@gmail.com', 'Portals of Samadhi');
        $mail->addAddress($to);
        $mail->isHTML($isHtml);
        $mail->Subject = $subject;
        $mail->Body = $body;
        
        // Enable SMTP debugging
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = function($str, $level) {
            file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - SMTP: $str\n", FILE_APPEND);
        };
        
        $result = $mail->send();
        file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - Email sent successfully to: $to\n", FILE_APPEND);
        return true;
    } catch (Exception $e) {
        $error = 'Mail error: ' . $mail->ErrorInfo . ' | Exception: ' . $e->getMessage();
        file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - $error\n", FILE_APPEND);
        error_log($error);
        return false;
    }
}

$emailResult1 = send_mail($userEmail, $subject, $message, true);
$emailResult2 = send_mail($adminEmail, 'New Booking Received', $adminMsg, true);

file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - User email result: " . ($emailResult1 ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);
file_put_contents(__DIR__ . '/booking_log.txt', date('Y-m-d H:i:s') . " - Admin email result: " . ($emailResult2 ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

// Add event to Google Calendar (fallback: send calendar invitation email)
$startDateTime = date('c', strtotime($bookingData['date'] . ' ' . $bookingData['time']));
$endDateTime = date('c', strtotime($bookingData['date'] . ' ' . $bookingData['time'] . ' + 1 hour')); // Default 1 hour
$eventTitle = $bookingData['serviceName'] . ' with ' . $bookingData['practitionerName'];
$eventDescription = 'Client: ' . $bookingData['name'] . ' (' . $bookingData['email'] . ')' . ($bookingData['notes'] ? "\nNotes: " . $bookingData['notes'] : '');

// Try Google Calendar API if available
if (file_exists(__DIR__ . '/vendor/autoload.php') && file_exists(__DIR__ . '/service-account.json')) {
    $eventData = [
        'summary' => $eventTitle,
        'description' => $eventDescription,
        'start' => $startDateTime,
        'end' => $endDateTime,
        'attendees' => [ [ 'email' => $userEmail ] ]
    ];
    // Call Google Calendar API
    $ch = curl_init('http://localhost/php-backend/google-calendar.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($eventData));
    $calendarResponse = curl_exec($ch);
    curl_close($ch);
} else {
    // Fallback: Send calendar invitation email with ICS attachment
    $icsContent = "BEGIN:VCALENDAR\r\n";
    $icsContent .= "VERSION:2.0\r\n";
    $icsContent .= "PRODID:-//Portals of Samadhi//Booking System//EN\r\n";
    $icsContent .= "BEGIN:VEVENT\r\n";
    $icsContent .= "UID:" . uniqid() . "@portalsofsamadhi.com\r\n";
    $icsContent .= "DTSTAMP:" . gmdate('Ymd\THis\Z') . "\r\n";
    $icsContent .= "DTSTART:" . gmdate('Ymd\THis\Z', strtotime($startDateTime)) . "\r\n";
    $icsContent .= "DTEND:" . gmdate('Ymd\THis\Z', strtotime($endDateTime)) . "\r\n";
    $icsContent .= "SUMMARY:" . $eventTitle . "\r\n";
    $icsContent .= "DESCRIPTION:" . str_replace(["\r\n", "\n", "\r"], "\\n", $eventDescription) . "\r\n";
    $icsContent .= "ORGANIZER:MAILTO:portalsofsamadhi@gmail.com\r\n";
    $icsContent .= "ATTENDEE:MAILTO:" . $userEmail . "\r\n";
    $icsContent .= "STATUS:CONFIRMED\r\n";
    $icsContent .= "END:VEVENT\r\n";
    $icsContent .= "END:VCALENDAR\r\n";
    
    // Send calendar invitation to admin
    $boundary = md5(time());
    $calendarHeaders = "MIME-Version: 1.0\r\n";
    $calendarHeaders .= "From: Portals of Samadhi <no-reply@portalsofsamadhi.com>\r\n";
    $calendarHeaders .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    
    $calendarBody = "--$boundary\r\n";
    $calendarBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    $calendarBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $calendarBody .= "<h3>New Booking Calendar Event</h3><p>Please add this appointment to your calendar.</p>\r\n";
    $calendarBody .= "--$boundary\r\n";
    $calendarBody .= "Content-Type: text/calendar; charset=UTF-8; method=REQUEST\r\n";
    $calendarBody .= "Content-Disposition: attachment; filename=\"booking.ics\"\r\n";
    $calendarBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $calendarBody .= $icsContent . "\r\n";
    $calendarBody .= "--$boundary--\r\n";
    
    @mail('portalsofsamadhi@gmail.com', 'Calendar: ' . $eventTitle, $calendarBody, $calendarHeaders);
}

echo json_encode(['success' => true, 'message' => 'Booking saved and emails sent.']);
exit;
