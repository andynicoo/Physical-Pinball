cc.Class({
    extends: cc.Component,

    properties: {

        lbScore: {
            default: null,
            type: cc.Label
        },

        score:{
            default: 100,
            type: cc.Integer
        }
       
    },

    onLoad () {
        
        this.setScore(this.score);
        
    },

    setScore(score){
        this.score = score;
        this.lbScore.string = this.score.toString()
    },

    start () {
        this.lbScore.node.rotation = -this.node.rotation
    },

    onBeginContact(contact, selfCollider,otherCollider){
        this.setScore(this.score - 1)
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
