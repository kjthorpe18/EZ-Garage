class Car(object):
    def __init__(self, make='', model='', plate_num=''):
        self.make = make
        self.model = model
        self.plate_num = plate_num

    def toDict(self):
        return {
            'make': self.make,
            'model': self.model,
            'plate_num': self.plate_num,
        }

class Space(object):
    def __init__(self, id, floor, taken, pwd=''):
        self.id = id
        self.floor = floor
        self.taken = False

    def toDict(self):
        return {
            'id': self.id,
            'floor': self.floor,
            'taken': self.taken,
        }