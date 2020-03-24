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

