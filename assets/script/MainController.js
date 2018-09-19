var Ball = require("./Ball");
var Barrier = require("./Barrier");
var Config = require("./Config");
var Shake = require("./Shake");

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
        arraw: cc.Sprite,
        obstacle:{
            type: cc.Node,
            default: null
        }
    }),

    //加载完成
    onLoad () {
        this.score = 0;
        this.recycleBallsCount = 1;
        this.addBarriers();

        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);

        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);

        this.addScore(this.score);

        this.balls[0].main = this;
        this.balls[0].node.group = Config.groupBallInRecycle;

        this.guideShow();

        
        //let shakeObj = new Shake();
        let shake = cc.shake(1,5,5);
        console.log(shake)
        // let shake = Shake.create(1,5,5);
        this.lbScoreCount.node.runAction(shake);
    },

    //触摸开始时
    onTouchStart(){
        this.guideHide();
    },

    //触摸移动
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

        graphics.fillColor = cc.color(255,255,255,150);
        pos.addSelf(increment);
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

    //触摸结束
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

    //新增小球
    addBall(pos){
        let ball = cc.instantiate(this.prefabBall).getComponent(Ball);
        ball.node.parent = this.node;
        ball.node.position = pos;
        ball.main = this;
        ball.node.group = Config.groupBallInGame;
        this.balls.push(ball);
    },

    //连续发射小球
    shootBalls(dir){
        for(let i = 0; i < this.balls.length; i++){
            let ball = this.balls[i];
            this.scheduleOnce(function(){
                this.shootBall(ball,dir);
            }.bind(this), i * 0.2)
        }
    },

    //发射单个小球
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

    //收回小球
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
    
    //小球是否收回完毕
    isRecycleFinished(){
        return this.recycleBallsCount == this.balls.length;
    },

    //添加障碍物
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
    
    //计分显示
    addScore(){
        this.lbScoreCount.string = '分数：' + this.score++;
    },

    //
    removeBarrier(barrier){
        let idx = this.barriers.indexOf(barrier);
        if(idx != -1){
            barrier.node.removeFromParent(false);
            this.barriers.splice(idx, 1);
        }
    },

    //获取随机距离
    getRandomSpace(){
        return 60 + Math.random() * 100;
    },

    //获取区间随机值
    randomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range);
        return num;
    },

    //显示引导动画
    guideShow(){
        this.obstacle.active = true;
        let handMove = this.obstacle.getChildByName('handMove');
        let animCtrl = handMove.getComponent(cc.Animation);
        animCtrl.play('handMove');
    },

    //关闭引导动画
    guideHide(){
        this.obstacle.active = false;
    }
});

module.exports = MainController;