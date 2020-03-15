from Flask import Flask, Response, redirect
import garage
import garageData
import json

app = Flask(__name__)

def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)

@app.route('/')
def root():
    return redirect("/static/index.html", code=302)

@app.route('/add-garage', methods=['POST'])
def addGarage():
    garageName = Flask.request.form['name']
    floorCount = Flask.request.form['count']
    spaces = Flask.request.form['spaces']            #Should be a string array w/ Number and then letters: 1AA 3BC etc. Let's see what happens as is
    address = Flask.request.form['address']
    phone = Flask.request.form['phone']
    ownerDL = Flask.request.form['ownerDL']
    json_result = {}
    try:
        log('Creating a new Garage and adding it to db')
        garageData.createGarage(garage.Garage(None,garageName, floorCount, spaces, address, phone, ownerDL))
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = str(exc)
    return Flask.Response(json.dumps(json_result), mimetype='application/json')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

@app.route('/load-garage/<gName>')
def loadGarageTest(gName):
        log('loading Garage.')
        garageObj = garageData.load_garage(gName)
        g = garageObj.toDict()
        json_list = []
        for key in g:
            json_list.append(g[key])
        
        responseJson = json.dumps(json_list)
        return Flask.Response(responseJson, mimetype='application/json')
