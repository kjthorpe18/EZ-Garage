from google.cloud import datastore
from user import User

USER_ENTITY_TYPE = 'User'

# Note - you will need to change this path. You can try setting an environment variable but it didn't work for me
def getClient():
    # return datastore.Client()
    return datastore.Client.from_service_account_json(
        '/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')

def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('userData: %s' % msg)

def load_key(client, item_id=None):
    """Load a datastore key using a particular client, and if known, the ID.
    Note that the ID should be an int - we're allowing datastore to generate
    them in this example."""
    key = None
    if item_id:
        key = client.key(USER_ENTITY_TYPE, int(item_id))
    else:
        # this will generate an ID
        key = client.key(USER_ENTITY_TYPE)
    return key


def load_entity(client, item_id):
    """Load a datstore entity using a particular client, and the ID."""
    key = load_key(client, item_id)
    entity = client.get(key)
    log('retrieved entity for ' + item_id)
    return entity

def createUser(userToCreate):
    log('enter createUser')
    client = getClient()
    key = None
    entity = None
    if not userToCreate.id:
        key = load_key(client)
        userToCreate.id = key.id_or_name
        entity = datastore.Entity(key)
    entity['username'] = userToCreate.username
    entity['pwd'] = userToCreate.pwd
    entity['dl_no'] = userToCreate.dl_no
    client.put(entity)
    log('Saved new user. User id: %s' % userToCreate.id)
