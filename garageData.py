#ARC

from google.cloud import datastore
from garage import Garage

_GARAGE_ENTITY = 'Garage'

def log(msg):
    """Log a simple message."""

    print('GarageData: %s' % msg)

def getClient():
     return datastore.Client('PROJECTID')


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
def _load_entity(client, entity_type, entity_id, parent_key=None):
    """Load a datstore entity using a particular client, and the ID."""

    key = _load_key(client, entity_type, entity_id, parent_key)
    entity = client.get(key)
    log('retrieved entity for ' + str(entity_id))
    return entity

#insert garage object
def createGarage(garage):
    client =getClient()
    entity = datastore.Entity(_load_key(client, _GARAGE_ENTITY, garage.name))
    entity['name'] = garage.name
    entity['floorCount'] = garage.floorCount
    entity['spaces'] = garage.spaces
    entity['address'] = garage.address
    entity['phone'] = garage.phone
    entity['ownerDL'] = garage.ownerDL
    client.put(entity)
