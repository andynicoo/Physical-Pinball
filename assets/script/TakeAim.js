//瞄准线 控制类
cc.Class({
    extends: cc.Component,
    properties: () => ({
        arraw: cc.Sprite,
    }),
    //加载完成
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },
    //触摸移动操作，射线瞄准
    onTouchMove(touch) {
        if(!this.node.main.isRecycleFinished()){
            return;
        }
        let origin = cc.v2(0, 446);  //射线原点坐标
        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);

        if (touchPos.y > origin.y) {
            return;
        }

        let graphics = this.node.getComponent(cc.Graphics);
        let line = touchPos.sub(origin);
        let length = 40;
        let lineLength = line.mag();    //获得这个向量的长度
        let increment = line.normalize().mul(length); //根据每条线段的长度获得一个增量向量
        let pos = origin.clone(); //临时变量

        graphics.fillColor = cc.color(255, 255, 255, 150);
        pos.addSelf(increment);
        pos.addSelf(increment);
        graphics.clear();

        //只要线段长度还大于每条线段的长度
        while (lineLength > length) {
            graphics.circle(pos.x, pos.y, 5);
            graphics.fill();
            pos.addSelf(increment);
            lineLength -= length;
        }

        var dis = origin.sub(touchPos)
        var angle = Math.atan2(dis.y, dis.x) / Math.PI * 180;
        this.arraw.node.rotation = -angle;
    }
})
