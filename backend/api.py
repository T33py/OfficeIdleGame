from flask import Flask, request, jsonify
from classes.event_manager import color_event_manager
from classes.color_change_event import color_change_event

app = Flask(__name__)
event_manager: color_event_manager = color_event_manager()
# for i in range(25):
#     event_manager.add_event(color_change_event())

@app.route("/")
def hello_world():
    return "<h1>Hello, World!</h1>"


@app.route("/events/<int:event_id>", methods=['GET', 'POST'])
def event_queue(event_id):
    event_id = int(event_id)
    data = { 
        'message': f'Invalid request: {request.method}',
        'code': 400
    }
    print(f'${request.method}')
    if request.method == 'GET':
        data['message'] = f'Events newer than {event_id}'
        data['code'] = 200
        if 'max_events' in request.args:
            data['events'] = event_manager.get_events(event_id, int(request.args.get('max_events')))
        else:
            data['events'] = event_manager.get_events(event_id, 100)

    return jsonify(data), data['code']


@app.route("/input", methods=['POST'])
def recieve_input():
    data = { 
        'message': f'Invalid request: {request.method}',
        'code': 400
    }
    if request.method == 'POST':
        event_manager.add_event(color_change_event(template=request.get_json()))
        data['message'] = 'event added'
        data['code'] = 200
        
    return jsonify(data), data['code']
    

@app.route("/snapshot", methods=['GET'])
def get_snapshot():
    return jsonify(event_manager.snapshot())

if __name__ == '__main__':
    app.run(debug=True)