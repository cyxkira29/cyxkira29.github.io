const toggleButton = document.getElementById('toggleMode');
const body = document.body;

// Check & Apply Mode from Local Storage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    updateToggleButton(true);
}

// Toggle Dark Mode on Click
toggleButton.addEventListener('click', () => {
    const isDarkMode = body.classList.toggle('dark-mode');

    // Save Preference in Local Storage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Update Button Appearance
    updateToggleButton(isDarkMode);
});

// Function to Update Button Text/Icon
function updateToggleButton(isDark) {
    if (isDark) {
        toggleButton.innerHTML = `<i class="fas fa-sun"></i> Light Mode`;
    } else {
        toggleButton.innerHTML = `<i class="fas fa-moon"></i> Dark Mode`;
    }
}
