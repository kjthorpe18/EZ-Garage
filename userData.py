from google.cloud import datastore
from user import User

USER_ENTITY_TYPE = 'User'

# Note - you will need to change this path. You can try setting an environment variable but it didn't work for me
# See this: https://cloud.google.com/docs/authentication/getting-started
def getClient():
    client = None
    try: # When we run 'gcloud app deploy' this will work and it will connect to the database
        client = datastore.Client()
        return client
    except: # if that doesn't work, look for the local path to the API keys for the database
        return datastore.Client.from_service_account_json('/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')

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
        key = client.key(USER_ENTITY_TYPE, str(item_id))
    else:
        # this will generate an ID
        key = client.key(USER_ENTITY_TYPE)
    return key

def load_entity(client, item_id):
    """Load a datstore entity using a particular client, and the ID."""
    key = load_key(client, item_id)
    entity = client.get(key)
    log('retrieved entity for ' + item_id)
    log(entity)
    return entity 

def convert_to_object(entity):
    user_id = entity.key.id_or_name
    return User(user_id, entity['username'], entity['pwd'], entity['dl_no'])   

def createUser(userToCreate):
    """
    Takes a User as a parameter and adds that user to the database
    """
    log('enter createUser')
    client = getClient()
    key = None
    entity = None
    if not userToCreate.uid:
        key = load_key(client) # generate a key for the entity
        userToCreate.uid = key.id_or_name
        entity = datastore.Entity(key) # create empty entity with the key from above
    else:
        key = load_key(client, userToCreate.uid)
        entity = datastore.Entity(key)
    entity['username'] = userToCreate.username
    entity['pwd'] = userToCreate.pwd
    entity['dl_no'] = userToCreate.dl_no
    client.put(entity) # add the entity to the DB
    log('Saved new user. User id: %s' % key.id_or_name)

def getUser(user_id):
    client = getClient()
    log('retrieving object for ID: %s' % user_id)
    entity = load_entity(client, user_id)
    return convert_to_object(entity)

