import flask
import json
import carData
from car import Car

app = flask.Flask(__name__)

@app.route('/')
def root():
    return redirect("/static/index.html", code=302)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)

@app.route('/add-car', methods=['POST'])
def addCar():
    make = flask.Flask.request.form['make']
    model = flask.Flask.request.form['model']
    plate_num = flask.Flask.request.form['plate_num']
    json_result = {}
    try:
        log('Creating a new Car and adding it to db')
        carData.createCar(Car(None, make, model, plate_num))
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = str(exc)
    return flask.Response(json.dumps(json_result), mimetype='application/json')

# this is for testing if it works, probably don't need
@app.route('/load-car')
def loadCarTest(plate_num):
        log('loading Car.')
        carObj = carData.load_car(plate_num)
        car = carObj.toDict()
        json_list = []
        for key in car:
            json_list.append(car[key])
        
        responseJson = json.dumps(json_list)
        return flask.Response(responseJson, mimetype='application/json')

@app.route('/add-space', methods=['POST'])
def addSpace():
    id = flask.request.form['id']
    floor = flask.request.form['floor']
    taken = flask.request.form['taken']
    json_result = {}
    try:
        log('Creating new space and adding to database')
        spaceData.createSpace(Space(None, id, floor, taken))
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = str(exc)
    return flask.Response(json.dumps(json_result), mimetype='application/json')