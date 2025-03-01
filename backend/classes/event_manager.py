from classes.color_change_event import color_change_event as cevt

class color_event_manager:
    '''
    simple class for tracking color_change_events.
    the intention is to use this for routing to other classes that handle more complex evenet functionality.
    '''
    def __init__(self):
        self.frame_size: int = 1000
        self.event_frames: list[list] = [ [ ] ]
        return

    def add_event(self, event):
        '''
        add an event to the queue. 
        '''
        event.id = self.next_id()
        
        lst_frame = self.event_frames[len(self.event_frames)-1]
        # only make new frames when we have events to put in them
        if len(lst_frame) >= self.frame_size:
            lst_frame = []
            self.event_frames.append(lst_frame)
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
        
        # start at -1 to avoid dowhile
        frame_jumps = -1
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
                    events.append(evt.serializable())
            f += 1
        
        if max_events > -1:
            events = events[0: max_events]
        return events
    
    def next_id(self) -> int:
        at_id = 1
        last_frame = self.event_frames[len(self.event_frames)-1]
        # if this is the first event
        if len(last_frame) == 0:
            return at_id
        
        at_id = last_frame[len(last_frame)-1].id
        
        return at_id + 1