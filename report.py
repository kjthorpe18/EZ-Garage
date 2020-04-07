
#Reported stolen spot userBy is user accusing
class Report(object):
    def __init__(self, userBy, description, plate, garage, space, dateReported, dateOccured):
        self.userBy = userBy
        self.description = description  
        self.plate = plate
        self.garage = garage
        self.space = space
        self.dateReported = dateReported        #Timestamp of user submission
        self.dateOccured = dateOccured            #date of spot being stolen
        
    #add setter functions

    def toDict(self):
        return {
            'userBy' : userBy,
            'plate' : plate,
            'garage': garage,
            'space': space,
            'dateReported': dateReported,
            'dateOccured': dateOccured
        }