document.addEventListener("DOMContentLoaded", function() {
    const starsContainer = document.querySelector(".stars");

    // Generate falling stars dynamically
    for (let i = 0; i < 15; i++) {
        let star = document.createElement("div");
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        star.style.animationDelay = `${Math.random()}s`;
        starsContainer.appendChild(star);
    }
});

// Fetch jokes from Joke API
async function fetchJoke() {
    const jokeArea = document.getElementById("jokeArea");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");
    const category = document.getElementById("categorySelect").value;

    jokeArea.style.opacity = "0";
    loading.style.display = "block";
    errorMessage.style.display = "none";

    try {
        let response = await fetch(`https://v2.jokeapi.dev/joke/${category}?type=single`);
        let data = await response.json();

        if (data.joke) {
            jokeArea.textContent = `"${data.joke}"`;
            jokeArea.style.opacity = "1";
        } else {
            jokeArea.textContent = "Oops! No joke found.";
        }
    } catch (error) {
        errorMessage.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}
