var Ball = require("./Ball");
var Barrier = require("./Barrier");

var MainController = cc.Class({
    extends: cc.Component,

    properties:() => ({
        prefabBarriers:{
            type: cc.Prefab,
            default: []
        },
        prefabBall: cc.Prefab,
        balls:{
            type: Ball,
            default: []
        },
        barriers:{
            type: Barrier,
            default: []
        },
        lbScoreCount: cc.Label
    }),

    onLoad () {
        this.score = 0;
        this.addBarriers();

        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);

        this.addScore(this.score);
    },

    addBall(pos){
        let ball = cc.instantiate(this.prefabBall).getComponent(Ball);
        ball.node.parent = this.node;
        ball.node.position = pos;
        this.balls.push(ball);
    },

    onTouchStart(touch){
        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);
        this.shootBalls(touchPos.sub(cc.v2(0,420)));
    },

    shootBalls(dir){
        for(let i = 0; i < this.balls.length; i++){
            let ball = this.balls[i];
            this.scheduleOnce(function(){
                this.shootBall(ball,dir);
            }.bind(this), i * 0.3)
        }
    },

    shootBall (ball,dir){
        ball.rigidBody.active = false;
        let pathPos = [];
        pathPos.push(ball.node.position);
        pathPos.push(cc.v2(0,420));

        ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.8,pathPos,0.5),
            cc.callFunc(function(){
                ball.rigidBody.active = true;
                //ball.getComponent(cc.Collider).restitution = 1;
                ball.rigidBody.linearVelocity = dir.mul(3);
            })
        ))
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
            barrier.main = this;
            currentPosX += this.getRandomSpace();
            this.barriers.push(barrier);
        }   
    },

    addScore(){
        this.lbScoreCount.string = this.score++;
    },

    removeBarrier(barrier){
        let idx = this.barriers.indexOf(barrier);
        if(idx != -1){
            barrier.node.removeFromParent(false);
            this.barriers.splice(idx, 1);
        }
    },

    getRandomSpace(){
        return 100 + Math.random() * 100
    },

    update (dt) {},
});

module.exports = MainController;