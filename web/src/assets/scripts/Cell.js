export class Cell {
    constructor(r, c) {
        this.r = r;  // 行数
        this.c = c;  // 列数

        this.x = c + 0.5;  // 中心坐标x
        this.y = r + 0.5;  // 中心坐标y
    }
}