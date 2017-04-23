from flask import Flask, request
from flask_socketio import SocketIO, emit, send
import json
import flask as f

app = Flask(__name__)

socketio = SocketIO(app)

state = None

@socketio.on('connect')
def query_state():
    print "CONNECGION"
    if state == None:
        emit('connection', {'state': 'empty'})
    elif state['pcount'] == state['capacity']:
        emit('connection', {'state': 'full'})
    else:
        emit('connection', {'state': 'waiting'})

@socketio.on("create")
def create_game(claim):
    pass

@socketio.on("join")
def join_request(claim):
    pass

@socketio.on("act")
def act(claim):
    pass

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
