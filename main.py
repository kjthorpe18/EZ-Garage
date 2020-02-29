from flask import Flask, Response, redirect

import flask
import json
import userData

from user import User

app = Flask(__name__)

def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)

@app.route('/')
def root():
    return redirect("/static/index.html", code=302)

@app.route('/add-user', methods=['POST'])
def addUser():
    username = flask.request.form['username']
    pwd = flask.request.form['pwd']
    dl_no = flask.request.form['dl_no']
    json_result = {}
    try:
        log('Creating new user and adding to database')
        userData.createUser(User(None, username, pwd, dl_no))
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = str(exc)
    return flask.Response(json.dumps(json_result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

