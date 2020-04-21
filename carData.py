#ARC

from google.cloud import datastore
from car import Car

_CAR_ENTITY = 'Car'

def log(msg):
    """Log a simple message."""

    print('CarData: %s' % msg)

def getClient():
    client = None
    try: # When we run 'gcloud app deploy' this will work and it will connect to the database
        client = datastore.Client()
        return client
    except: # if that doesn't work, look for the local path to the API keys for the database
        #return datastore.Client.from_service_account_json('/Users/kylethorpe/Desktop/service-acct-keys.json')
        return datastore.Client.from_service_account_json('/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')
        # return datastore.Client.from_service_account_json('D:\CS1520\service-acct-keys.json')

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

#insert car object
def createCar(car):
    client =getClient()
    entity = datastore.Entity(_load_key(client, _CAR_ENTITY, car.plate_num))
    entity['Owner'] = car.owner
    entity['Make'] = car.make
    entity['Model'] = car.model
    entity['Plate Number'] = car.plate_num
    client.put(entity)
    log('Saved new Car')

# Create a car from datastore entry
def _car_from_entity(car_entity):
    owner = car_entity['Owner']
    make = car_entity['Make']
    model = car_entity['Model']
    plate_num = car_entity['Plate Number']
    carVal = Car(owner, make, model, plate_num)
    return carVal

#Load value from datastore based on plate_num
def load_car(plate):
    log('Loading a Car: ' + plate)
    client = getClient()
    car_entity = _load_entity(client, _CAR_ENTITY, plate)
    log('Loaded a Car: ' + plate)
    
    rCar = _car_from_entity(car_entity)
    return rCar

def load_cars_user(userToQuery):
    log('Loading Cars for owner:' + userToQuery)
    client = getClient()
    query = client.query(kind = 'Car')
    query.add_filter('Owner', '=', userToQuery)
    returnList = []
    iterable = list(query.fetch())
    log('Iterable Contents: ' + str(len(iterable)))
    for x in iterable:
        newCar = _car_from_entity(x)
        log('New Car:' + newCar.model)
        returnList.append(newCar)
    
    return returnList