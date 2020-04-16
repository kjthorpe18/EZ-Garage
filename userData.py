from google.cloud import datastore
from user import User

USER_ENTITY_TYPE = 'User'

# Note - you will need to change this path. You can try setting an environment variable but it didn't work for me
# See this: https://cloud.google.com/docs/authentication/getting-started
def get_client():
    client = None
    try: # When we run 'gcloud app deploy' this will work and it will connect to the database
        client = datastore.Client()
        return client
    except: # if that doesn't work, look for the local path to the API keys for the database
        # return datastore.Client.from_service_account_json('/Users/kylethorpe/Desktop/service-acct-keys.json')
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
    return User(user_id, entity['username'], entity['phone'], entity['dl_no'])   

def create_user(user_to_create):
    """
    Takes a User as a parameter and adds that user to the database
    """
    log('enter create_user')
    client = get_client()
    key = None
    entity = None
    if not user_to_create.uid:
        key = load_key(client) # generate a key for the entity
        user_to_create.uid = key.id_or_name
        entity = datastore.Entity(key) # create empty entity with the key from above
    else:
        key = load_key(client, user_to_create.uid)
        entity = datastore.Entity(key)
    entity['username'] = user_to_create.username
    entity['phone'] = user_to_create.phone
    entity['dl_no'] = user_to_create.dl_no
    client.put(entity) # add the entity to the DB
    log('Saved new user. User id: %s' % key.id_or_name)

def get_user(user_id):
    client = get_client()
    log('retrieving object for ID: %s' % user_id)
    entity = load_entity(client, user_id)
    if not entity:
        return None
    else:
        return convert_to_object(entity)
