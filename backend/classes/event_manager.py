from classes.color_change_event import color_change_event as cevt

class color_event_manager:
    '''
    simple class for tracking color_change_events.
    the intention is to use this for routing to other classes that handle more complex evenet functionality.
    '''
    def __init__(self):
        self.frame_size: int = 1000
        self.event_frames: list[list[cevt]] = [ [ ] ]
        self.grid: list[list[cevt]] = []
        self.snapshot: dict = {
            'most_recent_event': 0,
            'grid': []
        }
        for x in range(100):
            self.grid.append([])
            for y in range(100):
                self.grid[x].append(cevt())
        return

    def add_event(self, event: cevt):
        '''
        add an event to the queue. 
        '''
        if event.position.x > 100 or event.position.y > 100 or event.position.x < 0 or event.position.y < 0:
            return
        if event.position.x > 0:
            event.position.x -= 1
        if event.position.y > 0:
            event.position.y -= 1
        event.id = self.next_id()
        
        lst_frame = self.event_frames[len(self.event_frames)-1]
        # only make new frames when we have events to put in them
        if len(lst_frame) >= self.frame_size:
            lst_frame = []
            self.event_frames.append(lst_frame)
        self.grid[event.position.x][event.position.y] = event
        self.snapshot['most_recent_event'] = event.id
        lst_frame.append(event)
        return

    def get_events(self, event_index: int, max_events: int = -1) -> list:
        '''
        get all elements with higher id than the index provided
        '''
        idx = event_index % self.frame_size
        frame = event_index - idx
        frame_offset = 0
        if len(self.event_frames[0]) > 0:
            frames_start_at = self.event_frames[0][0].id
            fs_idx = frames_start_at % self.frame_size
            fs_f = frames_start_at - fs_idx
            frame_offset = frame - fs_f
        if frame_offset < 0:
            frame_offset = 0
        
        frame_jumps = 0
        while frame_offset > 0:
            frame_jumps += 1
            frame_offset -= self.frame_size
        
        if frame_jumps > len(self.event_frames)-1:
            frame_jumps = len(self.event_frames)-1
        
        events: list[cevt] = []
        f = frame_jumps
        while f < len(self.event_frames):
            for evt in self.event_frames[f]:
                if evt.id > event_index:
                    print(f'return {evt.id} from event frame {f}')
                    events.append(evt.serializable())
            f += 1
        
        if max_events > -1:
            events = events[0: max_events]
        return events
    
    def get_snapshot(self):
        serializable_grid = []
        self.snapshot['grid'] = serializable_grid
        for col in self.grid:
            scol = []
            serializable_grid.append(scol)
            for event in col:
                scol.append(event.serializable())

        return self.snapshot

    def next_id(self) -> int:
        at_id = 1
        last_frame = self.event_frames[len(self.event_frames)-1]
        # if this is the first event
        if len(last_frame) == 0:
            return at_id
        
        at_id = last_frame[len(last_frame)-1].id
        
        return at_id + 1