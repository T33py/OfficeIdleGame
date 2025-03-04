const event_template = {
    color: '000000',
    position: {
        x: 1,
        y: 1
    }
}

function move_up(){
    if (event_template.position.y > 1){
        event_template.position.y -= 1
    }
    update_coordinates()
    send_event(event_template)
}
function move_down(){
    if (event_template.position.y < 100){
        event_template.position.y += 1
    }
    update_coordinates()
    send_event(event_template)
}
function move_left(){
    if (event_template.position.x > 1){
        event_template.position.x -= 1
    }
    update_coordinates()
    send_event(event_template)
}
function move_right(){
    if (event_template.position.x < 100){
        event_template.position.x += 1
    }
    update_coordinates()
    send_event(event_template)
}

function color_changed(){
    var r = document.getElementById('r').value
    var g = document.getElementById('g').value
    var b = document.getElementById('b').value
    var color = r + g + b
    event_template.color = color
}

function update_coordinates(){
    var label = document.getElementById('coordinates')
    label.innerText = `(${event_template.position.x}, ${event_template.position.y})`
}

async function send_event(evt){
    console.log(`send {${evt.color}, (${evt.position.x}, ${evt.position.y})}`)
    await fetch('/post_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evt)
    });
}