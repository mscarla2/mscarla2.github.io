document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('background-animation');
    if (!container) return;

    const shapes = ['circle', 'square', 'triangle'];
    const shapeCount = 20;

    for (let i = 0; i < shapeCount; i++) {
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const el = document.createElement('div');
        el.classList.add('geometry', shapeType);

        const size = Math.random() * 60 + 20; // 20px to 80px
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = `${Math.random() * 100}vw`;
        el.style.top = `${Math.random() * 100}vh`;
        el.style.opacity = Math.random() * 0.5 + 0.1; // 0.1 to 0.6
        el.style.animationDuration = `${Math.random() * 20 + 15}s`; // 15s to 35s
        el.style.animationDelay = `${Math.random() * 10}s`;

        container.appendChild(el);
    }
});