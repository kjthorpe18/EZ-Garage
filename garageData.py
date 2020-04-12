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
        #return datastore.Client.from_service_account_json('/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')
        return datastore.Client.from_service_account_json('D:\CS1520\service-acct-keys.json')
    


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
    log("Storing garage entity: " + garage.name)
    client = getClient()
    

    entity = datastore.Entity(_load_key(client, _GARAGE_ENTITY, garage.name))                   

    entity['Name'] = garage.name
    log('Name ' + garage.name)

    entity['Floor Count'] = garage.floorCount
    entity['Spaces'] = garage.spaces
    entity['Address'] = garage.address
    entity['Phone'] = garage.phone
    entity['Owner DL'] = garage.ownerDL
    log('Owner DL ' + garage.ownerDL)
    entity['Longitude'] = garage.long
    entity['Latitude'] = garage.lat

    log('putting entity')
    client.put(entity)
    log('Saved new Garage. name: ' + garage.name)

#Create garage from datastore entity
def _garage_from_entity(garage_entity):

    log("Creating garage from entity...")
    #gID = garage_entity['phone']
    name = garage_entity['Name']
    floorCount = garage_entity['Floor Count']
    spaces = garage_entity['Spaces']
    address = garage_entity['Address']
    phone = garage_entity['Phone']
    ownerDL = garage_entity['Owner DL']
    long= garage_entity['Longitude']
    lat = garage_entity['Latitude']
    garageVal = Garage(name, floorCount, spaces, address, phone, ownerDL, long, lat)
    log('Returning garage from entity...')
    return garageVal


#NEED TO CHANGE
#Load value from datastore based on PHONE
def load_garage(phone):
    log('Loading a Garage: %s ' + phone)
    client = getClient()
    garage_entity = _load_entity(client, _GARAGE_ENTITY, phone)
    log('Loaded a Garage name test: %s ' + garage_entity['Name'])
    log('Loaded a Garage ownerDL test: %s ' + garage_entity['ownerDL'])
    rGarage = _garage_from_entity(garage_entity)
    return rGarage
