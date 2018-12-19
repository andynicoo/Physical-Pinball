//障碍物类
var Barrier = cc.Class({
    extends: cc.Component,
    properties: () => ({
        lbScore: {
            default: null,
            type: cc.Label
        },
        isAddBuffBall: false,
    }),
    //start
    start() {
        if (this.lbScore) {
            this.lbScore.node.rotation = -this.node.rotation
        }
        this.setScore(this.main.setBarrierScore());
        this.node.color = cc.color(200, this.randomNum(0, 255), this.randomNum(0, 255), 255)

    },
    //获取随机值
    randomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range);
        return num;
    },

    //设置分数
    setScore(score) {
        if (this.lbScore) {
            this.score = score;
            this.lbScore.string = this.score.toString();
        }
    },
    //发生碰撞时
    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.isAddBuffBall) {
            this.main.addBall(this.node.position);
            this.main.removeBarrier(this);
        } else {
            this.main.addScore();
            if (this.score == 1) {
                this.main.removeBarrier(this);
            } else {
                this.setScore(this.score - 1);
                this.main.shake(this);
            }

        }
    }
});
module.exports = Barrier;
