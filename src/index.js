const GameScene = require("../common/GameScene");
const GameControls = require("../common/GameControls");
const Display = require("./Display");
const Player = require("./Player");
const Wall = require("./Wall");

window.scene1 = new GameScene("#sampleScene");
const player = new Player({x: 35, y: 220});

const wall1 = new Wall({x: 100, y: 200}, [{x: 10, y: 200}, {x: -100, y: 0}]);


// var leftBox = new Wall({x: 0, y: 0}, {x: 0, y: 500});
// var bottomBox = new Wall({x: 0, y: 500}, {x: 500, y: 500});
// var rightBox = new Wall({x: 500, y: 500}, {x: 500, y: 0});
// var topBox = new Wall({x: 500, y: 0}, {x: 0, y: 0});
// var wall1 = new Wall({x: 0, y: 200}, {x: 100, y: 200});
// var wall2 = new Wall({x: 100, y: 200}, {x: 100, y: 400});

const display = new Display({x: 25, y: 25}, player);

// scene1.addObjects(player, wall1, wall2, leftBox, bottomBox, rightBox, topBox);
scene1.addObjects(player, wall1);


player.addColliders(wall1);
// player.addColliders(wall1, wall2, leftBox, bottomBox, rightBox, topBox);

scene1.addUIElement(display);

GameControls.keyboard();

scene1.start(70);
