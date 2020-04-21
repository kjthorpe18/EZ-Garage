class Car(object):
    def __init__(self, owner='', make='', model='', plate_num=''):
        self.owner = owner
        self.make = make
        self.model = model
        self.plate_num = plate_num

    def toDict(self):
        return {
            'owner': self.owner,
            'make': self.make,
            'model': self.model,
            'plate_num': self.plate_num,
        }

