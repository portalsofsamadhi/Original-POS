<?php
// subscribers.php: Return all subscriber profiles (admin only)
header('Content-Type: application/json');

// Simple bearer token check for admin access
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$adminToken = 'Bearer admin_secret_key_2025';
if ($authHeader !== $adminToken) {
	http_response_code(401);
	echo json_encode(['success' => false, 'error' => 'Unauthorized']);
	exit;
}

$file = __DIR__ . '/../subscribers.json';
if (!file_exists($file)) {
	file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
}
$subscribers = json_decode(file_get_contents($file), true);
if (!is_array($subscribers)) {
	$subscribers = [];
}

echo json_encode([
	'success' => true,
	'subscribers' => $subscribers,
	'count' => count($subscribers)
]);
exit;
