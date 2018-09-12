// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
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
        this.rigidBody = this.getComponent(cc.RigidBody)
    },

    start () {

    },

    update (dt) {
        if(this.isTouchedGround){
            this.rigidBody.active = false
            this.rigidBody.linearVelocity = cc.Vec2.ZERO;

            let pathPos = [];
            pathPos.push(this.node.position);
            pathPos.push(cc.v2(725, 170))
            pathPos.push(cc.v2(725, 1295))
            pathPos.push(cc.v2(503, 1230))

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
