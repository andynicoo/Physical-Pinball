cc.Class({
    extends: cc.Component,

    properties: {
        progressBar :null,
        loadingLabel: cc.Label,
        startButton: cc.Button
    },
    
    onLoad () {
        cc.director.preloadScene("game",this.onProgress.bind(this),this.onLoaded.bind(this));
    },

    start () {
        this.progressBar = this.node.getChildByName("progressBar").getComponent(cc.ProgressBar);
        this.startButton.node.active = false;
    },

    onProgress: function(completedCount,totalCount,item){
        let completedRate = completedCount / totalCount;
        this.progressBar.progress = completedRate;
        this.loadingLabel.string = "加载中...（" + parseInt(completedRate * 100).toString() + "）";
    },

    onLoaded:function(){
        this.loadingLabel.string = "加载完成（100%）";
        this.startButton.node.active = true;
    }
});
