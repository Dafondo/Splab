from flask import Flask, request
from flask_socketio import SocketIO, emit, send
import pprint
import json
import flask as f
import random as r

app = Flask(__name__)

socketio = SocketIO(app)

small_world_size = 500
medium_world_size = 1000
large_world_size = 1500

small_npc_count = 50
medium_npc_count = 100
large_npc_count = 150

shirt_types = 9
hair_types = 1
hair_colors = 19
glasses = 1

def gen_random_appearance():
    return {'shirt': r.randint(0, shirt_types),
            'hair': r.randint(0, hair_types),
            'hair_color': r.randint(0, hair_types),
            'glasses': r.randint(0, glasses)}

def gen_npc():
    return {'alive': True,
            'facing': bool(r.getrandbits(1)),
            'running': False,
            'appearance': gen_random_appearance()}


def gen_player(username, id):
    return {'username': username,
            'id': id,
            'alive': True,
            'facing': bool(r.getrandbits(1)),
            'running': False,
            'disguise': gen_random_appearance(),
            'disguised': True,
            'can_trans': True}

# person = {'alive': boolean,
#           'facing': boolean,
#           'running': boolean,
#           'appearance': dict}
# id is the index in the list

state = None

def debug(debug_str):
    if app.debug:
        print "DEBUG -- " + debug_str

@socketio.on('connect')
def query_state():
    debug("CONNECTION")
    if state == None:
        emit('connection', {'state': 'empty'})
    elif len(state['players']) == state['capacity']:
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
        state['world_size'] = small_world_size
        state['npc_alive'] = small_npc_count
    elif state['size'] == 'medium':
        state['world_size'] = medium_world_size
        state['npc_alive'] = medium_npc_count
    else:
        state['world_size'] = large_world_size
        state['npc_alive'] = large_npc_count

    state['npcs'] = []
    state['npcs_init'] = []
    for i in xrange(state['npc_alive']):

        # NPC schema
        state['npcs'].append(gen_npc())

        state['npcs_init'].append(r.randint(0, state['world_size']))

    state['players'] = []

    # Player schema
    state['players'].append(gen_player(data['uname'], 0))
    state['players_init'].append(r.randint(0, state['world_size']))

    emit('created', data)
    debug("CREATED -- " + json.dumps(data))

    if len(state['players']) == state['capacity']:
        debug("GAME IS READY TO START")
        emit('start', state, broadcast=True) # game starts

@socketio.on("join")
def join_request(data):
    global state
    if len(state['players']) == state['capacity']: # room's full
        return
    joined_user = (data, len(state['players']))
    state['players'].append(gen_player(data, len(state['players'])))
    state['players_init'].append(r.randint(0, state['world_size']))

    emit('join', {'uname': joined_user[0], 'id': joined_user[1]},
            broadcast=True)
    emit('joined', {'capacity': state['capacity'],
                    'size': state['size'],
                    'current_users': state['players']})

    debug("PLAYER" + str(joined_user) + "JOINED")
    debug("CURRENT STATE: " + pprint.pformat(state, width=1))

    if len(state['players']) == state['capacity']:
        debug("GAME IS READY TO START")
        emit('start', state, broadcast=True) # game starts

@socketio.on("act")
def act(data):
    pass

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)