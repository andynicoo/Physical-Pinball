var Ball = require("./Ball");
var Barrier = require("./Barrier");
var Config = require("./Config");
require("./Shake");
//游戏主控制类
var MainController = cc.Class({
    extends: cc.Component,
    properties: () => ({
        prefabBarriers: {
            type: cc.Prefab,
            default: []
        },
        prefabBall: cc.Prefab,
        balls: {
            type: Ball,
            default: []
        },
        barriers: {
            type: Barrier,
            default: []
        },
        lbScoreCount: cc.Label,
        ballCount: cc.Label,
        guide: cc.Node, //开局指引 节点
        gameStatus: true,
        gameOverMark: cc.Node, //游戏结束 节点
        takeAim:cc.Node //瞄准线 节点
    }),

    //加载完成
    onLoad() {
        //启用物理世界
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getActionManager().gravity = cc.v2(0, -1000); //设置重力
        //事件监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        //显示游戏指引
        this.init();
        this.guideShow();
        this.addBarriers();
    },
    //初始化
    init(){
        this.score = 0; //计分牌
        this.recycleBallsCount = 1; //收回小球数
        this.barrierScoreRate = 0; //设置障碍物基准率
        this.balls[0].main = this;
        this.balls[0].node.group = Config.groupBallInRecycle;
        this.gameOverMark.active = false;
        this.gameOverMark.zIndex = 10;
        this.guide.zIndex = 10;
        this.guide.active = false;
        this.takeAim.main = this;
    },
    //触摸开始时
    onTouchStart() {
        this.guideHide();
    },
    //触摸结束
    onTouchEnd(touch) {
        if (!this.isRecycleFinished()) {
            return;
        }
        let graphics = this.node.getChildByName("take-aim").getComponent(cc.Graphics);
        graphics.clear();
        this.recycleBallsCount = 0;
        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);
        this.shootBalls(touchPos.sub(cc.v2(0, 420)));
    },
    //新增小球
    addBall(pos) {
        let ball = cc.instantiate(this.prefabBall).getComponent(Ball);
        ball.node.parent = this.node;
        ball.node.position = pos;
        ball.main = this;
        ball.node.group = Config.groupBallInGame;
        this.balls.push(ball);
        this.setBallCount(this.balls.length);
    },
    //显示小球总数
    setBallCount(num){
        this.ballCount.string = '小球数：' + num.toString();
    },
    //连续发射小球
    shootBalls(dir) {
        if (!this.gameStatus) {
            return;
        }
        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            this.scheduleOnce(function () {
                this.shootBall(ball, dir);
            }.bind(this), i * 0.2)
        }
    },
    //发射单个小球
    shootBall(ball, dir) {
        ball.rigidBody.active = false;
        let pathPos = [];
        pathPos.push(ball.node.position);
        pathPos.push(cc.v2(0, 420));
        ball.node.group = Config.groupBallInGame;
        ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.8, pathPos, 0.5),
            cc.callFunc(function () {
                ball.rigidBody.active = true;
                ball.rigidBody.linearVelocity = dir.mul(3);
            })
        ))
    },
    //收回小球，上移一排障碍物
    recycleBall() {
        this.recycleBallsCount++;
        this.barrierScoreRate += 0.1;
        if (this.isRecycleFinished()) {
            for (let i = 0; i < this.barriers.length; i++) {
                let barrier = this.barriers[i];
                barrier.node.runAction(cc.sequence(
                    cc.moveBy(0.5, cc.v2(0, 100)),
                    cc.callFunc(function () {
                        if (barrier.node.position.y > 200) {
                            barrier.node.runAction(cc.shake(1.5, 3, 3));
                        }
                        if (barrier.node.position.y > 300) {
                            this.gameOver();
                        }
                    }.bind(this))
                ))
            }
            this.addBarriers();
        }
    },
    //小球是否收回完毕
    isRecycleFinished() {
        return this.recycleBallsCount == this.balls.length;
    },
    //添加障碍物
    addBarriers() {
        let startPosX = -270;
        let endPosX = 270;
        let currentPosX = startPosX + this.getRandomSpace();
        while (currentPosX < endPosX) {
            let barrier = cc.instantiate(this.prefabBarriers[Math.floor(Math.random() * this.prefabBarriers.length)]).getComponent(Barrier);
            barrier.node.parent = this.node;
            barrier.node.position = cc.v2(currentPosX, -410);
            if (barrier.lbScore) {
                barrier.node.rotation = Math.random() * 360;
            }
            barrier.main = this;
            currentPosX += this.getRandomSpace();
            this.barriers.push(barrier);
        }
    },
    //抖动障碍物
    shake(barrier) {
        let shake = cc.shake(0.7, 1, 1);
        barrier.node.runAction(shake);
    },
    //计分牌显示
    addScore() {
        this.score++;
        this.lbScoreCount.string = '分数：' + this.score.toString();
    },
    
    //设置障碍物自身分数值
    setBarrierScore() {
        let score = Math.floor(this.randomNum(1 + 2 * this.barrierScoreRate, 5 + 3 * this.barrierScoreRate));
        return score;
    },
    //消除障碍物
    removeBarrier(barrier) {
        let idx = this.barriers.indexOf(barrier);
        if (idx != -1) {
            barrier.node.removeFromParent(false);
            this.barriers.splice(idx, 1);
        }
    },
    //获取随机距离，用于生成障碍物的间距
    getRandomSpace() {
        return 80 + Math.random() * 200;
    },
    //获取区间随机值
    randomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range);
        return num;
    },
    //显示引导动画
    guideShow() {
        this.guide.active = true;
        let handMove = this.guide.getChildByName('handMove');
        let animCtrl = handMove.getComponent(cc.Animation);
        animCtrl.play('handMove');
    },
    //关闭引导动画
    guideHide() {
        this.guide.active = false;
        let handMove = this.guide.getChildByName('handMove');
        let animCtrl = handMove.getComponent(cc.Animation);
        animCtrl.stop('handMove');
    },
    //开始游戏
    gameStart(){
        cc.director.loadScene("game");
    },
    //游戏结束
    gameOver() {
        this.gameStatus = false;
        this.gameOverMark.active = true;
        this.gameOverMark.getChildByName("score").getComponent(cc.Label).string = "得分：" + this.score.toString();
    }
    
});
module.exports = MainController;