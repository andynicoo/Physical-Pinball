var Barrier = cc.Class({
    extends: cc.Component,

    properties:() => ({
        lbScore: {
            default: null,
            type: cc.Label
        },
        isAddBuffBall:{
            default: false,
            type: cc.Boolean
        },
        main: require("./MainController")
    }),

    onLoad () {
        this.score = 10;
        this.setScore(this.score);
        
    },

    start () {
        if(this.lbScore){
            this.lbScore.node.rotation = -this.node.rotation
        }
    },

    setScore(score){
        if(this.lbScore){
            this.score = score;
            this.lbScore.string = this.score.toString();
        }
    },

    onBeginContact(contact, selfCollider,otherCollider){
        if(this.isAddBuffBall){
            this.main.addBall(this.node.position);
            this.main.removeBarrier(this);
        }else{
            this.main.addScore();
            if(this.score == 0){
                this.main.removeBarrier(this);
            }else{
                this.setScore(this.score - 1);
            }
            
        }
    },

    onPreSolve(contact, selfCollider,otherCollider){
        //console.log('onPreSolve')
    },

    onPostSolve(contact, selfCollider,otherCollider){
        //console.log('onPostSolve')
    },

    onEndContact(contact, selfCollider,otherCollider){
        //console.log('onEndContact')
    },


    // update (dt) {},
});

module.exports = Barrier;
