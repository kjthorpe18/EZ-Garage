from flask import Flask, Response, redirect

import flask
import json
import userData

from user import User

app = Flask(__name__)
app.secret_key = b'@U\xb0\xadf\x92f\xe8\x10\xee\xdf\x81O\x92\xb7\xe5\xca\x10rE&=\xd0\x7f'
# secret key is needed for flask sessions

def log(msg):
    """Log a simple message."""
    # Look at: https://console.cloud.google.com/logs to see your logs.
    # Make sure you have "stdout" selected.
    print('main: %s' % msg)

@app.route('/')
def root():
    return redirect("/static/index.html", code=302)

@app.route('/add-user', methods=['POST'])
def add_user():
    user_id = flask.request.form['user_id']
    username = flask.request.form['username']
    pwd = flask.request.form['pwd']
    dl_no = flask.request.form['dl_no']
    json_result = {}
    try:
        log('Creating new user and adding to database')
        userData.createUser(User(uid=user_id, username=username, pwd=pwd, dl_no=dl_no))
        flask.session['user_id'] = user_id # store the user_id into the flask session so that we can access it on different pages
        json_result['ok'] = True
    except Exception as exc:
        log(str(exc))
        json_result['error'] = str(exc)
    return flask.Response(json.dumps(json_result), mimetype='application/json')

@app.route('/get-user', methods=['POST'])
def get_user():
    user_id = flask.session['user_id']
    if user_id:
        user = userData.getUser(user_id)
        u = user.to_dict()
        u['user_id'] = user_id
    return flask.Response(json.dumps(u), mimetype='application/json')



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

