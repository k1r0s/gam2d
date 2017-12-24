module.exports = GameControls = {
    ARROW_LEFT: false,
    ARROW_DOWN: false,
    ARROW_RIGHT: false,
    ARROW_UP: false,
    SPACE: false,
    CONTROL: false,
    MOUSE_RIGHT: false,
    MOUSE_LEFT: false,

    ARROW_LEFT_CODE: 37,
    ARROW_DOWN_CODE: 40,
    ARROW_RIGHT_CODE: 39,
    ARROW_UP_CODE: 38,
    SPACE_CODE: 32,
    CONTROL_CODE: 17,
    MOUSE_RIGHT_CODE: 3,
    MOUSE_LEFT_CODE: 1,

    keyMapper: [],

    setup: function(){
        this.keyMapper[this.ARROW_LEFT_CODE] = 'ARROW_LEFT';
        this.keyMapper[this.ARROW_DOWN_CODE] = 'ARROW_DOWN';
        this.keyMapper[this.ARROW_RIGHT_CODE] = 'ARROW_RIGHT';
        this.keyMapper[this.ARROW_UP_CODE] = 'ARROW_UP';
        this.keyMapper[this.SPACE_CODE] = 'SPACE';
        this.keyMapper[this.CONTROL_CODE] = 'CONTROL';
        this.keyMapper[this.MOUSE_RIGHT_CODE] = 'ARROW_RIGHT';
        this.keyMapper[this.MOUSE_LEFT_CODE] = 'MOUSE_LEFT';
    },

    keyboard: function(){
        this.setup();
        window.addEventListener("keydown", this.handle.bind(this));
        window.addEventListener("keyup", this.handle.bind(this));
    },
    mouse: function(){
        this.setup();
        window.addEventListener("mousedown", this.handle.bind(this));
        window.addEventListener("mouseup", this.handle.bind(this));
    },

    isPressed: function(evt){
        return evt.type.search("down") > -1;
    },

    handle: function(evt){
        evt.preventDefault();
        this[this.keyMapper[evt.which]] = this.isPressed(evt);
    }
}
