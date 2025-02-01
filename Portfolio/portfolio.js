// Scroll Effects for Section Reveal
const sections = document.querySelectorAll(".about, .contact, .skills, .projects");

const revealSection = () => {
    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100) {
            section.classList.add("show");
        }
    });
};

window.addEventListener("scroll", revealSection);
revealSection(); // Initial check

// Scroll to Top Function
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

const scrollToTopBtn = document.getElementById("scrollToTop");
window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollToTopBtn.style.opacity = "1";
    } else {
        scrollToTopBtn.style.opacity = "0";
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll("nav a").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Particle.js Configuration for Multiple Sections
const initParticles = (id) => {
    particlesJS(id, {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            shape: { type: "circle", stroke: { width: 0, color: "#fff" } },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
            move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } }
        },
        retina_detect: true
    });
};

initParticles("particles-js");
initParticles("about-particles");
initParticles("skills-particles");

// Scroll Progress Bar
const progressBar = document.createElement("div");
progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.width = "0";
progressBar.style.height = "4px";
progressBar.style.background = "#00ffcc";
progressBar.style.zIndex = "1000";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercentage + "%";
});
