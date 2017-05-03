var Splab = Splab || {};

// Controls
var cursors;
var key_jump;
var transform;
var key_run;

var speed = 1;

var isChicken = false;

// This MFing map
var map = [];
var mapNumTiles = 4;
var mapLength = 2048;
var visibleMap;

// BG sprites
var stars;
var background;

// Player sprites
var playerGroup;
var player;
var platforms;
var face;
var guyhair;
var girlhair;

// Sounds
var bawk;

// Animations
var cloudEmitter;
var sciwalk;
var cwalk;
var faceBounce;
var guyhairBounce;
var girlhairBounce;
var shirtBounce;
var sciFPS = 12;
var cFPS = 24;
var starSpeed = -10;
var bgSpeed = -80;

// Timers
var transformTime = 5;
var lastTransform = 0;
var cooldown = 2000;
var chickenBar;
var chickenBarIndex;
var chickenTimerLoop;

// NPC lets
var npcGroup;
var viewWindowSize = 512;
var myPos;
var worldSize;
var npcLocs = []
var npcProperties = []
var playerLocs = []
var playerInfo = []
var myInfo;
var npcs = []
var otherPlayers = []

// NPC anim lets
var currentFrame = 0;
var nextFrameTime = 0;
var msPF = 1000/12;

var shirtColors = ['0xFF0000', '0x00FFFF', '0x0000FF', '0x008000', '0xFFA500',
    '0x808080', '0x000000', '0x800000', '0x0000A0', '0xFFFF00']

var hairColors = ['0x090806', '0x2C222B', '0x71635A', '0xB7A69E', '0xD6C4C2',
    '0xCABFB1', '0xDCD0BA', '0x6A4E42', '0xE6CEA8', '0xE5C8A8',
    '0xDEBC99', '0xB89778', '0xA56B46', '0xB55239', '0x8D4A43',
    '0x91553D', '0xA7856A', '0x3B3024', '0x554838', '0x4E433F']

var faceColors = ['0x8d5524', '0xc68642', '0xe0ac69', '0xf1c27d', '0xffdbac']

var walkSpeed = 1;
var runSpeed = 1;

var MAX_INT_UND = 1000000009

// action code for comm
let SWITCH_FACING = 0;
let TRANSFORM_TO_CHICKEN = 1;
let TRANSFORM_BACK = 2;

var sendToServer = function(act, data) {
    Splab.game.global.socket.emit("change_state", {"id": myInfo.id, "act": act, "data": data});
};

Splab.MainGame = function(){};

Splab.MainGame.prototype = {
    init: function() {
        npcLocs = Splab.game.global.state.npcs_init;
        npcProperties = Splab.game.global.state.npcs;

        for (let i = 0 ; i < Splab.game.global.state.players.length ; i++) {
            if (Splab.game.global.state.players[i].id == Splab.game.global.myID) {
                myInfo = Splab.game.global.state.players[i];
                myPos = Splab.game.global.state.players_init[i];
            }
            else { // other players info stored separately
                playerInfo.push(Splab.game.global.state.players[i]);
                playerLocs.push(Splab.game.global.state.players_init[i]);
            }
        }

        worldSize = Splab.game.global.state.world_size;

        if(Splab.game.global.size === 'small') mapLength = 2048;
        else if(Splab.game.global.size === 'medium') mapLength = 3072;
        else if(Splab.game.global.size === 'large') mapLength = 4096;
        mapNumTiles = mapLength / 512;

        if (!myInfo.facing) {
            bgSpeed = -1 * bgSpeed;
        }

        // socket communication informations
        Splab.game.global.socket.on('action', function(data) {
            // other players actions
            let id = data.id;
            let act = data.act;
            let target = data.data;

            switch (act) {
                case SWITCH_FACING:
                    if (id != myInfo.id) {
                        if (id > myInfo.id) id--;
                        playerInfo[id].facing = target;
                    }
                    else {
                        myInfo.facing = target;
                        if (myInfo.facing) {
                            if(starSpeed > 0) starSpeed *= -1;
                            if(bgSpeed > 0) bgSpeed *= -1;
                            stars.autoScroll(starSpeed, 0);

                            player.scale.x = 4;

                        }
                        else {
                            if(starSpeed < 0) starSpeed *= -1;
                            if(bgSpeed < 0)	bgSpeed *= -1;
                            stars.autoScroll(starSpeed, 0);

                            player.scale.x = -4;
                        }
                    }
                    break;

                case TRANSFORM_TO_CHICKEN:
                    bawk.play();

                    if (id != myInfo.id) {
                        if (id > myInfo.id) id--;
                        playerInfo[id].disguised = false; // easy part
                    }
                    else { // I turn to chicken!!!
                        playerface.alpha = 0;
                        playerguyhair.alpha = 0;
                        playergirlhair.alpha = 0;
                        playershirt.alpha = 0;
                        chickenBar.alpha = 1;

                        // Play chicken animation, stops others
                        //player.animations.play('cwalk', cFPS, true);
                        //playerface.animations.stop();
                        //playerguyhair.animations.stop();
                        //playergirlhair.animations.stop();
                        //playershirt.animations.stop();

                        Splab.game.time.events.add(Phaser.Timer.SECOND * transformTime, Splab.MainGame.prototype.transformBack, Splab.MainGame.prototype);
                        chickenBarIndex = transformTime - 1;
                        chickenTimerLoop = Splab.game.time.events.loop(Phaser.Timer.SECOND, Splab.MainGame.prototype.decreaseChickenBar, Splab.MainGame.prototype);
                        lastTransform = Splab.game.time.now + transformTime * 1000;
                    }
                    break;

                case TRANSFORM_BACK:
                    isChicken = false;
                    if (id != myInfo.id) {
                        if (id > myInfo.id) id--;
                        playerInfo[id].disguised = true;
                    }
                    else {
                        chickenBar.alpha = 0;
                        for(let i = 0; i < chickenBar.children.length; i++) chickenBar.children[i].alpha = 1;

                        // Change sprite colors
                        playerface.tint = faceColors[myInfo.appearance.skin_color];
                        playerguyhair.tint = hairColors[myInfo.appearance.hair_color];
                        playergirlhair.tint = hairColors[myInfo.appearance.hair_color];
                        playershirt.tint = shirtColors[myInfo.appearance.shirt];

                        // Make scientist sprite visible
                        playerface.alpha = 1;
                        if (myInfo.appearance.hair == 0)
                            playerguyhair.alpha = 1;
                        else
                            playergirlhair.alpha = 1;
                        playershirt.alpha = 1;

                        // Play scientist animations
                        //playerface.animations.play('bounce', sciFPS, true);
                        //playerguyhair.animations.play('bounce', sciFPS, true);
                        //playergirlhair.animations.play('bounce', sciFPS, true);
                        //playershirt.animations.play('bounce', sciFPS, true);
                        //player.animations.play('sciwalk', sciFPS, true);
                    }

                    break;
            };
        });
    },

    preload: function() {
        Splab.game.stage.disableVisibilityChange=true;
    },
    startRun: function() {
        sciFPS *= 2;
        cFPS *= 2;
        starSpeed *= 1.5;
        bgSpeed *= 2;
        stars.autoScroll(starSpeed, 0);
        //sciwalk.speed *= 2;
        //cwalk.speed *= 2;
        //faceBounce.speed *= 2;
        //guyhairBounce.speed *= 2;
        //girlhairBounce.speed *= 2;
        //shirtBounce.speed *= 2;
    },
    endRun: function() {
        sciFPS /= 2;
        cFPS /= 2;
        starSpeed /= 1.5;
        bgSpeed /= 2;
        stars.autoScroll(starSpeed, 0);
        //sciwalk.speed /= 2;
        //cwalk.speed /= 2;
        //faceBounce.speed /= 2;
        //guyhairBounce.speed /= 2;
        //girlhairBounce.speed /= 2;
        //shirtBounce.speed /= 2;
    },
    create: function() {
        this.stage.backgroundColor = '0xffffff';
        // Star backdrop
        stars = this.add.tileSprite(0, 0, mapLength, this.game.height, 'background');
        stars.autoScroll(starSpeed, 0);

        // Initialize lab background tiles
        for(let i = 0; i < mapNumTiles; i++) {
            if(i%2==0) b = this.add.sprite(0, this.game.world.centerY, 'splab1');
            else {
                b = this.add.sprite(0, this.game.world.centerY, 'splab2ss');
                b.animations.add('splab2anim');
                b.animations.play('splab2anim', sciFPS, true);
            }
            b.smoothed = false;
            b.scale.setTo(4);
            b.anchor.set(0, 0.5);
            b.alpha = 0;
            this.physics.enable(b);
            map.push(b);
        }

        this.world.setBounds(0, 0, 2048, 512);

        // Enable physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        playerGroup = this.add.group();
        npcGroup = this.add.group();
        // Create player body
        player = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 74, 'allwalk');
        player.anchor.set(0.5, 0.5);
        player.smoothed = false;
        player.scale.setTo(4);

        if (!myInfo.facing) {
            player.scale.x = -4;
        }

        this.game.physics.arcade.enable(player);
        playerGroup.add(player);

        // Create player components
        playerface = this.make.sprite(0, 0, 'sciface');
        playerface.anchor.set(0.5, 0.5);
        playerface.smoothed = false;
        playerface.tint = choose(faceColors);
        player.addChild(playerface);

        playerguyhair = this.make.sprite(0, 0, 'guyhair');
        playerguyhair.anchor.set(0.5, 0.5);
        playerguyhair.smoothed = false;
        playerguyhair.tint = choose(hairColors);
        player.addChild(playerguyhair);

        playergirlhair = this.make.sprite(0, 0, 'girlhair');
        playergirlhair.anchor.set(0.5, 0.5);
        playergirlhair.smoothed = false;
        playergirlhair.tint = choose(hairColors);
        player.addChild(playergirlhair);

        playershirt = this.make.sprite(0, 0, 'scishirt');
        playershirt.anchor.set(0.5, 0.5);
        playershirt.smoothed = false;
        playershirt.tint = choose(shirtColors);
        player.addChild(playershirt);

        // Choose guy or girl
        if(Math.floor(Math.random() * 2) == 0) playergirlhair.alpha = 0;
        else playerguyhair.alpha = 0;

        // Place correct map tiles
        let index = player.x / 512;
        let modLoc = player.x % 512;
        let xLoc = player.x + modLoc;

        let leftIndex = (((index - 1) % mapNumTiles) + mapNumTiles) % mapNumTiles;
        // let LLIndex = (((leftIndex - 1) % mapNumTiles) + mapNumTiles) % mapNumTiles;
        let rightIndex = (index + 1) % mapNumTiles;
        // let RRIndex = (rightIndex + 1) % mapNumTiles;

        map[index].x = xLoc;
        map[leftIndex].x = xLoc - 512;
        // map[LLIndex].x = xLoc - 1024;
        map[rightIndex].x = xLoc + 512;
        // map[RRIndex].x = xLoc + 1024;

        map[index].alpha = 1;
        map[leftIndex].alpha = 1;
        // map[LLIndex].alpha = 1;
        map[rightIndex].alpha = 1;
        // map[RRIndex].alpha = 1;

        visibleMap = this.add.sprite(0, 0, 'c');
        visibleMap.alpha = 1;
        this.physics.enable(visibleMap);
        visibleMap.addChild(map[leftIndex]);
        visibleMap.addChild(map[index]);
        visibleMap.addChild(map[rightIndex]);
        visibleMap.children[0].world.x = xLoc - 512;
        visibleMap.children[1].world.x = xLoc;
        visibleMap.children[2].world.x = xLoc + 512;

        // Create animations
        //sciwalk = player.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
        //cwalk = player.animations.add('cwalk', [8, 9, 10, 11, 12, 13, 14, 15]);
        //faceBounce = playerface.animations.add('bounce');
        //guyhairBounce = playerguyhair.animations.add('bounce');
        //girlhairBounce = playergirlhair.animations.add('bounce');
        //shirtBounce = playershirt.animations.add('bounce');

        // Play animations
        //player.animations.play('sciwalk', sciFPS, true);
        //playerface.animations.play('bounce', sciFPS, true);
        //playerguyhair.animations.play('bounce', sciFPS, true);
        //playergirlhair.animations.play('bounce', sciFPS, true);
        //playershirt.animations.play('bounce', sciFPS, true);

        // Player physics
        player.body.bounce.y = 0;
        player.body.gravity.y = 0;
        player.body.collideWorldBounds = true;

        // Create platforms that the player can walk on
        platforms = this.game.add.group();
        platforms.enableBody = true;
        ground = [platforms.create(0, this.game.world.height - 10, 'splabfloor'), platforms.create(512, this.game.world.height - 10, 'splabfloor'), platforms.create(1024, this.game.world.height - 10, 'splabfloor'), platforms.create(1536, this.game.world.height - 10, 'splabfloor')];
        ground.forEach((tile) => tile.scale.setTo(4));
        ground.forEach((tile) => tile.body.immovable = true);

        // Chicken mode duration bar
        chickenBar = this.add.group();
        for (let i = 0; i < transformTime; i++) {
            chickenBar.create(i*24 - player.width/2, player.height/2 * -1, 'c');
        };
        chickenBar.alpha = 0;
        chickenBar.scale.set(0.25);

        player.addChild(chickenBar);

        // Create cursor keys
        cursors = this.game.input.keyboard.createCursorKeys();
        key_jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        transform = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
        key_run = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        key_run.onDown.add(this.startRun, this);
        key_run.onUp.add(this.endRun, this);

        // Bawk sound
        bawk = this.add.audio('bawk');
        //bawk.loop = true;

        // Background music
        Splab.game.global.music = this.add.audio('music');
        Splab.game.global.music.loop = true;
        Splab.game.global.music.play();

        // Render player above backgroud
        this.world.bringToTop(chickenBar);
        this.world.bringToTop(playerGroup);

        this.camera.follow(player);
    },
    transformBack: function() {
        sendToServer(TRANSFORM_BACK, null);
        // Disappear chicken bar and refill it
    },
    decreaseChickenBar() {
        // Makes last visible chicken in chicken bar invis
        chickenBar.children[chickenBarIndex].alpha = 0;
        if(chickenBarIndex-- === 0) Splab.game.time.events.remove(chickenTimerLoop);
    },
    update: function() {
        // Animation frame for npcs
        if(this.time.now > nextFrameTime) {
            currentFrame = (currentFrame + 1) % 8;
            nextFrameTime = this.time.now + msPF;
        }

        // Move lab bg tiles
        visibleMap.body.velocity.x = bgSpeed;

        // Moves and create new bg tiles when needed
        let midIndex = Math.floor(visibleMap.children.length / 2);
        if(bgSpeed < 0 && visibleMap.children[midIndex].world.x - player.x <= -256) {
            let mapIndex = map.indexOf(visibleMap.children[midIndex]);
            let pos = visibleMap.children[midIndex].x;
            let insertIndex = (mapIndex + 2) % mapNumTiles;
            visibleMap.children.shift().alpha = 0;
            visibleMap.addChild(map[insertIndex]);
            visibleMap.children[2].x = pos + 1024;
            visibleMap.children[2].alpha = 1;
        }
        else if (bgSpeed > 0 && visibleMap.children[midIndex].world.x - player.x >= -256) {
            let mapIndex = map.indexOf(visibleMap.children[midIndex]);
            let pos = visibleMap.children[midIndex].x;
            let insertIndex = (((mapIndex - 2) % mapNumTiles) + mapNumTiles) % mapNumTiles;
            visibleMap.children.pop().alpha = 0;
            visibleMap.addChildAt(map[insertIndex], 0);
            visibleMap.children[0].x = pos - 1024;
            visibleMap.children[0].alpha = 1;
        }
        // Moves bg tile parent sprite back to 0 if it moves to far away
        if(visibleMap.world.x < -2048) {
            x1 = visibleMap.children[0].x;
            x2 = visibleMap.children[1].x;
            x3 = visibleMap.children[2].x;
            visibleMap.world.x = 0;
            visibleMap.x = 0;
            visibleMap.children[0].x = x1 - 2048;
            visibleMap.children[1].x = x2 - 2048;
            visibleMap.children[2].x = x3 - 2048;
        }
        else if(visibleMap.world.x > 2048) {
            x1 = visibleMap.children[0].x;
            x2 = visibleMap.children[1].x;
            x3 = visibleMap.children[2].x;
            visibleMap.world.x = 0;
            visibleMap.x = 0;
            visibleMap.children[0].x = x1 + 2048;
            visibleMap.children[1].x = x2 + 2048;
            visibleMap.children[2].x = x3 + 2048;
        }

        npcs.map(function(n) {n.kill()});
        otherPlayers.map(function(n) {n.kill()});
        // draw all npcs / other players
        let relativeNPCLocs = npcLocs.map(function(l) {
            if (myPos >= 256 && myPos <= worldSize - 256) { // normal case
                if (Math.abs(l - myPos) <= 256) {
                    return l - myPos;
                }
                else {
                    return MAX_INT_UND;
                }
            }
            else if (myPos < 256) {
                if (l >= worldSize - (256 - myPos)) {
                    // guaranteed to be in frame
                    return -1 * (myPos + worldSize - l);
                }
                else if (Math.abs(l - myPos) <= 256) {
                    return l - myPos;
                }
                else {
                    return MAX_INT_UND;
                }
            }
            else if (myPos > worldSize - 256) {
                if (l <= 256 - (worldSize - myPos)) {
                    return l + worldSize - myPos;
                }
                else if (Math.abs(l - myPos) <= 256) {
                    return l - myPos;
                }
                else {
                    return MAX_INT_UND;
                }
            }
            // should be exhaustive
        });

        for (let i = 0 ; i < npcLocs.length ; i++) {
            if (relativeNPCLocs[i] != MAX_INT_UND) {
                // we render this npc
                let adjustedLoc = relativeNPCLocs[i];
                if (adjustedLoc >= 256) {
                    adjustedLoc = -1 * (512 - adjustedLoc);
                }
                //console.log(adjustedLoc);
                let npc = npcGroup.getFirstDead(false, this.game.world.centerX + adjustedLoc, this.game.world.height - 74, 'allwalk', currentFrame);
                if(npc != null) {
                    npc.children[0].tint = faceColors[npcProperties[i].appearance.skin_color];
                    npc.children[1].tint = hairColors[npcProperties[i].appearance.hair_color];
                    npc.children[2].tint = shirtColors[npcProperties[i].appearance.shirt];
                    if (npcProperties[i].facing) {
                        npc.scale.setTo(4);
                    }
                    else {
                        npc.scale.setTo(4);
                        npc.scale.x = -4;
                    }
                    npc.children[0].frame = currentFrame;
                    npc.children[1].frame = currentFrame;
                    npc.children[2].frame = currentFrame;
                }
                else {
                    let npc = this.game.add.sprite(this.game.world.centerX + adjustedLoc, this.game.world.height - 74, 'allwalk');
                    npc.anchor.set(0.5, 0.5);
                    npc.smoothed = false;
                    if (npcProperties[i].facing) {
                        npc.scale.setTo(4);
                    }
                    else {
                        npc.scale.setTo(4);
                        npc.scale.x = -4;
                    }

                    npc.frame = currentFrame;

                    let face = this.make.sprite(0, 0, 'sciface');
                    face.anchor.set(0.5, 0.5);
                    face.smoothed = false;
                    face.tint = faceColors[npcProperties[i].appearance.skin_color];
                    face.frame = currentFrame;
                    npc.addChild(face);


                    if (npcProperties[i].appearance.hair == 0) {
                        let guyhair = this.make.sprite(0, 0, 'guyhair');
                        guyhair.anchor.set(0.5, 0.5);
                        guyhair.smoothed = false;
                        guyhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                        npc.addChild(guyhair);
                        guyhair.frame = currentFrame;
                    }
                    else {
                        let girlhair = this.make.sprite(0, 0, 'girlhair');
                        girlhair.anchor.set(0.5, 0.5);
                        girlhair.smoothed = false;
                        //console.log(npcProperties[i].appearance.hair_color);
                        girlhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                        npc.addChild(girlhair);
                        girlhair.frame = currentFrame;
                    }

                    let shirt = this.make.sprite(0, 0, 'scishirt');
                    shirt.anchor.set(0.5, 0.5);
                    shirt.smoothed = false;
                    shirt.tint = shirtColors[npcProperties[i].appearance.shirt];
                    npc.addChild(shirt);
                    shirt.frame = currentFrame;

                    this.game.physics.arcade.enable(npc);
                    //face.animations.add('bounce');
                    //shirt.animations.add('bounce');
                    //npc.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
                    //face.animations.play('bounce', sciFPS, true);
                    //shirt.animations.play('bounce', sciFPS, true);
                    //npc.animations.play('sciwalk', sciFPS, true);

                    //npc.body.gravity.y = 2000;
                    npcGroup.add(npc);
                    npcs.push(npc);
                }
            }
        }

        player.frame = currentFrame;
        playerface.frame = currentFrame;
        playerguyhair.frame = currentFrame;
        playergirlhair.frame = currentFrame;
        playershirt.frame = currentFrame;

        this.world.bringToTop(npcGroup);

        let relativePlayerLocs = playerLocs.map(function(l) {
            if (myPos >= 256 && myPos <= worldSize - 256) { // normal case
                if (Math.abs(l - myPos) <= 256) {
                    return l - myPos;
                }
                else {
                    return MAX_INT_UND;
                }
            }
            else if (myPos < 256) {
                if (l >= worldSize - (256 - myPos)) {
                    // guaranteed to be in frame
                    return -1 * (myPos + worldSize - l);
                }
                else if (Math.abs(l - myPos) <= 256) {
                    return l - myPos;
                }
                else {
                    return MAX_INT_UND;
                }
            }
            else if (myPos > worldSize - 256) {
                if (l <= 256 - (worldSize - myPos)) {
                    return l + worldSize - myPos;
                }
                else if (Math.abs(l - myPos) <= 256) {
                    return l - myPos;
                }
                else {
                    return MAX_INT_UND;
                }
            }
            // should be exhaustive
        });

        for (let i = 0 ; i < playerLocs.length ; i++) {
            if (relativePlayerLocs[i] != MAX_INT_UND) {
                // we render this npc
                let adjustedLoc = relativePlayerLocs[i];
                if (adjustedLoc >= 256) {
                    adjustedLoc = -1 * (512 - adjustedLoc);
                }
                //console.log(adjustedLoc);
                let npc = this.game.add.sprite(this.game.world.centerX + adjustedLoc, this.game.world.height - 74, 'allwalk');

                if (!playerInfo[i].disguised) { // if they are a chicken!
                    npc.frame = currentFrame + 8;
                }
                else {
                    npc.frame = currentFrame;
                }

                npc.anchor.set(0.5, 0.5);
                npc.smoothed = false;

                if (playerInfo[i].facing) {
                    npc.scale.setTo(4);
                }
                else {
                    npc.scale.setTo(4);
                    npc.scale.x = -4;
                }

                this.game.physics.arcade.enable(npc);

                if (playerInfo[i].disguised) { // add face hair shirt and set frame
                    let face = this.make.sprite(0, 0, 'sciface');
                    face.anchor.set(0.5, 0.5);
                    face.smoothed = false;
                    face.tint = faceColors[playerInfo[i].appearance.skin_color];
                    face.frame = currentFrame;
                    npc.addChild(face);

                    if (playerInfo[i].appearance.hair == 0) {
                        let guyhair = this.make.sprite(0, 0, 'guyhair');
                        guyhair.anchor.set(0.5, 0.5);
                        guyhair.smoothed = false;
                        guyhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                        npc.addChild(guyhair);
                        guyhair.frame = currentFrame;
                    }
                    else {
                        let girlhair = this.make.sprite(0, 0, 'girlhair');
                        girlhair.anchor.set(0.5, 0.5);
                        girlhair.smoothed = false;
                        //console.log(npcProperties[i].appearance.hair_color);
                        girlhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                        npc.addChild(girlhair);
                        girlhair.frame = currentFrame;
                    }

                    let shirt = this.make.sprite(0, 0, 'scishirt');
                    shirt.anchor.set(0.5, 0.5);
                    shirt.smoothed = false;
                    shirt.tint = shirtColors[playerInfo[i].appearance.shirt];
                    npc.addChild(shirt);
                    shirt.frame = currentFrame;
                }

                otherPlayers.push(npc);
            }

        }

        // moveeeee!
        for (let i = 0 ; i < npcLocs.length ; i++) {
            let speed = walkSpeed;
            if (npcProperties[i].running) {
                speed = runSpeed;
            }
            if (!npcProperties[i].facing) {
                speed = -1 * speed;
            }

            npcLocs[i] = ((npcLocs[i] + speed) % worldSize + worldSize) % worldSize;
        }

        for (let i = 0 ; i < playerLocs.length ; i++) {
            let speed = walkSpeed;
            if (playerInfo[i].running) {
                speed = runSpeed;
            }
            if (!playerInfo[i].facing) {
                speed = -1 * speed;
            }

            playerLocs[i] = ((playerLocs[i] + speed) % worldSize + worldSize) % worldSize;
        }

        let mySpeed = walkSpeed;
        if (!myInfo.facing) {
            mySpeed = -1 * mySpeed;
        }

        myPos = ((myPos + mySpeed) % worldSize + worldSize) % worldSize;

        this.world.bringToTop(playerGroup);

        // Check collisions
        let hitPlatform = game.physics.arcade.collide(player, platforms);

        // Move with arrow keys
        if (cursors.left.isDown) {
            if (myInfo.facing) {
                sendToServer(SWITCH_FACING, false);
            }
       }
        else if (cursors.right.isDown) {
            if (!myInfo.facing) {
                sendToServer(SWITCH_FACING, true);
            }
       }

        // Jump
        if ((key_jump.isDown || cursors.up.isDown) && player.body.touching.down && hitPlatform) {
            player.body.velocity.y -= isChicken ? 750 : 600; // TODO use impulse instead
        }

        // Gravity
        //player.body.gravity.y = isChicken ? 200 : 2000;

        //if(!isChicken) {
        //    bawk.stop();
        //}

        // Transform
        if((transform.isDown || cursors.down.isDown) && lastTransform + cooldown < this.time.now && !isChicken) {
            isChicken = true;
            sendToServer(TRANSFORM_TO_CHICKEN, null);
            // Disappears scientists sprites and reveals chickenbar
            // Increases bg scrolling speed
            // starSpeed *= 1.5;
            // bgSpeed *= 2;
            // stars.autoScroll(starSpeed, 0);

            // Starts timers on transform time and bar decrement
                        // Play bawks

            //isChicken = true;
        }
    }
}
