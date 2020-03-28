from garage import Garage
import garageData
import flask
import json
app = flask.Flask(__name__)

def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)

@app.route('/')
def root():
    return flask.redirect("/static/index.html", code=302)

@app.route('/add-garage', methods=['POST'])
def addGarage():
    log('Called addGarage')
    garageName = flask.request.form['name']
    log(garageName)
    floorCount = flask.request.form['floorCount']
    log(floorCount)
    spaces = flask.request.form['spaces']            #Should be a string array w/ Number and then letters: 1AA 3BC etc. Let's see what happens as is
    log(spaces)
    address = flask.request.form['address']
    log(address)
    phone = flask.request.form['phone']
    log(phone)
    ownerDL = flask.request.form['ownerDL']
    log(ownerDL)
    log('About to create JSON')
    json_result = {}
    log('About to try')
    
    try:
        log('In try')
        garageData.createGarage(Garage(phone, garageName, floorCount, spaces, address, phone, ownerDL)) #First argument is gID, will use as key somehow, passing phone for now
        log('finished create garage')
        json_result['ok'] = True
        log('after json result')
    except Exception as exc:
        log('EXCEPTION')
        log(str(exc))
        json_result['error'] = str(exc)
    return flask.Response(json.dumps(json_result), mimetype='application/json')

@app.route('/load-garage/<gPhone>')
def loadGarageTest(gPhone):
        log('loading Garage.' + gName)
        garageObj = garageData.load_garage(gName)
        g = garageObj.toDict()
        json_list = []
        for key in g:
            json_list.append(g[key])
        
        responseJson = json.dumps(json_list)
        return flask.Response(responseJson, mimetype='application/json')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
