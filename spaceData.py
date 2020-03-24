#ARC

from google.cloud import datastore
from space import Space

_SPACE_ENTITY = 'Space'

def log(msg):
    """Log a simple message."""

    print('SpaceData: %s' % msg)

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


def _load_entity(client, entity_type, entity_id, parent_key=None):
    """Load a datstore entity using a particular client, and the ID."""

    key = _load_key(client, entity_type, entity_id, parent_key)
    entity = client.get(key)
    log('retrieved entity for ' + str(entity_id))
    return entity

#insert space object
def createSpace(space):
    client =getClient()
    entity = datastore.Entity(_load_key(client, _SPACE_ENTITY, space.space_id))
    entity['space_id'] = space.space_id
    entity['num'] = space.num
    entity['floor'] = space.floor
    entity['garage'] = space.garage
    entity['taken'] = space.taken
    client.put(entity)

# Create a space from datastore entry
def _space_from_entity(space_entity):
    space_id = space_entity['space_id']
    num = space_entity['num']
    floor = space_entity['floor']
    garage = space_entity['garage']
    taken = space_entity['taken']
    spaceVal = Space(space_id, num, floor, garage, taken)
    return spaceVal

#Load value from datastore based on id
def load_space(space_id):
    log('Loading a Space: ' + space_id)
    client = getClient()
    space_entity = _load_entity(client, _SPACE_ENTITY, space_id)
    log('Loaded a Space: ' + space_id)
    
    rSpace = _space_from_entity(space_entity)
    return rSpace