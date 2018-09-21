cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    
    onLoad () {
        cc.director.preloadScene("game",this.onProgress.bind(this),this.onLoaded.bind(this));
    },

    start () {
        
    },

    onProgress: function(completedCount,totalCount,item){
        console.log(item)
    },

    onLoaded:function(){

    }
});
