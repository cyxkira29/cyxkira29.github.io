async function fetchJoke() {
    const category = document.getElementById('categorySelect').value;
    const url = `https://v2.jokeapi.dev/joke/${category}?type=single`;

    const jokeArea = document.getElementById('jokeArea');
    const fetchButton = document.getElementById('fetchButton');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    fetchButton.disabled = true;
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    jokeArea.style.opacity = 0;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Joke API Error");

        const data = await response.json();

        loading.style.display = 'none';

        if (data.type === 'single') {
            jokeArea.textContent = data.joke || "No joke found!";
        } else if (data.type === 'twopart') {
            jokeArea.textContent = `${data.setup} - ${data.delivery}`;
        } else {
            jokeArea.textContent = "Sorry, no joke available!";
        }

        jokeArea.style.opacity = 1;

    } catch (error) {
        console.error('Error fetching joke:', error);
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
    } finally {
        fetchButton.disabled = false; 
    }
}
