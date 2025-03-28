<?php
header('Content-Type: application/json');

// Include PHPMailer files
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize input
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    
    // Validate input
    if (!$name || !$email || !$message) {
        echo json_encode([
            "success" => false,
            "message" => "Please fill in all fields correctly."
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid email address."
        ]);
        exit;
    }
    
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'saikumar.kota960@gmail.com';
        $mail->Password = 'Saikumar@6225';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom($email, $name);
        $mail->addAddress('saikumar.kota960@gmail.com');
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission from SR Digitals Website";
        $mail->Body = "
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        ";
        
        $mail->send();
        echo json_encode([
            "success" => true,
            "message" => "Thank you! Your message has been sent successfully."
        ]);
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        echo json_encode([
            "success" => false,
            "message" => "Sorry, there was an error sending your message. Please try again later."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
}
?> 