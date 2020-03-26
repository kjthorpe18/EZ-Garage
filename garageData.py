#ARC

from google.cloud import datastore
from garage import Garage

_GARAGE_ENTITY = 'Garage'

def log(msg):
    """Log a simple message."""

    print('GarageData: %s' % msg)

def getClient():
     return datastore.Client()


#project 9 ex
def _load_key(client,  entity_id=None):
    """Load a datastore key using a particular client, and if known, the ID.
    Note that the ID should be an int - we're allowing datastore to generate
    them in this example."""

    key = None
    if entity_id:
        key = client.key(_GARAGE_ENTITY, int(entity_id) )
    else:
        # this will generate an ID
        key = client.key(_GARAGE_ENTITY)
    return key

#NEED TO CHANGE
# follow project 9 ex
def _load_entity(client, entity_id,):
    """Load a datstore entity using a particular client, and the ID."""

    key = _load_key(client, entity_id)
    entity = client.get(key)
    log('retrieved entity for ' + entity_id)
    return entity  

#insert garage object
def createGarage(garage):
    log("Storing garage entity %s " + garage.name)
    client = getClient()
    key = None
    entity = None
    key = _load_key(client) # generate a key for the entity
    garage.gID= key.id_or_name
    entity = datastore.Entity(key) # create empty entity with the key from above
    entity['name'] = garage.name
    entity['floorCount'] = garage.floorCount
    entity['spaces'] = garage.spaces
    entity['address'] = garage.address
    entity['phone'] = garage.phone
    entity['ownerDL'] = garage.ownerDL
    client.put(entity)
    log('Saved new Garage. gID: %s' % key.id_or_name)

#Create garage from datastore entity
def _garage_from_entity(garage_entity):
    
    log("Creating garage from entity...")
    name = garage_entity.key.name
    floorCount = garage_entity['floorCount']
    spaces = garage_entity['spaces']
    address = garage_entity['address']
    phone = garage_entity['phone']
    ownerDL = garage_entity['ownerDL']
    garageVal = Garage(None, name, floorCount, spaces, address, phone, ownerDL)
    log("Returning garage from entity...")
    return garageVal


#NEED TO CHANGE
#Load value from datastore based on NAME
def load_garage(gName):
    log('Loading a Garage: %s ' + gName)
    client = getClient()
    garage_entity = _load_entity(client, _GARAGE_ENTITY, gName)
    log('Loaded a Garage named: %s ' + gName)
    
    rGarage = _garage_from_entity(garage_entity)
    return rGarage


