class Garage(object):
    def __init__(self, name, numSpots, numHandicapSpots, address, phone, ownerDL):
        self.gID = name
        self.name = name
        self.numSpots = int(numSpots)
        self.numHandicapSpots = int(numHandicapSpots)
        self.address = address
        self.phone = phone
        self.ownerDL = ownerDL

    
    #add setter functions

    def toDict(self):
        return {
            'gID': self.gID,
            'Name': self.name,                  #Name of Garage
            'numSpots': self.numSpots,
            'numHandicapSpots': self.numHandicapSpots,
            'Address': self.address,
            'Phone': self.phone,
            'ownerDL': self.ownerDL            #For allowing Garage admnin option.
        }