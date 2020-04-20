from google.cloud import datastore
from checkin import Checkin

CHECKIN_ENTITY_TYPE = 'Checkin'

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
    print('checkinData: %s' % msg)

def load_key(client, item_id=None):
    """Load a datastore key using a particular client, and if known, the ID.
    Note that the ID should be an int - we're allowing datastore to generate
    them in this example."""
    key = None
    if item_id:
        key = client.key(CHECKIN_ENTITY_TYPE, str(item_id))
    else:
        # this will generate an ID
        key = client.key(CHECKIN_ENTITY_TYPE)
    return key

def load_entity(client, item_id):
    """Load a datstore entity using a particular client, and the ID."""
    key = load_key(client, item_id)
    entity = client.get(key)
    log('retrieved entity for ' + item_id)
    log(entity)
    return entity 

def convert_to_object(entity):
    checkin_id = entity.key.id_or_name
    return Checkin(entity['user_id'], entity['date'], entity['time_in'], entity['time_out'], entity['space_id'], entity['garage_id'])

def add_checkin(checkin_to_create):
    """
    Takes a Checkin object as a parameter and adds that checkin to the DB
    """
    log('enter add_checkin')
    client = get_client()
    key = None
    entity = None
    if not checkin_to_create.checkin_id:
        log('enter if')
        key = load_key(client)
        checkin_id = key.id_or_name
        entity = datastore.Entity(key)
    else:
        key = load_key(client, checkin.checkin_id)
        entity = datastore.Entity(key)
    log('end if else')
    entity['user_id'] = checkin_to_create.user_id
    entity['time_in'] = checkin_to_create.time_in
    entity['time_out'] = checkin_to_create.time_out
    entity['space_id'] = checkin_to_create.space_id
    entity['garage_id'] = checkin_to_create.garage_id
    client.put(entity)
    log('Added checkin to database.')


def load_all_checkins(spot_id):
    client = get_client()
    query = client.query(kind='Checkin')
    query.add_filter('space_id', '=', spot_id)
    checkins = list(query.fetch())
    log(checkins)
    return checkins


# def get_user(user_id):
#     client = get_client()
#     log('retrieving object for ID: %s' % user_id)
#     entity = load_entity(client, user_id)
#     if not entity:
#         return None
#     else:
#         return convert_to_object(entity)
