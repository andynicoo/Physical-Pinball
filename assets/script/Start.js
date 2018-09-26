cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Start";
        clickEventHandler.handler = "gameStart";
        clickEventHandler.customEventData = "foobar";
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    },

    gameStart:function (event, customEventData) {
        cc.director.loadScene("game");
    }
});
