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
    garageName = flask.Flask.request.form['name']
    floorCount = flask.Flask.request.form['count']
    spaces = flask.Flask.request.form['spaces']            #Should be a string array w/ Number and then letters: 1AA 3BC etc. Let's see what happens as is
    address = flask.Flask.request.form['address']
    phone = flask.Flask.request.form['phone']
    ownerDL = flask.Flask.request.form['ownerDL']
    json_result = {}
    try:
        log('Creating a new Garage and adding it to db')
        garageData.createGarage(Garage(garageName, floorCount, spaces, address, phone, ownerDL))
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = str(exc)
    return flask.Response(json.dumps(json_result), mimetype='application/json')

@app.route('/load-garage/<gName>')
def loadGarageTest(gName):
        log('loading Garage.')
        garageObj = garageData.load_garage(gName)
        g = garageObj.toDict()
        json_list = []
        for key in g:
            json_list.append(g[key])
        
        responseJson = json.dumps(json_list)
        return flask.Response(responseJson, mimetype='application/json')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
