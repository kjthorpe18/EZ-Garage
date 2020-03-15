
#ARC
#avoid parents

class Garage(object):
    def __init__(self, name='', floorCount=0,  spaces, address='', phone=0, ownerDL=0):
        self.name= name
        self.floorCount = floorCount
        self.spaces = spaces                   #Shouldn't have to pass as an array but let's see what happens
        self.address = address
        self.phone = phone
        self.ownerDL = ownerDL

    #add setter functions

    def toDict(self):
        return {
            'name': self.name,                  #Name of Garage
            'floorCount': self.username,
            'spaces': self.spaces,              #Array of Spaces: 1A 1B... 4F....
            'address': self.address,   
            'phone': self.phone,
            'ownerDL': self.ownerDL            #For allowing Garage admnin option.
        }