const apiKey = "c47cf5959d66413c84a101039250302";

function callAPI() {
    const city = document.getElementById("cityInput").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (!city) {
        errorMessage.textContent = "Please enter a city name!";
        return;
    }

    errorMessage.textContent = ""; // Clear previous errors

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found or API error.");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("weather_city").textContent = data.location.name || "N/A";
            document.getElementById("weather_temperature").textContent = `${data.current.temp_c}°C` || "N/A";
            document.getElementById("weather_condition").textContent = data.current.condition.text || "N/A";
        })
        .catch(error => {
            console.error("Error:", error);
            errorMessage.textContent = "Could not fetch weather data. Please check the city name and try again.";
        });
}
