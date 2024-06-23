<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $issue = $_POST['issue'];
  
  // Set the recipient email address
  $to = "m.bramer1096@gmail.com";

  // Set the email subject
  $subject = "Issue Report from Task-Man";

  // Email content
  $message = "Name: $name\n\n";
  $message .= "Email: $email\n\n";
  $message .= "Issue:\n$issue\n";

  // Send email
  if (mail($to, $subject, $message)) {
    echo "Email sent successfully.";
  } else {
    echo "Failed to send email.";
  }
}
?>
