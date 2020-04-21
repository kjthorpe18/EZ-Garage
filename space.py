class Space(object):
    def __init__(self, garage, num, handicap=False):
        # space_id is essentially the space number + garage it resides in
        self.space_id = str(garage) + '_' + str(num)
        self.num = num
        self.garage = garage
        self.handicap = handicap

    def toDict(self):
        return {
            'space_id': self.space_id, 
            'num': self.num,
            'garage': self.garage,
            'handicap': self.handicap,
        }
