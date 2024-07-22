import { AcGameObjects } from "./AcGameObject";

export class Wall extends AcGameObjects {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#B37226";
    }

    update() {  // 刷新
        console.log("update walls");
        this.render();
    }

    render() {  // 渲染
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}