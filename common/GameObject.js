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


        for (var i = 0; i < this.colliders.length; i++) {

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
