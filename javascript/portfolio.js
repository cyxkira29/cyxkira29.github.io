document.addEventListener("DOMContentLoaded", function () {
    // Sections and Navbar Links
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");

    // 🟢 Smooth Scrolling for Navbar Links
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor jump

            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust for fixed navbar
                    behavior: "smooth",
                });
            }
        });
    });

    // 🟢 Navbar Highlight on Scroll
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // 🟢 Scroll Effects for Section Reveal
    const revealSections = document.querySelectorAll(".about, .contact, .skills, .projects, #questions");
    const revealSection = () => {
        revealSections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add("show");
            }
        });
    };

    window.addEventListener("scroll", revealSection);
    revealSection(); // Initial check

    // 🟢 Scroll to Top Button
    const scrollToTopBtn = document.getElementById("scrollToTop");

    window.addEventListener("scroll", function () {
        scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    scrollToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 🟢 Scroll Progress Bar
    const progressBar = document.createElement("div");
    progressBar.id = "progressBar";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (scrollTop / scrollHeight) * 100 + "%";
    });

    // 🟢 Clickable Project Boxes (Fixing Smooth Scrolling)
    const projectBoxes = document.querySelectorAll(".project-box");

    projectBoxes.forEach((box) => {
        box.addEventListener("click", () => {
            const projectId = box.getAttribute("data-target");
            const targetProject = document.getElementById(projectId);

            if (targetProject) {
                window.scrollTo({
                    top: targetProject.offsetTop - 80,
                    behavior: "smooth",
                });
            }
        });
    });

    // 🟢 Change Header Background on Scroll
    window.addEventListener("scroll", () => {
        document.querySelector("header").style.background =
            window.scrollY > 50 ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.8)";
    });

    // 🟢 Expand Questions on Hover
    document.querySelectorAll(".question").forEach((question) => {
        question.addEventListener("mouseenter", () => {
            question.nextElementSibling.style.display = "block";
        });
        question.addEventListener("mouseleave", () => {
            question.nextElementSibling.style.display = "none";
        });
    });

    // 🟢 Function to Create Particle Effects
    function createParticles(containerId) {
        if (document.getElementById(containerId)) {
            particlesJS(containerId, {
                particles: {
                    number: { value: 80 },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5 },
                    size: { value: 3 },
                    move: { speed: 2 }
                },
                interactivity: {
                    events: {
                        onhover: { enable: true, mode: "repulse" } // Particles move when hovered over
                    }
                }
            });
        }
    }

    // Apply Particle Effect to Specific Sections
    createParticles("particles-about");
    createParticles("particles-skills");
    createParticles("particles-projects");
    createParticles("particles-questions");
});
