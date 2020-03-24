class Space(object):
    def __init__(self, id, num, floor, garage, taken):
        # id is essentially the space number + garage it resides in
        self.id = str(num) + ':' + garage
        self.num = num
        self.floor = floor
        self.garage = garage
        self.taken = False

    def toDict(self):
        return {
            'id': self.id, 
            'num': self.num,
            'floor': self.floor,
            'garage': self.garage,
            'taken': self.taken,
        }
