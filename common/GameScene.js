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
