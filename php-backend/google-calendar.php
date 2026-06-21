<?php
// php-backend/google-calendar.php: Add booking to Google Calendar for portalsofsamadhi@gmail.com
// Requires Google API PHP Client and service account credentials

require_once __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['summary']) || !isset($data['start']) || !isset($data['end'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing event details']);
    exit;
}

$client = new Google_Client();
$client->setApplicationName('POS Booking Calendar');
$client->setScopes(Google_Service_Calendar::CALENDAR);
$client->setAuthConfig(__DIR__ . '/service-account.json');
$client->setAccessType('offline');

$service = new Google_Service_Calendar($client);
$calendarId = 'portalsofsamadhi@gmail.com';

$event = new Google_Service_Calendar_Event([
    'summary' => $data['summary'],
    'description' => $data['description'] ?? '',
    'start' => [
        'dateTime' => $data['start'],
        'timeZone' => 'America/Jamaica',
    ],
    'end' => [
        'dateTime' => $data['end'],
        'timeZone' => 'America/Jamaica',
    ],
    'attendees' => $data['attendees'] ?? [],
]);

try {
    $createdEvent = $service->events->insert($calendarId, $event);
    echo json_encode(['success' => true, 'eventId' => $createdEvent->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
