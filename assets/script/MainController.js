import Ball from './Ball';
import Barrier from './Barrier';

cc.Class({
    extends: cc.Component,

    properties: {
        prefabBarriers:{
            type: cc.Prefab,
            default: []
        },
        balls:{
            type: Ball,
            default: []
        },
        barriers:{
            type: Barrier,
            default: []
        }
    },

    onLoad () {
        this.addBarriers();

        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    },

    shootBall (ball,dir){
        ball.rigidBody.active = false;
        let pathPos = [];
        pathPos.push(ball.node.position);
        pathPos.push(cc.v2(0,440));

        ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.8,pathPos,0.5),
            cc.callFunc(function(){
                ball.rigidBody.active = true;
                //ball.rigidBody.restitution = 1;
                ball.rigidBody.linearVelocity = dir.mul(3);
            })
        ))
    },

    onTouchStart(touch){
        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);
        this.shootBall(this.balls[0], touchPos.sub(cc.v2(0,440)));
    },

    addBarriers () {
        let startPosX = -248;
        let endPosX = 208;

        let currentPosX = startPosX + this.getRandomSpace();

        while(currentPosX < endPosX){
            let barrier = cc.instantiate(this.prefabBarriers[Math.floor(Math.random() * this.prefabBarriers.length)]).getComponent(Barrier)
            barrier.node.parent = this.node;
            barrier.node.position = cc.v2(currentPosX,-410);
            barrier.node.rotation = Math.random() * 360;
            currentPosX += this.getRandomSpace();
            this.barriers.push(barrier);
        }   
    },

    getRandomSpace(){
        return 100 + Math.random() * 100
    },

    update (dt) {},
});
