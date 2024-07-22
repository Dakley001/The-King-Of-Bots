import { AcGameObjects } from "./AcGameObject.js";
import { Snake } from "./Snake.js";
import { Wall } from "./Wall.js";

export class GameMap extends AcGameObjects {
    constructor(ctx, parent, store) {  // 构造函数
        super();

        this.ctx = ctx;  // canvas组件
        this.parent = parent;  // 父元素div
        this.store = store;  // 全局store

        this.L = 0;  // 地图单格长度

        this.rows = 13;  // 行数
        this.cols = 14;  // 列数

        this.walls = [];  // 墙集合

        this.snakes = [
            new Snake({ id: 0, color: "#4876EC", r: this.rows - 2, c: 1 }, this),
            new Snake({ id: 1, color: "#F94848", r: 1, c: this.cols - 2 }, this),
        ];  // 蛇集合
    }

    create_walls() {  // 根据后端传回来的gamemap创建墙
        const g = this.store.state.pk.gamemap;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }

    add_listening_events() {  // 两种状态监听或获取蛇的移动
        if (this.store.state.record.is_record) {  // 若为查看录像
            let k = 0;

            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;

            const interval_id = setInterval(() => {
                if (k >= a_steps.length - 1) {
                    if (loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if (loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);  // 结束后取消循环
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k++;
            }, 300);  // 每300毫秒执行一次闭包函数
        } else {  // 若为实时对战
            this.ctx.canvas.focus();  // 聚焦，确保键盘输入事件会被捕获并发送到canvas元素

            this.ctx.canvas.addEventListener("keydown", e => {
                let d = -1;

                if (e.key === 'w') d = 0;
                else if (e.key === 'd') d = 1;
                else if (e.key === 's') d = 2;
                else if (e.key === 'a') d = 3;

                if (d >= 0) {  // 通过WebSocket向后端发送移动方向信息
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move",
                        direction: d,
                    }))
                }
            })
        }
    }

    start() {  // 创建对象时执行
        this.create_walls();  // 创建地图墙壁

        this.add_listening_events();  // 开启监听或获取蛇的移动
    }

    update_size() {  // 自适应调整大小
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {  // 检查两条蛇是否都准备移动
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;  // 蛇静止
            if (snake.direction === -1) return false;  // 蛇未移动
        }
        return true;
    }

    next_step() {  // 移动两条蛇
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    update() {  // 刷新
        this.update_size();  // 自适应调整大小
        if (this.check_ready()) {
            this.next_step();  // 两条蛇准备移动则移动
        }
        console.log("upate map");
        this.render();
    }

    render() {  // 渲染
        const color_even = '#AAD751', color_odd = '#A2D149';

        // 绘制地图实现颜色交替，美化
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);  // 绘制基础地图，即无墙地图
            }
        }
    }
}