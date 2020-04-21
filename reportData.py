from google.cloud import datastore
from report import Report

_REPORT_ENTITY = 'Report'

def log(msg):
    """Log a simple message."""

    print('ReportData: %s' % msg)

def getClient():
    client = None
    try: # When we run 'gcloud app deploy' this will work and it will connect to the database
        client = datastore.Client()
        return client
    except: # if that doesn't work, look for the local path to the API keys for the database
        #return datastore.Client.from_service_account_json('/Users/kylethorpe/Desktop/service-acct-keys.json')
        return datastore.Client.from_service_account_json('/Users/matthewhrydil/Pitt/CurrentClassesLocal/CS1520/service-account-keys/service-acct-keys.json')
        # return datastore.Client.from_service_account_json('D:\CS1520\service-acct-keys.json')



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


#save Report
def createReport(report):
    log('Storing complaint %s ' + report.dateOccured)
    client = getClient()
    entity = datastore.Entity(_load_key(client, _REPORT_ENTITY))
    entity['By User'] = report.userBy
    entity['Description']  = report.description
    entity['Plate Reported'] = report.plate
    entity['Garage'] = report.garage
    entity['Space ID'] = report.space
    entity['Date Reported'] = report.dateReported                #timestamp of user submission
    entity['Date Occuring'] = report.dateOccured                 #user's date they saw the spot taken
    client.put(entity)
    log('Saved Report for stolen spot: ' + report.space + ' in Garage: ' + report.garage)

def _report_from_entity(report_entity):
    log('Creating Reprot from entity')
    user = report_entity['By User']
   # log(user)
    description = report_entity['Description']
    #log(description)
    plate= report_entity['Plate Reported']
    #log(plate)
    garage = report_entity['Garage']
    #log(garage)
    space = report_entity['Space ID']
    #log(space)
    dateReported =  report_entity['Date Reported']
    log(dateReported)
    dateOccured = report_entity['Date Occuring']
    #log(dateOccured)
    reportVal = Report(user, description, plate, garage, space, dateReported, dateOccured)
    return reportVal

#TO DO
#Load all Reports for a garage in list
#Returns: Array of Report class
def loadAllReports(garageToSearch):           
    log('Loading Reports for Garage:' + garageToSearch)
    client =getClient()
    query = client.query(kind ='Report')
    query.add_filter('Garage', '=', garageToSearch)
    returnList =[]
    iterable = list(query.fetch())
    log('Iterable Contents: ' + str(len(iterable)))
    for x in iterable:
        newReport =_report_from_entity(x)
        log('Newreport Descript: ' + newReport.description)
        returnList.append(newReport)
    return returnList
    
#TO DO
#Contact registered cars and see if Plate matches an existing vehicle registered
def loadViolater(plateTolookFor):
    return 4    


