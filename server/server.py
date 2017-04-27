from flask import Flask
from flask_socketio import SocketIO, emit, send
import pprint
import json
import flask as f
import random as r

app = Flask(__name__)
socketio = SocketIO(app, engineio_logger=True, ping_timeout=1000)

small_world_size = 512
medium_world_size = 1024
large_world_size = 1536

small_npc_count = 5
medium_npc_count = 10
large_npc_count = 20

shirt_types = 9
hair_types = 1
hair_colors = 19
skin_colors = 4

def gen_random_appearance():
    return {'shirt': r.randint(0, shirt_types),
            'hair': r.randint(0, hair_types),
            'hair_color': r.randint(0, hair_colors),
            'skin_color': r.randint(0, skin_colors)}

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
        print("DEBUG -- " + debug_str)

@socketio.on('connect')
def query_state():
    global state
    debug("CONNECTION")
    if state == None:
        emit('connection', {'state': 'empty'})
    elif len(state['players']) == state['capacity']:
        # state = None
        emit('connection', {'state': 'full'})
    else:
        emit('connection', {'state': 'waiting'})

@socketio.on("create")
def create_game(data):
    global state
    state = {}
    state['capacity'] = data['capacity']
    state['size'] = data['size']

    if state['size'] == 'small':
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
        state['npcs'].append(gen_npc())
        state['npcs_init'].append(r.randint(0, state['world_size']))

    state['players'] = []
    state['players_init'] = []

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

@socketio.on("change_state")
def change_state(data): # we actually just broadcast
    emit('action', data, broadcast=True)

@socketio.on("finished")
def game_finished():
    global state
    state = None

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
