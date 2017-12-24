const { extend, override } = require("kaop");
var UIElement = require("../common/UIElement");

module.exports = Display = extend(UIElement, {

    subject: null,

    constructor: [override.implement, function(parent, position, player){
        parent(position);

        this.subject = player;
    }],

    render: function(context){
        const lineHeight = 11;
        let linePosition = this.position.y;

        context.fillStyle = "black";
        context.fillRect(this.position.x, this.position.y, 150, 100);

        let xtext = "position x: $x";
        let ytext = "position y: $y";

        xtext = xtext.replace("$x", this.subject.position.x);
        ytext = ytext.replace("$y", this.subject.position.y);

        context.font = "11px Sans";
        context.fillStyle = "white";
        context.fillText(xtext, this.position.x, linePosition+=lineHeight);
        context.fillText(ytext, this.position.x, linePosition+=lineHeight);

        if(this.subject.colliders && this.subject.colliders.length){
            let collidersText = "colliders: ";
            context.fillText(collidersText, this.position.x, linePosition+=lineHeight);

            for (let i = this.subject.colliders.length - 1; i > -1; i--) {
                const collider = this.subject.colliders[i];

                const colliderName = "collider: " + collider.UID;
                const distance = " distance: " + this.subject.distanceTo(collider);
                context.fillText(colliderName + distance, this.position.x, linePosition+=lineHeight);
            }
        }

    }
});
