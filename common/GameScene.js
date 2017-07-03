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
        for (var i = 0; i < arguments.length; i++) {
            this.addObject(arguments[i]);
        }
    },

    del: function(object){
        this.amount--;
        delete this.collection[object.UID];
    }
});
