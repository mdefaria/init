const leftEye = document.getElementById('left-eye');
const rightEye = document.getElementById('right-eye');

document.addEventListener('mousemove', (e) => {
    const { clientX: mouseX, clientY: mouseY } = e;

    moveEye(leftEye, mouseX, mouseY);
    moveEye(rightEye, mouseX, mouseY);
});

function moveEye(eye, mouseX, mouseY) {
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    const distance = Math.min(eyeRect.width / 3, eyeRect.height / 3);

    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    eye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}
