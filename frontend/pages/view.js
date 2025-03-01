// Get the canvas element and its context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const event_queue = []

// Set canvas dimensions (optional)
canvas.width = 1920;
canvas.height = 1080;
const tile_w = canvas.width / 100
const tile_h = canvas.height / 100

// Function to update the canvas content
function updateCanvas() {
    if (event_queue.length == 0) {
        get_events().array.forEach(event => {
            event_queue.push(event)
        });
        event_queue.reverse
    }
    if (event_queue.length == 0){
        return
    }

    // Draw something on the canvas
    while (event_queue.length > 0){
        var event = event_queue.pop()
        ctx.fillStyle = '#' + event.color;
        ctx.fillRect(event.position.x * tile_w, event.position.y * tile_h, tile_w, tile_h); // Example: Draw a blue rectangle
    }
}

function get_events(){
    // TODO: fetch events from the api
    events = []
    return events
}

// Call the update function initially
updateCanvas();

// Optionally, set up a loop to continuously update the canvas
setInterval(updateCanvas, 1000); // Update at 1 FPS