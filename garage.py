
#ARC
#avoid parents

class Garage(object):
    def __init__(self, gID, name, floorCount,  spaces, address, phone, ownerDL):
        self.gID = gID
        self.name= name
        self.floorCount = floorCount
        self.spaces = spaces                   #Shouldn't have to pass as an array but let's see what happens
        self.address = address
        self.phone = phone
        self.ownerDL = ownerDL

    #add setter functions

    def toDict(self):
        return {
            'gID': self.gID,
            'name': self.name,                  #Name of Garage
            'floorCount': self.floorCount,
            'spaces': self.spaces,              #Array of Spaces: 1A 1B... 4F....
            'address': self.address,   
            'phone': self.phone,
            'ownerDL': self.ownerDL            #For allowing Garage admnin option.
        }