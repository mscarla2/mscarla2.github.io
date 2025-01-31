const createGeometricObject = () => {
    const shapes = ['circle', 'square', 'triangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    const obj = document.createElement('div');
    obj.classList.add('geometry', shape);
    obj.style.width = obj.style.height = `${Math.random() * 30 + 20}px`;
    obj.style.top = `${Math.random() * window.innerHeight}px`;
    obj.style.left = `${Math.random() * window.innerWidth}px`;

    document.body.appendChild(obj);
    return obj;
};

const randomSign = () => (Math.random() > 0.5 ? 1 : -1);

const objects = Array.from({ length: 50 }, createGeometricObject).map(obj => {
    const size = parseInt(obj.style.width); // Assume width = height
    return {
        el: obj,
        radius: size / 2,
        x: parseFloat(obj.style.left),
        y: parseFloat(obj.style.top),
        vx: (Math.random() * 2 + 1) * randomSign(),
        vy: (Math.random() * 2 + 1) * randomSign(),
    };
});

const repelMouse = 100; // Radius around the cursor
let mouseX = 0,
    mouseY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Function to detect collision between two circles
const detectCollision = (objA, objB) => {
    const dx = objA.x - objB.x;
    const dy = objA.y - objB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < objA.radius + objB.radius; // Collision occurs if distance < combined radii
};

// Resolve collisions by adjusting velocities
const resolveCollision = (objA, objB) => {
    const dx = objA.x - objB.x;
    const dy = objA.y - objB.y;

    // Normalized vector for collision direction
    const angle = Math.atan2(dy, dx);

    // Velocity swaps in the collision direction
    const speedA = Math.sqrt(objA.vx * objA.vx + objA.vy * objA.vy);
    const speedB = Math.sqrt(objB.vx * objB.vx + objB.vy * objB.vy);

    objA.vx = speedB * Math.cos(angle);
    objA.vy = speedB * Math.sin(angle);
    objB.vx = speedA * -Math.cos(angle);
    objB.vy = speedA * -Math.sin(angle);
};

const animateObjects = () => {
    objects.forEach((obj, i) => {
        const rect = obj.el.getBoundingClientRect();

        // Bounce off walls
        if (obj.x <= 0 || obj.x + obj.radius * 2 >= window.innerWidth) obj.vx *= -1;
        if (obj.y <= 0 || obj.y + obj.radius * 2 >= window.innerHeight) obj.vy *= -1;

        // Repel from mouse
        const dxMouse = obj.x + obj.radius - mouseX;
        const dyMouse = obj.y + obj.radius - mouseY;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < repelMouse) {
            const angleMouse = Math.atan2(dyMouse, dxMouse);
            obj.vx += Math.cos(angleMouse) * 0.5;
            obj.vy += Math.sin(angleMouse) * 0.5;
        }

        // Check for collisions with other objects
        for (let j = i + 1; j < objects.length; j++) {
            const other = objects[j];
            if (detectCollision(obj, other)) {
                resolveCollision(obj, other);
            }
        }

        // Update position
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Apply positions to DOM element
        obj.el.style.left = `${obj.x}px`;
        obj.el.style.top = `${obj.y}px`;
    });

    requestAnimationFrame(animateObjects);
};

animateObjects();
