# This is a simple class used to represent a checkin in the DB

class Checkin(object):
    def __init__(self, user_id, date, time_in, time_out, space_id, garage_id):
        self.user_id = user_id
        self.date = date
        self.time_in = time_in
        self.time_out = time_out
        self.space_id = space_id
        self.garage_id = garage_id

    def to_dict(self):
        return{
            'user_id': self.user_id,
            'date': self.date,
            'time_in': self.time_in,
            'time_out': self.time_out,
            'space_id': self.space_id,
            'garage_id': self.garage_id
        }