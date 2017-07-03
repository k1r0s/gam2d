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

    keyboard: function(){
        window.addEventListener("keydown", this.handle.bind(this));
        window.addEventListener("keyup", this.handle.bind(this));
    },
    mouse: function(){
        window.addEventListener("mousedown", this.handle.bind(this));
        window.addEventListener("mouseup", this.handle.bind(this));
    },

    isPressed: function(evt){
        return evt.type.search("down") > -1;
    },

    handle: function(evt){

        evt.preventDefault();

        var pressed = this.isPressed(evt);

        if(evt.which === 1){
            this.MOUSE_LEFT = pressed;
        }else if (evt.which === 3){
            this.MOUSE_RIGHT = pressed;
        }else if (evt.which === 39){
            this.ARROW_RIGHT = pressed;
        }else if (evt.which === 37){
            this.ARROW_LEFT = pressed;
        }else if (evt.which === 38){
            this.ARROW_UP = pressed;
        }else if (evt.which === 40){
            this.ARROW_DOWN = pressed;
        }else if (evt.which === 32){
            this.SPACE = pressed;
        }else if (evt.which === 17){
            this.CONTROL = pressed;
        }
    }
});
