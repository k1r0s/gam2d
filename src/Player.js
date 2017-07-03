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
