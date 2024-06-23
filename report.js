  // Handle form submission
  document.getElementById('report-issue-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const issue = document.getElementById('issue').value;

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Issue:', issue);

    // Add code to send email or handle form data
    alert('Thank you for your report!');

    // Close the modal after submission
    closeModal('report-modal');
});