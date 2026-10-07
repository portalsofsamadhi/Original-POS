<?php
// update-profile.php: Update or create a user profile in subscribers.json
header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['success' => false, 'error' => 'Method not allowed']);
	exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['email'])) {
	http_response_code(400);
	echo json_encode(['success' => false, 'error' => 'Email is required']);
	exit;
}

$email = strtolower(trim($input['email']));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	http_response_code(400);
	echo json_encode(['success' => false, 'error' => 'Invalid email address']);
	exit;
}

$profileFields = [
	'email', 'name', 'phone', 'location', 'birthday', 'bio'
];
$profile = [];
foreach ($profileFields as $field) {
	if (isset($input[$field])) {
		$profile[$field] = $input[$field];
	}
}

$file = __DIR__ . '/../subscribers.json';
if (!file_exists($file)) {
	file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
}
$subscribers = json_decode(file_get_contents($file), true);
if (!is_array($subscribers)) {
	$subscribers = [];
}

$found = false;
foreach ($subscribers as &$subscriber) {
	if (isset($subscriber['email']) && strtolower($subscriber['email']) === $email) {
		// Update existing subscriber
		foreach ($profile as $k => $v) {
			$subscriber[$k] = $v;
		}
		$found = true;
		break;
	}
}
unset($subscriber);

if (!$found) {
	$profile['subscribedAt'] = date('c');
	$subscribers[] = $profile;
}

file_put_contents($file, json_encode($subscribers, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'Profile updated', 'profile' => $profile]);
exit;
