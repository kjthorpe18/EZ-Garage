from flask import Flask, Response, redirect

import flask
import json
import userData
from google.oauth2 import id_token
from google.auth.transport import requests

from user import User

SIGN_IN_CLIENT_ID = '552110144556-qef3jf1sukp03o4khvjtcsu8kvs108tr.apps.googleusercontent.com'

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
    user_token = flask.request.form['user_token']
    username = flask.request.form['username']
    pwd = flask.request.form['pwd']
    dl_no = flask.request.form['dl_no']
    json_result = {}
    try:
        log('Creating new user and adding to database')
        user_id = validate_user(user_token)
        userData.create_user(User(uid=user_id, username=username, pwd=pwd, dl_no=dl_no))
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
        user = userData.get_user(user_id)
        u = user.to_dict()
    return flask.Response(json.dumps(u), mimetype='application/json')

@app.route('/user-login', methods=['POST'])
def login_user():
    user_token = flask.request.form['user_token']


# takes the token_id given by google and returns the user id for that token
# if the token is valid
def validate_user(user_token):
    log('validating user')
    try:
        idinfo = id_token.verify_oauth2_token(user_token, requests.Request(), SIGN_IN_CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        user_id = idinfo['sub']
        return user_id
    except ValueError:
        # Invalid token
        pass

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

