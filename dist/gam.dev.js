(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = GameControls = {
    ARROW_LEFT: false,
    ARROW_DOWN: false,
    ARROW_RIGHT: false,
    ARROW_UP: false,
    SPACE: false,
    CONTROL: false,
    MOUSE_RIGHT: false,
    MOUSE_LEFT: false,

    ARROW_LEFT_CODE: 37,
    ARROW_DOWN_CODE: 40,
    ARROW_RIGHT_CODE: 39,
    ARROW_UP_CODE: 38,
    SPACE_CODE: 32,
    CONTROL_CODE: 17,
    MOUSE_RIGHT_CODE: 3,
    MOUSE_LEFT_CODE: 1,

    keyMapper: [],

    setup: function(){
        this.keyMapper[this.ARROW_LEFT_CODE] = 'ARROW_LEFT';
        this.keyMapper[this.ARROW_DOWN_CODE] = 'ARROW_DOWN';
        this.keyMapper[this.ARROW_RIGHT_CODE] = 'ARROW_RIGHT';
        this.keyMapper[this.ARROW_UP_CODE] = 'ARROW_UP';
        this.keyMapper[this.SPACE_CODE] = 'SPACE';
        this.keyMapper[this.CONTROL_CODE] = 'CONTROL';
        this.keyMapper[this.MOUSE_RIGHT_CODE] = 'ARROW_RIGHT';
        this.keyMapper[this.MOUSE_LEFT_CODE] = 'MOUSE_LEFT';
    },

    keyboard: function(){
        this.setup();
        window.addEventListener("keydown", this.handle.bind(this));
        window.addEventListener("keyup", this.handle.bind(this));
    },
    mouse: function(){
        this.setup();
        window.addEventListener("mousedown", this.handle.bind(this));
        window.addEventListener("mouseup", this.handle.bind(this));
    },

    isPressed: function(evt){
        return evt.type.search("down") > -1;
    },

    handle: function(evt){
        evt.preventDefault();
        this[this.keyMapper[evt.which]] = this.isPressed(evt);
    }
}

},{}],2:[function(require,module,exports){
const { extend, override } = require("kaop");
const MeshObject = require("./MeshObject");

module.exports = GameObject = extend(MeshObject, {

    UID: undefined,
    colliders: undefined,
    width: undefined,
    height: undefined,

    constructor: [override.implement, function(parent, position, vectors){
        parent(position, vectors);
        this.colliders = [];
        this.width = 0;
        this.height = 0;
    }],

    offSetX: function(nextPosition){
        return nextPosition ?
        nextPosition.x + this.width : this.position.x + this.width;
    },

    offSetY: function(nextPosition){
        return nextPosition ?
        nextPosition.y + this.height : this.position.y + this.height;
    },

    addCollider: function(gameObj){
        this.colliders.push(gameObj);
    },

    addColliders: function(){
        for (let i = arguments.length - 1; i > -1; i--) {
            this.addCollider(arguments[i]);
        }
    },

    getDistanceTo: function(gameObj){
        const distance = this.getRelativePosition() - gameObj.getRelativePosition();
        return distance < 0 ? distance * -1 : distance;
    },

    getRelativePosition: function(){
        const xCenter = this.position.x + (this.width / 2);
        const yCenter = this.position.y + (this.height / 2);
        return xCenter + yCenter;
    },

    getBounds: function(nextPosition){
        return {
            left: nextPosition ? nextPosition.x : this.position.x,
            right: this.offSetX(nextPosition),
            up: nextPosition ? nextPosition.y : this.position.y,
            down: this.offSetY(nextPosition)
        }
    },

    willCollide: function(nextPosition){

        if(!this.colliders.length){ return false; }

        const nextBounds = this.getBounds(nextPosition);

        for (let i = this.colliders.length - 1; i > -1; i--) {

            // if(this.trackingDistance > this.getDistanceTo(this.colliders[i])) { continue; }

            const subjectBounds = this.colliders[i].getBounds();

            const collision = nextBounds.down > subjectBounds.up &&
            nextBounds.left < subjectBounds.right &&
            nextBounds.right > subjectBounds.left &&
            nextBounds.up < subjectBounds.down;

            if (collision) { return true; }
        }

        return false;
    },

    tick: function(){},

    render: function(context){}
});

},{"./MeshObject":4,"kaop":8}],3:[function(require,module,exports){
const { createClass } = require("kaop");
var raf = require("./requestAnimationFrame");

module.exports = GameScene = createClass({

    canvasEl: null,
    context: null,
    allowedContext: "2d",
    framesPerSec: 50,
    ticksPerSec: 20,
    canRender: false,
    stopped: true,
    collection: {},
    uicollection: {},
    nextUID: 0,
    amount: 0,
    renderGovernor: null,
    tickGovernor: null,

    constructor: function(canvasSelector){
        this.canvasEl = document.querySelector(canvasSelector);
        this.context = this.canvasEl.getContext(this.allowedContext);
    },

    start: function(providedFps){
        if(providedFps) { this.framesPerSec = providedFps; }
        this.stopped = false;
        this.loop();
        this.renderGovernor = setInterval(_ => this.canRender = true, 1000 / this.framesPerSec);
        this.tickGovernor = setInterval(_ => this.performTicks(), 1000 / this.ticksPerSec);
    },

    performTicks: function(){
        for (let uid in this.collection) {
            if(typeof this.collection[uid].tick === "function"){
                this.collection[uid].tick();
            }
        }
    },

    clearCanvas: function(){
        this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    },

    loop: function(){
        if(this.canRender){
            this.canRender = false;
            this.clearCanvas();
            this.renderGameObjects();
            this.renderUIElements();
        }

        if(!this.stopped){
            raf(_ => this.loop());
        }
    },

    stop: function(){
        this.stopped = true;

        clearInterval(this.renderGovernor);
        clearInterval(this.tickGovernor);
    },

    renderUIElements: function(){
        for (let uid in this.uicollection) {
            this.renderObject(this.uicollection[uid]);
        }
    },

    renderGameObjects: function(){
        for (let uid in this.collection) {
            this.renderObject(this.collection[uid]);
        }
    },

    renderObject: function(object){
        if(object.preventRender){ return; }

        object.render(this.context);
    },

    addObject: function(object){
        object.UID = this.nextUID++;
        this.collection[object.UID] = object;
        this.amount++;
    },

    addUIElement: function(element){
        element.UID = this.nextUID++;
        this.uicollection[element.UID] = element;
    },

    addObjects: function(){
        for (let i = arguments.length - 1; i > -1; i--) {
            this.addObject(arguments[i]);
        }
    },

    addUIElements: function(){
        for (let i = arguments.length - 1; i > -1; i--) {
            this.addUIElement(arguments[i]);
        }
    },

    del: function(object){
        this.amount--;
        delete this.collection[object.UID];
    }
});

},{"./requestAnimationFrame":7,"kaop":8}],4:[function(require,module,exports){
const { createClass } = require("kaop");

module.exports = MeshObject = createClass({
    vectors: undefined,
    position: undefined,
    tracking: 0,

    constructor: function(position, vectors){
        this.position = {};
        this.position.x = position.x;
        this.position.y = position.y;
        this.vectors = [];
        this.vectors = vectors;

        if(this.vectors){ this.seekBestTracking(); }
    },

    setTraking: function (auxVectorPoint){
        if(auxVectorPoint < 0){ auxVectorPoint *= -1; }
        if(auxVectorPoint > this.tracking){ this.tracking = auxVectorPoint; }
    },

    getAbsVector: function(index){
        const selectedVector = this.vectors[index];

        return {
            x: selectedVector.x + this.position.x,
            y: selectedVector.y + this.position.y
        }
    },

    seekBestTracking: function(){
        for (let i = this.vectors.length - 1; i > -1; i--) {
            for (let point in this.vectors[i]) {
                this.setTraking(point);
            }
        }
    },

    distanceTo: function(mesh){

        let xDistance = this.position.x - mesh.position.x;
        let yDistance = this.position.y - mesh.position.y;
        if(xDistance < 0){ xDistance *= -1; }
        if(yDistance < 0){ yDistance *= -1; }
        return xDistance + yDistance;
    },

    isTouching: function(mesh){},
});

},{"kaop":8}],5:[function(require,module,exports){
const { createClass } = require("kaop");

module.exports = UIElement = createClass({
    UID: undefined,
    position: undefined,
    constructor: function(position){
        this.position = {x: 0, y: 0};
        this.position.x = position.x;
        this.position.y = position.y;
    },

    render: function(context){

    }
});

},{"kaop":8}],6:[function(require,module,exports){
module.exports = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

},{}],7:[function(require,module,exports){
module.exports = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

},{}],8:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.kaop=t()}(this,function(){"use strict";function e(e){return!e.advice}function t(e,t,n){return function(){function i(){if(o++,n[o]){var e=n[o];if(r.isMethod(e)){if(!c.prevented)try{c.result=e.apply(c.scope,c.args)}catch(e){c.exception=e}}else e.call(void 0,c);r.isAsync(e)||c.commit()}else if(c.exception)throw c.exception}var o=-1,c={args:Array.prototype.slice.call(arguments),scope:this,key:t,method:r.getMethodFromArraySignature(n),target:e,exception:void 0,prevented:void 0,result:void 0,commit:i,prevent:function(){c.prevented=!0},handle:function(){var e=c.exception;return delete c.exception,e},skip:function(){o=n.findIndex(r.isMethod)-1}};return i(),c.result}}function n(e,t,n){function r(){"function"==typeof this.constructor&&this.constructor.apply(this,arguments)}r.super=e,r.signature=t;var o=i.wove(r,t);return r.prototype=Object.assign(Object.create(e.prototype),o),r}var r={isMethod:e,isValidArraySignature:function(t){return t.every(function(e){return"function"==typeof e})&&1===t.filter(e).length},getMethodFromArraySignature:function(t){return t.find(e)},isAsync:function(e){return!!e.toString().match(/[a-zA-Z$_]\.commit/)},createInstance:function(e){return new e}},i={advice:function(e){return e.advice=1,e},aspect:function(e){return function(t){return Object.keys(t).reduce(e,t)}},wove:function(e,n){var i=Object.assign({},n);for(var o in i)i[o]instanceof Array&&r.isValidArraySignature(i[o])&&(i[o]=t(e,o,i[o]));return i},createProxyFn:t};return{createClass:function(e){return n(function(){},e)},extend:function(e,t){return n(e,t)},clear:function(e){for(var t in e.signature)e.signature[t]instanceof Array&&r.isValidArraySignature(e.signature[t])&&(e.prototype[t]=r.getMethodFromArraySignature(e.signature[t]));return e},override:{apply:i.advice(function(e){e.target.super.prototype[e.key].apply(e.scope,e.args)}),implement:i.advice(function(e){e.args.unshift(e.target.super.prototype[e.key].bind(e.scope))})},inject:{args:function(){var e=Array.prototype.slice.call(arguments);return i.advice(function(t){if("constructor"!==t.key)throw new Error("inject only available in constructor");t.args=e.map(function(e){return e()})})},assign:function(e){return i.advice(function(t){for(var n in e){var r=e[n];t.scope[n]=r()}})}},provider:{factory:function(e){return function(){return r.createInstance(e)}},singleton:function(e){var t;return function(){return t||(t=r.createInstance(e)),t}}},reflect:i}});

},{}],9:[function(require,module,exports){
const { extend, override } = require("kaop");
var UIElement = require("../common/UIElement");

module.exports = Display = extend(UIElement, {

    subject: null,

    constructor: [override.implement, function(parent, position, player){
        parent(position);

        this.subject = player;
    }],

    render: function(context){
        const lineHeight = 11;
        let linePosition = this.position.y;

        context.fillStyle = "black";
        context.fillRect(this.position.x, this.position.y, 150, 100);

        let xtext = "position x: $x";
        let ytext = "position y: $y";

        xtext = xtext.replace("$x", this.subject.position.x);
        ytext = ytext.replace("$y", this.subject.position.y);

        context.font = "11px Sans";
        context.fillStyle = "white";
        context.fillText(xtext, this.position.x, linePosition+=lineHeight);
        context.fillText(ytext, this.position.x, linePosition+=lineHeight);

        if(this.subject.colliders && this.subject.colliders.length){
            let collidersText = "colliders: ";
            context.fillText(collidersText, this.position.x, linePosition+=lineHeight);

            for (let i = this.subject.colliders.length - 1; i > -1; i--) {
                const collider = this.subject.colliders[i];

                const colliderName = "collider: " + collider.UID;
                const distance = " distance: " + this.subject.distanceTo(collider);
                context.fillText(colliderName + distance, this.position.x, linePosition+=lineHeight);
            }
        }

    }
});

},{"../common/UIElement":5,"kaop":8}],10:[function(require,module,exports){
const { extend, override } = require("kaop");
const clone = require("../common/clone");
const GameObject = require("../common/GameObject");
const GameControls = require("../common/GameControls");

module.exports = Player = extend(GameObject, {

    background: "assets/octocat.png",
    speed: 1.25,
    step: 1,
    imageWidth: 50,
    imageHeight: 50,
    width: 30,
    height: 40,
    tracking: 30,

    constructor: [override.apply, function(position){
        this.position.x = position.x;
        this.position.y = position.y;

        this.image = new Image;
        this.image.src = this.background;
    }],

    computeMove: function(){
        let finalSpeed = this.speed;
        if(GameControls.SPACE){
            finalSpeed *= 2;
        }
        return this.step * finalSpeed;
    },

    tick: function(){
        const movementPerTick = this.computeMove();

        const nextPosition = clone(this.position);

        if(GameControls.ARROW_RIGHT){
            nextPosition.x += movementPerTick;
        }
        if(GameControls.ARROW_UP){
            nextPosition.y -= movementPerTick;
        }
        if(GameControls.ARROW_LEFT){
            nextPosition.x -= movementPerTick;
        }
        if(GameControls.ARROW_DOWN){
            nextPosition.y += movementPerTick;
        }

        // if(!this.willCollide(nextPosition)){
            this.position = nextPosition;
        // }
    },

    render: function(context){

        const imageOffSetX = this.imageWidth - this.width;
        const imageOffSetY = this.imageHeight - this.height;

        context.drawImage(
            this.image,
            this.position.x - imageOffSetX / 2,
            this.position.y - imageOffSetY / 2,
            this.imageWidth,
            this.imageHeight
        );
    }
})

},{"../common/GameControls":1,"../common/GameObject":2,"../common/clone":6,"kaop":8}],11:[function(require,module,exports){
const { extend, override } = require("kaop");
const GameObject = require("../common/GameObject");

module.exports = Wall = extend(GameObject, {

    pointA: undefined,
    pointB: undefined,

    constructor: [override.implement, function(parent, position, vectors){
        parent(position, vectors);
        this.pointA = {};
        this.pointB = {};
        this.pointA = this.getAbsVector(0);
        this.pointB = this.getAbsVector(1);
    }],

    render: function(context){
        context.beginPath();
        context.arc(this.position.x, this.position.y, 5, 0, 2*Math.PI);
        context.stroke();
        // context.beginPath();
        // context.moveTo(this.pointA.x, this.pointA.y);
        // context.lineTo(this.pointB.x, this.pointB.y);
        // context.stroke();
    }
})

},{"../common/GameObject":2,"kaop":8}],12:[function(require,module,exports){
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

},{"../common/GameControls":1,"../common/GameScene":3,"./Display":9,"./Player":10,"./Wall":11}]},{},[12]);
