$(document).ready(function () {
    $('.container').mouseenter(function () {
        $('.card').stop().animate({
            top: '-90px'
        }, 'slow');
    }).mouseleave(function () {
        $('.card').stop().animate({
            top: 0
        }, 'slow');
    });

    // Falling Hearts Effect
    const heartContainer = document.querySelector(".heart-container");

    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart-fall");
        heart.innerHTML = "❤️"; // You can replace with an SVG heart
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 2 + "s"; // Random fall speed (2s - 5s)
        heart.style.fontSize = Math.random() * 20 + 10 + "px"; // Random size (10px - 30px)
        heartContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000); // Remove after 5s
    }

    setInterval(createHeart, 300); // New heart every 300ms
});
