const form = document.getElementById('passwordForm');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const message = document.getElementById('message');

form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    if (newPassword.value === confirmPassword.value) {
        message.textContent = 'Password successfully change!';
        message.style.color = 'green';
    } else {
        message.textContent = 'Passwords do not match. Please try again.';
        message.style.color = 'red';
    }
});