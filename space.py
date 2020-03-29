class Space(object):
    def __init__(self, space_id, num, floor, garage, taken):
        # space_id is essentially the space number + garage it resides in
        self.space_id = str(num) + ':' + garage
        self.num = num
        self.floor = floor
        self.garage = garage
        self.taken = False

    def toDict(self):
        return {
            'space_id': self.space_id, 
            'num': self.num,
            'floor': self.floor,
            'garage': self.garage,
            'taken': self.taken,
        }
