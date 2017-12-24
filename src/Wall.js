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
