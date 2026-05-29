export enum Value {
    E = 0,
    S = 1,
    A = 2,
}

export class Snake {
    static dirs: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    R: number = 15;
    C: number = 15;
    
    snakePos: [number, number][]; // snakePos[0] is the head
    currDir = Snake.dirs[3];
    applePos: [number, number];
    score = 0;
    gameOver: boolean = false;

    paused = false;
    timeoutId: number = -1;
    updateFunc: () => void; // the react setState toggle 

    constructor(updateFunc: () => void = () => {}) {
        this.snakePos = [[7, 6], [7, 7], [7, 8]];
        this.applePos = [6, 6];

        this.updateFunc = updateFunc;
    }

    startGame() {
        this.moveSnakeBy1();
    }

    pause() {
        if (this.gameOver) return;
        this.paused = true;
        clearTimeout(this.timeoutId);
        this.updateFunc();
    }

    unpause() {
        if (this.gameOver) return;
        this.paused = false;
        this.moveSnakeBy1();
    }

    isWin(): boolean {
        return this.score === 200;
    }

    isValid(r: number, c: number): boolean {
        return r >= 0 && r < this.R && c >= 0 && c < this.C;
    }

    isSnakeCell(r: number, c: number): boolean {
        return this.snakePos.some(([a, b]) => a === r && b === c);
    }

    modRow(r: number) {
        return (r + this.R) % this.R;
    }

    modCol(c: number) {
        return (c + this.C) % this.C;
    }

    spawnApple() {
        const availablePos = Array.from({ length: this.R * this.C }, (_, i) => i)
            .filter(i => !this.isSnakeCell(Math.floor(i / this.C), i % this.C));
        const idx = Math.floor(Math.random() * availablePos.length);
        const v = availablePos[idx];
        this.applePos = [Math.floor(v / this.C), v % this.C];
        console.log(this.applePos);
    }

    // return true if we can extend the snake else false.
    // if we cannot extend its okay.
    // can extend into apple, but only snakePos[0] can eat apple.
    extendSnake(): boolean {
        // try to extend relative to the snake tail direction (can't explain clearly)
        const lastPos = this.snakePos.at(-1)!;
        const secondLast = this.snakePos.at(-2)!;
        const d = [lastPos[0] - secondLast[0], lastPos[1] - secondLast[1]];

        const p1: [number, number] = [lastPos[0] + d[0], lastPos[1] + d[1]];
        if (this.isValid(p1[0], p1[1]) && !this.isSnakeCell(p1[0], p1[1])) {
            this.snakePos.push(p1);
            return true;
        }

        for (const [dx, dy] of Snake.dirs) {
            const nx = lastPos[0] + dx, ny = lastPos[1] + dy;
            if (this.isValid(nx, ny) && !this.isSnakeCell(nx, ny)) {
                this.snakePos.push([nx, ny]);
                return true;
            }
        }

        return false;
    }

    // if change dir to snakePos[1] we just ignore it
    changeDir(dx: number, dy: number) {
        const pos0 = this.snakePos[0];
        const pos1 = this.snakePos[1];
        const [xx, yy] = [pos1[0] - pos0[0], pos1[1] - pos0[1]];
        if (xx === dx && yy === dy) return;
        
        this.currDir = [dx, dy];
    }

    // want to loop i.e go from col C - 1 to 0
    // this is the main game loop.
    moveSnakeBy1() {
        const head = this.snakePos[0];
        const [nx, ny] = [
            this.modRow(head[0] + this.currDir[0]), 
            this.modCol(head[1] + this.currDir[1]),
        ];
        if (this.isSnakeCell(nx, ny)) {
            this.gameOver = true;
            this.updateFunc();
            return;
        }

        this.snakePos.pop();
        this.snakePos.unshift([nx, ny]);

        if (nx === this.applePos[0] && ny === this.applePos[1]) {
            this.score++;
            if (this.isWin()) {
                this.gameOver = true;
                this.updateFunc();
                return;
            } 
            
            else {
                this.extendSnake(); // if cannot extend whatever
                this.spawnApple();
            } 
        }

        this.updateFunc();
        this.timeoutId = setTimeout(() => this.moveSnakeBy1(), Math.max(500 - 50 * this.score, 200)); 
    }
}