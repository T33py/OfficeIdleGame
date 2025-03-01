// Get the canvas element and its context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Set canvas dimensions (optional)
canvas.width = 1920;
canvas.height = 1080;

// Function to update the canvas content
function updateCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw something on the canvas
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 100, 100); // Example: Draw a blue rectangle

    // You can add more dynamic content here
}

// Call the update function initially
updateCanvas();

// Optionally, set up a loop to continuously update the canvas
setInterval(updateCanvas, 1000); // Update at 1 FPS