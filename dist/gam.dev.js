(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Class = require("kaop/Class");

module.exports = GameControls = Class.static({
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
});

},{"kaop/Class":6}],2:[function(require,module,exports){
var Class = require("kaop/Class");

module.exports = GameObject = Class({

    UID: undefined,
    colliders: [],
    position: {x: 0, y: 0},
    width: 0,
    height: 0,

    constructor: function(){},

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
        for (var i = 0; i < arguments.length; i++) {
            this.addCollider(arguments[i]);
        }
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

        var nextBounds = this.getBounds(nextPosition);

        for (var i = this.colliders.length - 1; i > -1; i--) {

            var collision = nextBounds.down > this.colliders[i].getBounds().up &&
            nextBounds.left < this.colliders[i].getBounds().right &&
            nextBounds.right > this.colliders[i].getBounds().left &&
            nextBounds.up < this.colliders[i].getBounds().down;

            if (collision) { return true; }
        }

        return false;
    },

    tick: function(){},

    render: function(context){}
});

},{"kaop/Class":6}],3:[function(require,module,exports){
var Class = require("kaop/Class");
var raf = require("./requestAnimationFrame");

module.exports = GameScene = Class({

    canvasEl: null,
    context: null,
    allowedContext: "2d",
    framesPerSec: 50,
    ticksPerSec: 20,
    canRender: false,
    stopped: true,
    collection: {},
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

        this.renderGovernor = setInterval(function framecap(){
            this.canRender = true;
        }.bind(this), 1000 / this.framesPerSec);

        this.tickGovernor = setInterval(function timeline(){
            this.performTicks();
        }.bind(this), 1000 / this.ticksPerSec);
    },

    performTicks: function(){
        for (var uid in this.collection) {
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
            this.renderCollection();
        }

        if(!this.stopped){
            raf(this.loop);
        }
    },

    stop: function(){
        this.stopped = true;

        clearInterval(this.renderGovernor);
        clearInterval(this.tickGovernor);
    },

    renderCollection: function(){
        for (var uid in this.collection) {
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

    addObjects: function(){
        for (var i = arguments.length - 1; i > -1; i--) {
            this.addObject(arguments[i]);
        }
    },

    del: function(object){
        this.amount--;
        delete this.collection[object.UID];
    }
});

},{"./requestAnimationFrame":5,"kaop/Class":6}],4:[function(require,module,exports){
module.exports = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

},{}],5:[function(require,module,exports){
module.exports = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

},{}],6:[function(require,module,exports){
module.exports = require("./lib/index").Class;

},{"./lib/index":7}],7:[function(require,module,exports){
var Class = require("./src/Class");
var Advices = require("./src/Advices");
var UseExternal = require("./src/UseExternal");

var lib = {
    Class: Class,
    Advices: Advices,
    use: UseExternal
};

if (typeof module === "object") {
    module.exports = lib;
} else if (window) {
    window.kaop = lib;
}

/**
 * built in Advices
 */

 /* istanbul ignore next */
Advices.add(
    function override() {
        meta.args.unshift(meta.parentScope[meta.methodName].bind(this));
    }
);

},{"./src/Advices":8,"./src/Class":9,"./src/UseExternal":11}],8:[function(require,module,exports){
var Iteration = require("./Iteration");
var Utils = require("./Utils");

module.exports = Advices = {
    locals: {},
    pool: [],
    add: function() {
        for (var i = 0; i < arguments.length; i++) {
            Advices.pool.push(arguments[i]);
        }
    },
    bootstrap: function(config) {
        if (!(
                config.propertyValue &&
                Utils.isValidStructure(config.propertyValue) &&
                Utils.isRightImplemented(config.propertyValue, Advices.pool)
            )) {
            return config.propertyValue;
        }

        return function() {

            var executionProps = {
                method: Utils.getMethod(config.propertyValue),
                methodName: config.propertyName,
                scope: this,
                parentScope: config.sourceClass.prototype,
                args: Array.prototype.slice.call(arguments),
                result: undefined
            };

            new Iteration(config.propertyValue, executionProps, Advices.pool, Advices.locals);

            return executionProps.result;
        };
    }
};

},{"./Iteration":10,"./Utils":12}],9:[function(require,module,exports){
var Advices = require("./Advices");

var Class = function(sourceClass, extendedProperties, _static) {

    var inheritedProperties = Object.create(sourceClass.prototype);

    for (var propertyName in extendedProperties) {
        inheritedProperties[propertyName] = Advices.bootstrap({
            sourceClass: sourceClass,
            propertyName: propertyName,
            propertyValue: extendedProperties[propertyName]
        });
    }

    if (!_static) {
        var extendedClass = function() {
            try {
                for (var propertyName in this) {
                    if (Utils.isFunction(this[propertyName])) {
                        this[propertyName] = this[propertyName].bind(this);
                    } else if (extendedProperties.hasOwnProperty(propertyName)) {
                        // FIXME https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
                        // clone js objects, avoid reference point
                        var tmp = JSON.parse(JSON.stringify(extendedProperties[propertyName]));
                        this[propertyName] = tmp;
                    }
                }
            } finally {
                if (typeof this.constructor === "function") this.constructor.apply(this, arguments);
                return this;
            }
        };

        extendedClass.prototype = inheritedProperties;
        return extendedClass;
    } else {
        return inheritedProperties;
    }
};

var exp = function(mainProps) {
    return Class(function() {}, mainProps);
};
exp.inherits = Class;
exp.static = function(mainProps) {
    return Class(function() {}, mainProps, true);
};

module.exports = exp;

},{"./Advices":8}],10:[function(require,module,exports){
var Utils = require("./Utils");

module.exports = Iteration = function(definitionArray, props, pool, locals) {
    if (!definitionArray.length) {
        return;
    }
    this.index = -1;
    this.step = function() {
        this.index++;
        var currentStep = definitionArray[this.index];
        if (typeof currentStep === "function") {
            props.result = currentStep.apply(props.scope, props.args);
            this.step();
        } else if (typeof currentStep === "string") {
            var step = Utils.getAdviceImp(currentStep);
            var rawAdviceFn = Utils.getAdviceFn(step.name, pool);
            var transpiledMethod = Utils.transpileMethod(rawAdviceFn, props, arguments.callee.bind(this), locals);
            if (step.args) {
                eval("transpiledMethod.call(props.scope, " + step.args + ")");
            } else {
                eval("transpiledMethod.call(props.scope)");
            }
        }
    };
    this.step();
};

},{"./Utils":12}],11:[function(require,module,exports){
var Advices = require("./Advices");

module.exports = UseExternal = function(module){
    function checkDependency(dep){
        if(!Advices.locals[dep]) throw new Error("unmet dependency: " + dep);
    }

    module.dependencies.forEach(checkDependency);

    module.advices.forEach(Advices.add, Advices);
};

},{"./Advices":8}],12:[function(require,module,exports){
module.exports = Utils = {
    transpileMethod: function(method, meta, next, locals) {
        var methodToString = method.toString();
        var functionBody = methodToString
            .substring(methodToString.indexOf("{") + 1, methodToString.lastIndexOf("}"));
        var functionArguments = methodToString
            .substring(methodToString.indexOf("(") + 1, methodToString.indexOf(")"));

        if (!functionBody.match(/[^a-zA-Z_$]next[^a-zA-Z_$0-9]/g)) {
            functionBody += "\nnext();";
        }

        var transpiledFunction = "(function(" + functionArguments + ")\n{ " + functionBody + " \n})";
        var names = Object.keys(locals);
        for (var i = 0; i < names.length; i++) {
            eval("var " + names[i] + " = locals[names[i]]");
        }
        return eval(transpiledFunction);
    },
    getAdviceImp: function(rawAdviceCall) {
        return {
            name: rawAdviceCall.split(":")[0],
            args: rawAdviceCall.split(":")[1]
        };
    },
    isRightImplemented: function(array, advicePool) {
        var completeAdviceNameList = advicePool
            .map(function(advice) {
                return advice.name;
            });
        var implementedNames = array.filter(Utils.isString)
                    .map(function(adviceImplementation){
                        return adviceImplementation.split(":").shift().trim();
                    });

        return implementedNames.every(function(adviceName) {
                                return completeAdviceNameList.indexOf(adviceName) > -1;
                            });
    },
    isValidStructure: function(implementation) {
        return implementation instanceof Array && implementation.some(Utils.isFunction);
    },
    getMethod: function(array) {
        return array.find(function(item) {
            return typeof item === "function";
        });
    },
    isFunction: function(item) {
        return typeof item === "function";
    },
    isString: function(item) {
        return typeof item === "string";
    },
    getAdviceFn: function(fname, advicePool) {
        return advicePool.find(function(adv) {
            return adv.name === fname;
        });
    }
};

},{}],13:[function(require,module,exports){
var Class = require("kaop/Class");
var clone = require("../common/clone");
var GameObject = require("../common/GameObject");
var GameControls = require("../common/GameControls");

module.exports = Player = Class.inherits(GameObject, {

    background: "../assets/octocat.png",
    speed: 1.25,
    step: 1,
    imageWidth: 50,
    imageHeight: 50,
    width: 30,
    height: 40,

    constructor: function(position){
        this.position.x = position.x;
        this.position.y = position.y;

        this.image = new Image;
        this.image.src = this.background;
    },

    computeMove: function(){
        var finalSpeed = this.speed;
        if(GameControls.SPACE){
            finalSpeed *= 2;
        }
        return this.step * finalSpeed;
    },

    tick: function(){
        var movementPerTick = this.computeMove();

        var nextPosition = clone(this.position);

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

        if(!this.willCollide(nextPosition)){
            this.position = nextPosition;
        }
    },

    render: function(context){

        var imageOffSetX = this.imageWidth - this.width;
        var imageOffSetY = this.imageHeight - this.height;

        context.drawImage(
            this.image,
            this.position.x - imageOffSetX / 2,
            this.position.y - imageOffSetY / 2,
            this.imageWidth,
            this.imageHeight
        );
    }
})

},{"../common/GameControls":1,"../common/GameObject":2,"../common/clone":4,"kaop/Class":6}],14:[function(require,module,exports){
var Class = require("kaop/Class");
var GameObject = require("../common/GameObject");

module.exports = Wall = Class.inherits(GameObject, {

    position: {},
    to: {},
    width: 5,

    constructor: function(from, to){
        this.position = from;
        this.to = to;
    },

    offSetX: function(){
        return this.to.x;
    },

    offSetY: function(){
        return this.to.y;
    },

    render: function(context){
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.to.x, this.to.y);
        context.stroke();
    }
})

},{"../common/GameObject":2,"kaop/Class":6}],15:[function(require,module,exports){
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

scene1.start(70);

},{"../common/GameControls":1,"../common/GameScene":3,"./Player":13,"./Wall":14}]},{},[15]);
