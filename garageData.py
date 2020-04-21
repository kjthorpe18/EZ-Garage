#ARC

import spaceData

from google.cloud import datastore
from garage import Garage
from space import Space

_GARAGE_ENTITY = 'Garage'

def log(msg):
    """Log a simple message."""

    print('GarageData: %s' % msg)

def getClient():
    client = None
    try: # When we run 'gcloud app deploy' this will work and it will connect to the database
        client = datastore.Client()
        return client
    except: # if that doesn't work, look for the local path to the API keys for the database
        # return datastore.Client.from_service_account_json('/Users/kylethorpe/Desktop/service-acct-keys.json')
        return datastore.Client.from_service_account_json('/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')
        #return datastore.Client.from_service_account_json("/Users/Jared/Documents/College Doc's/Senior Year/Second Semester/Web Dev/service-acct-keys.json")
        # return datastore.Client.from_service_account_json('D:\CS1520\service-acct-keys.json')



# follow project 9 ex
def _load_key(client, entity_type, entity_id=None, parent_key=None):
    """Load a datastore key using a particular client, and if known, the ID.
    Note that the ID should be an int - we're allowing datastore to generate
    them in this example."""
    log('in load key')
    key = None
    if entity_id:
        log ('in load key if')
        key = client.key(entity_type, entity_id, parent=parent_key)
    else:
        # this will generate an ID
        key = client.key(entity_type)
    log('returning key')
    return key


def _load_entity(client, entity_type, entity_id, parent_key=None):
    """Load a datstore entity using a particular client, and the ID."""

    key = _load_key(client, entity_type, entity_id, parent_key)
    entity = client.get(key)
    log(entity)
    log('retrieved entity for ' + str(entity_id))
    return entity

#insert garage object
def createGarage(garage):
    log("Storing garage entity: " + garage.name)
    client = getClient()
    entity = datastore.Entity(_load_key(client, _GARAGE_ENTITY, garage.name))
    entity['Name'] = garage.name
    entity['numSpots'] = garage.numSpots
    entity['numHandicapSpots'] = garage.numHandicapSpots
    entity['Address'] = garage.address
    entity['Phone'] = garage.phone
    entity['Owner DL'] = garage.ownerDL
    # entity['user_id'] = garage.user_id
    # Added code for coords
    entity['latitude'] = garage.lat
    log('latitude ' + garage.lat)
    entity['longitude'] = garage.long
    log('longitude ' + garage.long)

    log('putting entity')
    client.put(entity)
    log('Saved new Garage. name: %s' % garage.name)

    totalNumSpots = garage.numHandicapSpots + garage.numSpots
    for i in range(0, totalNumSpots):
        log('creating new spot')
        newSpot = None
        if i < garage.numHandicapSpots:
            newSpot = Space(garage.name, i, True)
        else:
            newSpot = Space(garage.name, i, False)
        spaceData.createSpace(newSpot)


#Create garage from datastore entity
def _garage_from_entity(garage_entity):
    log("Creating garage from entity...")
    name = garage_entity['Name']
    numSpots = garage_entity['numSpots']
    numHandicapSpots = garage_entity['numHandicapSpots']
    address = garage_entity['Address']
    phone = garage_entity['Phone']
    ownerDL = garage_entity['Owner DL']
    garageVal = Garage(name, numSpots, numHandicapSpots, address, phone, ownerDL)
    log("Returning garage from entity...")
    return garageVal


#NEED TO CHANGE
#Load value from datastore based on PHONE
def load_garage(gName):
    log('Loading a Garage: %s ' + gName)
    client = getClient()
    garage_entity = _load_entity(client, _GARAGE_ENTITY, gName)
    rGarage = _garage_from_entity(garage_entity)
    return rGarage

# This is supposed to get all garage entities
# For the reserve dropdowns
def load_all_garages():
    log('Getting all garages...')
    client = getClient()

    query = client.query(kind='Garage')
    results = list(query.fetch())
    log(results)
    return results

def load_all_garages_dl(dlNumber):
    log('Loading Garages for owner:' + dlNumber)
    client = getClient()
    query = client.query(kind = 'Garage')
    query.add_filter('Owner DL', '=', dlNumber)
    returnList = []
    iterable = list(query.fetch())
    log('Iterable Contents: ' + str(len(iterable)))
    for x in iterable:
        newGarage = _garage_from_entity(x)
        log('New Garage name' + newGarage.name)
        returnList.append(newGarage)

    return returnList
