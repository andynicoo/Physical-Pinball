cc.Class({
    extends: cc.Component,

    properties: {
        progressBar :null,
        loadingLabel: cc.Label
    },
    
    onLoad () {
        cc.director.preloadScene("game",this.onProgress.bind(this),this.onLoaded.bind(this));
    },

    start () {
        this.progressBar = this.node.getChildByName("progressBar").getComponent(cc.ProgressBar);
    },

    onProgress: function(completedCount,totalCount,item){
        let completedRate = completedCount / totalCount;
        this.progressBar.progress = completedRate;
        this.loadingLabel.string = "加载中...（" + parseInt(completedRate * 100).toString() + "）";
    },

    onLoaded:function(){
        //cc.director.loadScene("game");
    }
});
