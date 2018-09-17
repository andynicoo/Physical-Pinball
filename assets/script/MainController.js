var Ball = require("./Ball");
var Barrier = require("./Barrier");
var Config = require("./Config");

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
        lbScoreCount: cc.Label,
        arraw: cc.Sprite
    }),

    onLoad () {
        this.score = 0;
        this.recycleBallsCount = 1;
        this.addBarriers();

        //this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);

        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);

        this.addScore(this.score);

        this.balls[0].main = this;
        this.balls[0].node.group = Config.groupBallInRecycle;
    },

    onTouchMove(touch){
        let origin = cc.v2(0, 446);
        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);

        if(touchPos.y > origin.y){
            return;
        }

        let graphics = this.node.getComponent(cc.Graphics);
        let line = touchPos.sub(origin);
        let length = 40;
        let lineLength = line.mag();    //获得这个向量的长度
        let increment = line.normalize().mul(length); //根据每条线段的长度获得一个增量向量
        let pos = origin.clone(); //临时变量

        graphics.fillColor = cc.color(255,255,255);
        pos.addSelf(increment);
        graphics.clear();

        //只要线段长度还大于每条线段的长度
        while(lineLength > length){
            graphics.circle(pos.x, pos.y, 5);
            graphics.fill();
            pos.addSelf(increment);
            lineLength -= length;
        }

        var dis = origin.sub(touchPos)
        var angle = Math.atan2(dis.y, dis.x) / Math.PI * 180;
        this.arraw.node.rotation = -angle;

    },

    addBall(pos){
        let ball = cc.instantiate(this.prefabBall).getComponent(Ball);
        ball.node.parent = this.node;
        ball.node.position = pos;
        ball.main = this;
        ball.node.group = Config.groupBallInGame;
        this.balls.push(ball);
    },

    onTouchEnd(touch){
        if(!this.isRecycleFinished()){
            return;
        }
        let graphics = this.node.getComponent(cc.Graphics);
        graphics.clear();
        this.recycleBallsCount = 0;
        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);
        this.shootBalls(touchPos.sub(cc.v2(0,420)));
    },

    shootBalls(dir){
        for(let i = 0; i < this.balls.length; i++){
            let ball = this.balls[i];
            this.scheduleOnce(function(){
                this.shootBall(ball,dir);
            }.bind(this), i * 0.2)
        }
    },

    shootBall (ball,dir){
        ball.rigidBody.active = false;
        let pathPos = [];
        pathPos.push(ball.node.position);
        pathPos.push(cc.v2(0,420));
        ball.node.group = Config.groupBallInGame;
        ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.8,pathPos,0.5),
            cc.callFunc(function(){
                ball.rigidBody.active = true;
                //ball.getComponent(cc.Collider).restitution = 1;
                ball.rigidBody.linearVelocity = dir.mul(3);
            })
        ))
    },

    recycleBall(){
        this.recycleBallsCount++;

        if(this.isRecycleFinished()){
            for(let i = 0; i < this.barriers.length; i++){
                let barrier = this.barriers[i];
                barrier.node.runAction(cc.moveBy(0.5,cc.v2(0,100)))
            }
            this.addBarriers();
        }
    },

    isRecycleFinished(){
        return this.recycleBallsCount == this.balls.length;
    },

    addBarriers () {
        let startPosX = -280;
        let endPosX = 280;

        let currentPosX = startPosX + this.getRandomSpace() - 60;

        while(currentPosX < endPosX){
            let barrier = cc.instantiate(this.prefabBarriers[Math.floor(Math.random() * this.prefabBarriers.length)]).getComponent(Barrier)
            barrier.node.parent = this.node;
            barrier.node.position = cc.v2(currentPosX,-410 + this.randomNum(-20,20));
            if(barrier.lbScore){
                barrier.node.rotation = Math.random() * 360;
            }
            barrier.main = this;
            currentPosX += this.getRandomSpace();
            this.barriers.push(barrier);
        }   
    },

    addScore(){
        this.lbScoreCount.string = '分数：' + this.score++;
    },

    removeBarrier(barrier){
        let idx = this.barriers.indexOf(barrier);
        if(idx != -1){
            barrier.node.removeFromParent(false);
            this.barriers.splice(idx, 1);
        }
    },

    getRandomSpace(){
        return 60 + Math.random() * 100
    },

    randomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range);
        return num;
    },

    update (dt) {},
});

module.exports = MainController;