var Ball = cc.Class({
    extends: cc.Component,

    properties: {
        rigidBody: {
            type: cc.RigidBody,
            default: null
        },

        isTouchedGround : {
            type: cc.Boolean,
            default: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.collider = this.getComponent(cc.Collider);
    },

    start () {

    },

    update (dt) {
        if(this.isTouchedGround){
            this.rigidBody.active = false
            this.rigidBody.linearVelocity = cc.Vec2.ZERO;
            //this.getComponent(cc.Collider).restitution = 0.2;

            let pathPos = [];
            pathPos.push(this.node.position);
            pathPos.push(cc.v2(349, -498))
            pathPos.push(cc.v2(338, 608))
            pathPos.push(cc.v2(162, 557))

            this.node.runAction(cc.sequence(
                cc.cardinalSplineTo(2, pathPos, 0.9),
                cc.callFunc(function(){
                    this.rigidBody.active = true;
                }.bind(this))
            ))
            this.isTouchedGround = false;
        }
        
    },

    onBeginContact(contact, selfCollider,otherCollider){
        if(otherCollider.node.name == 'ground'){
            this.isTouchedGround = true;
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

    
});

module.exports = Ball;
