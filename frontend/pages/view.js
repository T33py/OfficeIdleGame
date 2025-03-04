// Get the canvas element and its context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const event_queue = []

// Set canvas dimensions (optional)
canvas.width = 2000;
canvas.height = 1100;
const tile_w = canvas.width / 100
const tile_h = canvas.height / 100

var state = {
    at_id: 0
}

// Function to update the canvas content
async function updateCanvas() {
    if (event_queue.length == 0) {
        var new_events = await get_events()
        // console.log(new_events)
        new_events.forEach(event => {
            event_queue.push(event)
        });
        event_queue.reverse()
    }
    if (event_queue.length == 0){
        return
    }

    // Draw something on the canvas
    while (event_queue.length > 0){
        var event = event_queue.pop()
        state.at_id = event.id
        ctx.fillStyle = '#' + event.color;
        ctx.fillRect(event.position.x * tile_w, event.position.y * tile_h, tile_w, tile_h); // Example: Draw a blue rectangle
    }
}

async function get_events(){
    // TODO: fetch events from the api
    events = []
    
    await fetch(`/get_events/${state.at_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(async (response) => {
        var evs = await response.json()
        events = evs.events
    })
    // console.log(events)
    return events
}

async function get_snapshot(){
    var events = await fetch('/get_snapshot', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(async (response) => {
        var snapshot = await response.json()
        return snapshot
    })
    
    console.log(events)
    events.grid.forEach(part => {
        part.forEach(ev => {
            event_queue.push(ev)
        })
    })
    
    setInterval(updateCanvas, 1000); // Update at 1 FPS
}

// Call the update function initially
get_snapshot();