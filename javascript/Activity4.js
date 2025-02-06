document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleMode");
    const body = document.body;

    // Load Theme from Local Storage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        updateToggleButton(true);
    }

    // Toggle Dark Mode
    toggleButton.addEventListener("click", () => {
        const isDarkMode = body.classList.toggle("dark-mode");
        
        // Save Mode Preference
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");

        // Update Button UI
        updateToggleButton(isDarkMode);
    });

    // Function to Update Button Text/Icon
    function updateToggleButton(isDark) {
        toggleButton.innerHTML = isDark
            ? `<i class="fas fa-sun"></i> Light Mode`
            : `<i class="fas fa-moon"></i> Dark Mode`;
    }
});
