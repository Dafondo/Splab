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
def create_game(data):
    global state
    state = {}
    state['capacity'] = data['capacity']
    state['size'] = data['size']
    if state['size'] == 'small': # TODO init sizes and shit
        pass
    state['players'] = []
    state['players'].append((data['uname'], 0))

    emit('created', data)

@socketio.on("join")
def join_request(data):
    global state
    if len(state['players']) == state['capacity']: # room's full
        return
    joined_user = (data['uname'], len(state['players']))
    state['players'].append(joined_user)

    emit('join', {'uname': joined_user[0], 'id': joined_user[1]},
            broadcast=True)
    emit('joined', {'capacity': state['capacity'],
                    'size': state['size'],
                    'current_users': state['players']})

@socketio.on("act")
def act(data):
    pass

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
