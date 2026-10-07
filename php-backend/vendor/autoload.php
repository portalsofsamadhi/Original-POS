<?php
// Autoload for PHPMailer when Composer is not available
$phpmailer_path = __DIR__ . '/vendor/phpmailer/phpmailer/src/';

// Include PHPMailer classes
require_once $phpmailer_path . 'Exception.php';
require_once $phpmailer_path . 'PHPMailer.php';
require_once $phpmailer_path . 'SMTP.php';
