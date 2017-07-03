var GameScene = require("../common/GameScene");
var GameControls = require("../common/GameControls");
var Player = require("./Player");
var Wall = require("./Wall");

window.scene1 = new GameScene("#sampleScene");
var player = new Player({x: 35, y: 220});

var leftBox = new Wall({x: 0, y: 0}, {x: 0, y: 500});
var bottomBox = new Wall({x: 0, y: 500}, {x: 500, y: 500});
var rightBox = new Wall({x: 500, y: 500}, {x: 500, y: 0});
var topBox = new Wall({x: 500, y: 0}, {x: 0, y: 0});
var wall1 = new Wall({x: 0, y: 200}, {x: 100, y: 200});
var wall2 = new Wall({x: 100, y: 200}, {x: 100, y: 400});

scene1.addObjects(player, wall1, wall2, leftBox, bottomBox, rightBox, topBox);

player.addColliders(wall1, wall2, leftBox, bottomBox, rightBox, topBox);

GameControls.keyboard();

scene1.start(30);
