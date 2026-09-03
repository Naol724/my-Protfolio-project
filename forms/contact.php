<?php
/**
 * Portfolio contact form — Hostinger-ready
 * Requires: assets/vendor/php-email-form/php-email-form.php
 */

$mail_config = [
  'receiving_email' => 'naolgonfa39@gmail.com',
  'use_smtp' => false,
  'smtp' => [
    'host' => 'smtp.hostinger.com',
    'username' => '',
    'password' => '',
    'port' => 465,
    'encryption' => 'ssl',
  ],
];

$local_config_path = __DIR__ . '/mail.config.local.php';
if (file_exists($local_config_path)) {
  $local_config = include $local_config_path;
  if (is_array($local_config)) {
    $mail_config = array_replace_recursive($mail_config, $local_config);
  }
}

$php_email_form = dirname(__DIR__) . '/assets/vendor/php-email-form/php-email-form.php';
if (!file_exists($php_email_form)) {
  http_response_code(500);
  die('Unable to load the PHP Email Form library.');
}

require $php_email_form;

$contact = new PHP_Email_Form;
$contact->ajax = true;
$contact->to = $mail_config['receiving_email'];
$contact->from_name = $_POST['name'] ?? '';
$contact->from_email = $_POST['email'] ?? '';
$contact->subject = $_POST['subject'] ?? '';
$contact->honeypot = $_POST['hp_field'] ?? '';

if (!empty($mail_config['use_smtp']) && !empty($mail_config['smtp'])) {
  $contact->smtp = $mail_config['smtp'];
}

$contact->add_message($_POST['name'] ?? '', 'From');
$contact->add_message($_POST['email'] ?? '', 'Email');
$contact->add_message($_POST['subject'] ?? '', 'Subject');
$contact->add_message($_POST['message'] ?? '', 'Message', 10);

echo $contact->send();
