from datetime import datetime

class color_change_event:
    def __init__(self, template = None):
        self.time_format = '%Y-%m-%d-%H-%M-%S-%f'
        self.id: int = 0
        self.position: position = position()
        self.color = 'ffffff'
        self.timestamp: datetime = datetime.now()

        if template != None:
            if 'id' in template:
                self.id = int(template['id'])
            if 'position' in template:
                self.position.x = template['position']['x']
                self.position.y = template['position']['y']
            if 'color' in template:
                self.color = template['color']
            if 'timestamp' in template:
                self.timestamp = datetime.strptime(template['timestamp'], self.time_format)
        return
    
    def serializable(self) -> dict:
        ts = self.timestamp
        rep = {
            'type': 'color_change',
            'id': self.id,
            'color': self.color,
            'position': {
                'x': self.position.x,
                'y': self.position.y
            },
            'timestamp': self.timestamp.strftime(self.time_format)
        }
        return rep

    def __str__(self):
        return f'{self.id}: {self.color} at ({self.position.x}, {self.position.y})'

class position:
    def __init__(self):
        self.x: int = 0
        self.y: int = 0
        pass