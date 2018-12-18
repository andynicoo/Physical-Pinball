//开始游戏、重开游戏
cc.Class({
    extends: cc.Component,
    //加载完成
    onLoad() {
        this.node.on('click',this.gameStart,this);
    },
    gameStart(){
        cc.director.loadScene("game");
    }
});
