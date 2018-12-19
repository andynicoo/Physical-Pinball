//小球类
var Config = require("./Config");
var Ball = cc.Class({
    extends: cc.Component,
    properties: () => ({
        rigidBody: {
            type: cc.RigidBody,
            default: null
        },
        isTouchedGround: false
    }),
    //加载完成
    onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.collider = this.getComponent(cc.Collider);
    },
    //更新
    update(dt) {
        if (this.isTouchedGround) {
            this.rigidBody.active = false
            this.rigidBody.linearVelocity = cc.Vec2.ZERO;
            //记录路径点
            let pathPos = [];
            pathPos.push(this.node.position);
            pathPos.push(cc.v2(349, -498))
            pathPos.push(cc.v2(338, 608))
            pathPos.push(cc.v2(162, 557))

            this.node.runAction(cc.sequence(
                cc.cardinalSplineTo(1, pathPos, 0.9),
                cc.callFunc(function () {
                    this.rigidBody.active = true;
                    this.node.group = Config.groupBallInRecycle;
                    this.main.recycleBall();
                }.bind(this))
            ))
            this.isTouchedGround = false;
        }

    },
    //小球发生碰撞时
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'ground') {
            this.isTouchedGround = true;
        }
    }
});

module.exports = Ball;
