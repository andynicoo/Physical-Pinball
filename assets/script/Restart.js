cc.Class({
    extends: cc.Component,

    properties:() => ({
       
    }),
    onLoad () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Restart";
        clickEventHandler.handler = "restart";
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    },

    restart:function (event, customEventData) {
        console.log(1)
        cc.director.loadScene("game");
    }
});