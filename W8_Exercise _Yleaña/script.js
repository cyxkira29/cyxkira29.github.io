document.addEventListener("DOMContentLoaded", () => {
    const toggleModeBtn = document.getElementById("toggleMode");
    const languageSelect = document.getElementById("languageSelect");

    // Dark Mode Toggle
    toggleModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        toggleModeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀ Light Mode" : "🌙 Dark Mode";
    });

    // Language Dictionary
    const translations = {
        en: {
            title: "Yleaña Week 5 CSS Activity 1-4",
            activitiesTitle: "CSS Activities",
            exercise1: "Exercise 1",
            exercise2: "Exercise 2",
            exercise3: "Exercise 3",
            exercise4: "Exercise 4",
            exercise5: "Exercise 5",
            api: "API Activity"
        },
        es: {
            title: "Yleaña Semana 5 Actividad CSS 1-4",
            activitiesTitle: "Actividades de CSS",
            exercise1: "Ejercicio 1",
            exercise2: "Ejercicio 2",
            exercise3: "Ejercicio 3",
            exercise4: "Ejercicio 4",
            exercise5: "Ejercicio 5",
            api: "Actividad API"
        },
        fr: {
            title: "Yleaña Semaine 5 Activité CSS 1-4",
            activitiesTitle: "Activités CSS",
            exercise1: "Exercice 1",
            exercise2: "Exercice 2",
            exercise3: "Exercice 3",
            exercise4: "Exercice 4",
            exercise5: "Exercice 5",
            api: "Activité API"
        }
    };

    // Language Change Event
    languageSelect.addEventListener("change", () => {
        const lang = languageSelect.value;
        document.getElementById("title").textContent = translations[lang].title;
        document.getElementById("activitiesTitle").textContent = translations[lang].activitiesTitle;

        document.querySelectorAll("ol li a").forEach((link) => {
            const key = link.getAttribute("data-key");
            link.textContent = translations[lang][key];
        });
    });
});
