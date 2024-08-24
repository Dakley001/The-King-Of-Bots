import { AcGameObjects } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObjects {
    constructor(info, gamemap) {
        super();

        this.id = info.id;  // 蛇的id
        this.color = info.color;  // 蛇的颜色
        this.gamemap = gamemap;  // 地图对象

        this.cells = [new Cell(info.r, info.c)];  // cells[0]存放蛇头
        this.next_cell = null;  // 下一步坐标

        this.speed = 5;  // 速度设置为5单位每秒
        this.direction = -1;  // -1表示没有指令，0、1、2、3表示上右下左
        this.status = "idle";  // idle表示静止，move表示正在移动，die表示失败

        // 偏移量
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, 1, 0, -1];

        this.step = 0;  // 记录步数
        this.eps = 1e-2;  // 允许的误差

        this.eye_direction = 0;  // 蛇眼的方向，初始为上，即蓝蛇为上
        if (this.id === 1) this.eye_direction = 2;  // 红蛇初始

        // 蛇眼的位置
        this.eye_dx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
    }

    start() {  // 创建对象时执行
    }

    check_tail_increasing() {  // 判断该回合蛇是否增加长度
        if (this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    set_direction(d) {  // 设置蛇的移动方向
        this.direction = d;
    }

    next_step() {  // 准备下一步操作
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d;
        this.direction = -1;
        this.status = "move";
        this.step++;

        const k = this.cells.length;
        for (let i = k; i > 0; i--) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));  // 浅拷贝
        }
    }

    update_move() {  // 更新移动

        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) {
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = "idle";

            if (!this.check_tail_increasing()) this.cells.pop();  // 去尾
        } else {
            const move_distance = this.speed * this.timedelta / 1000;  // 每两帧走过的距离
            this.cells[0].x += move_distance * dx / distance;  // md × cosθ
            this.cells[0].y += move_distance * dy / distance;  // md × sinθ

            if (!this.check_tail_increasing()) {  // 去尾
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {  // 刷新
        if (this.status === "move") this.update_move();
        // console.log("update snakes");
        this.render();
    }

    render() {  // 渲染
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === "die") {  // 蛇死亡
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) {  // 绘制蛇身（圆球）
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; i++) {  // 绘制蛇身（矩形）
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i++) {  // 绘制蛇眼
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}