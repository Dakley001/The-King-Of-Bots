const AC_GAME_OBJECTS = [];  // 绘制物体集合

export class AcGameObjects {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.timedelta = 0;  // 时间间隔
        this.has_called_start = false;  // 该对象是否启动
    }

    start() {  // 只执行一次
    }

    update() {  // 每一帧执行一次，除了第一帧之外
    }

    on_destroy() {  // 删除之前执行
    }

    destroy() {
        this.on_destroy();  // 删除前执行

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp;  // 上一次执行的时刻
const step = timestamp => {
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step);
}

// 通常用于在浏览器中实现动画效果，通过定时请求浏览器在下一次重绘之前调用一个指定的函数，在本项目中基类AcGameObject负责管理动画循环
requestAnimationFrame(step);