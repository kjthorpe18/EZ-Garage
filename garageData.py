#ARC

from google.cloud import datastore
from garage import Garage

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
        #return datastore.Client.from_service_account_json('/Users/kylethorpe/Desktop/service-acct-keys.json')
        return datastore.Client.from_service_account_json('/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')



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
    log('retrieved entity for ' + str(entity_id))
    return entity

#insert garage object
def createGarage(garage):
    log("Storing garage entity %s " + garage.name)
    client = getClient()
    log('Testing load key')
    log('creating entity')

    entity = datastore.Entity(_load_key(client, _GARAGE_ENTITY, garage.phone))                   
    entity['gID'] = garage.gID
    log('gID ' + garage.gID)

    entity['name'] = garage.name
    log('Name ' + garage.name)

    entity['floorCount'] = garage.floorCount
    entity['spaces'] = garage.spaces
    entity['address'] = garage.address
    entity['phone'] = garage.phone
    entity['ownerDL'] = garage.ownerDL
    log('ownerDL ' + garage.ownerDL)

    log('putting entity')
    client.put(entity)
    log('Saved new Garage. name: %s' + garage.name)

#Create garage from datastore entity
def _garage_from_entity(garage_entity):

    log("Creating garage from entity...")
    gID = garage_entity['phone']
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
#Load value from datastore based on PHONE
def load_garage(phone):
    log('Loading a Garage: %s ' + phone)
    client = getClient()
    garage_entity = _load_entity(client, _GARAGE_ENTITY, phone)
    log('Loaded a Garage name test: %s ' + garage_entity['phone'])
    log('Loaded a Garage ownerDL test: %s ' + garage_entity['ownerDL'])
    rGarage = _garage_from_entity(garage_entity)
    return rGarage
