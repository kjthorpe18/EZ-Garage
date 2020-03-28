#ARC

from google.cloud import datastore
from car import Car

_CAR_ENTITY = 'Car'

def log(msg):
    """Log a simple message."""

    print('CarData: %s' % msg)

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

#insert car object
def createCar(car):
    client =getClient()
    entity = datastore.Entity(_load_key(client, _CAR_ENTITY, car.plate_num))
    entity['make'] = car.make
    entity['model'] = car.model
    entity['plate_num'] = car.plate_num
    client.put(entity)

# Create a car from datastore entry
def _car_from_entity(car_entity):
    make = car_entity['make']
    model = car_entity['model']
    plate_num = car_entity['plate_num']
    carVal = Car(make, model, plate_num)
    return carVal

#Load value from datastore based on plate_num
def load_car(plate):
    log('Loading a Car: ' + plate)
    client = getClient()
    car_entity = _load_entity(client, _CAR_ENTITY, plate)
    log('Loaded a Car: ' + plate)
    
    rCar = _car_from_entity(car_entity)
    return rCar