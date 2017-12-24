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
