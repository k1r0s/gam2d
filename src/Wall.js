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
