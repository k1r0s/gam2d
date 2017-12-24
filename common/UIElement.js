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
