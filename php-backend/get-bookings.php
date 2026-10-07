<?php
// php-backend/get-bookings.php: Return all bookings for admin dashboard
header('Content-Type: application/json');

// Simple bearer token check for admin access
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$adminToken = 'Bearer admin_secret_key_2025';
if ($authHeader !== $adminToken) {
	http_response_code(401);
	echo json_encode(['success' => false, 'error' => 'Unauthorized']);
	exit;
}

$file = __DIR__ . '/../bookings.json';
if (!file_exists($file)) {
	file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
}
$bookings = json_decode(file_get_contents($file), true);
if (!is_array($bookings)) {
	$bookings = [];
}

echo json_encode([
	'success' => true,
	'bookings' => $bookings,
	'count' => count($bookings)
]);
exit;
