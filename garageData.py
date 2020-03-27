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
def _load_key(client, entity_type, entity_id=None, parent_key=None):
    """Load a datastore key using a particular client, and if known, the ID.
    Note that the ID should be an int - we're allowing datastore to generate
    them in this example."""

    key = None
    if entity_id:
        key = client.key(entity_type, entity_id, parent=parent_key)
    else:
        # this will generate an ID
        key = client.key(entity_type)
    return key


# follow project 9 ex
def _load_key(client, entity_type, entity_id=None, parent_key=None):
    """Load a datastore key using a particular client, and if known, the ID.
    Note that the ID should be an int - we're allowing datastore to generate
    them in this example."""

    key = None
    if entity_id:
        key = client.key(entity_type, entity_id, parent=parent_key)
    else:
        # this will generate an ID
        key = client.key(entity_type)
    return key


def _load_entity(client, entity_type, entity_id, parent_key=None):
    """Load a datstore entity using a particular client, and the ID."""

    key = _load_key(client, entity_type, entity_id, parent_key)
    entity = client.get(key)
    log('retrieved entity for ' + str(entity_id))
    return entity

#insert garage object
def createGarage(garage):
    log("Storing garage entity %s " + garage.name)
    client = getClient()
    if not garage.gID:
        key=(_load_key(client, _GARAGE_ENTITY))
        garage.gID = key.id_or_name
        entity = datastore.Entity(key)
    else:
        key = _load_key(client, _GARAGE_ENTITY, garage.gID)
        entity = datastore.Entity(key)

    entity['gID'] = datastore.Entity(_load_key(client, _GARAGE_ENTITY, garage.phone)) #temporarily using pn# as ID
    entity['name'] = garage.name
    entity['floorCount'] = garage.floorCount
    entity['spaces'] = garage.spaces
    entity['address'] = garage.address
    entity['phone'] = garage.phone
    entity['ownerDL'] = garage.ownerDL
    client.put(entity)
    log('Saved new Garage. name: %s' + garage.name)

#Create garage from datastore entity
def _garage_from_entity(garage_entity):
    
    log("Creating garage from entity...")
    gID = garage_entity.key.name
    name = garage_entity['name']
    floorCount = garage_entity['floorCount']
    spaces = garage_entity['spaces']
    address = garage_entity['address']
    phone = garage_entity['phone']
    ownerDL = garage_entity['ownerDL']
    garageVal = Garage(gID, name, floorCount, spaces, address, phone, ownerDL)
    log("Returning garage from entity...")
    return garageVal


#NEED TO CHANGE
#Load value from datastore based on NAME
def load_garage(phone):
    log('Loading a Garage: %s ' + phone)
    client = getClient()
    garage_entity = _load_entity(client, _GARAGE_ENTITY, phone)
    log('Loaded a Garage named: %s ' + phone)
    
    rGarage = _garage_from_entity(garage_entity)
    return rGarage


