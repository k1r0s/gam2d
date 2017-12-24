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
