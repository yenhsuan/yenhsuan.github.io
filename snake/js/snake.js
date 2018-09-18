class Snake {
    constructor(frameSpeed, mapRowSize, mapColSize) {
        let canvas = document.getElementById("gameCanvas");
        this.ctx= canvas.getContext("2d");

        this.frameSpeed = frameSpeed || 125; // (ms)
        this.mapRowSize = mapRowSize || 20;  // (px)
        this.mapColSize = mapColSize || 20;  // (px)

        this.mapRowNum = Math.floor(canvas.height / this.mapRowSize);
        this.mapColNum = Math.floor(canvas.width / this.mapColSize);

        this.snakeColor = '#4285f4';
        this.foodColor = '#34a853';
        this.bgColor = '#f2f2f2';
        this.snakeHeadColor = '#fbbc05';
        this.fontColor = '#555755';

        this.foodEaten = 0;
        this.snakeLoc = [];
        this.foodLoc = [];
        this.moveOnRow = 0;
        this.moveOnCol = 0;
        this.currentKey = 39;
        this.gameController = null;

        this.gamePause = false;
        this.isEndGame = false;
        this.isGameStarted = false;
        this.bindKeyEvents();
        this.drawStartMsg();
    }

    bindKeyEvents() {
        document.body.addEventListener("keydown", (e) => {

            const keycode = e.keyCode;
            if (keycode == 32) {
                e.preventDefault();
                if (this.isEndGame == true) {
                    this.isEndGame = false;
                    this.initGame();
                    return;
                }

                if (this.isGameStarted == false) {
                    this.initGame();
                    return;
                }

                if (this.gamePause == false) {
                    this.gamePause = true;
                    clearInterval(this.gameController);
                } else {
                    this.gamePause = false;
                    this.gameController = setInterval( () => { this.snakeMoves() }, this.frameSpeed);
                }
            } else if (this.isGameStarted && !this.gamePause && !this.isEndGame && keycode >= 37 && keycode <=40){
                e.preventDefault();
                this.currentKey = keycode;
            }
            return false;  
        });
    }

    initGame() {
        this.clearCanvas();
        this.createSnake();
        this.createFood();
        this.isGameStarted = true;
        this.gameController = setInterval( () => { this.snakeMoves() }, this.frameSpeed);
    }

    restartGame() {
        clearInterval(this.gameController);
        this.resetGameState();
        this.initGame()
    }

    resetGameState() {
        this.currentKey = 39;
        this.moveOnRow = 0;
        this.moveOnCol = 0;
        this.gamePause = false;
        this.foodEaten = 0;
        this.gamePause = false;
        this.isEndGame = false;
        this.isGameStarted = false;
    }

    createSnake() {
        this.snakeLoc = [];
        // default length:4, from (10,4) to (10,7)
        this.snakeLoc.push([10,7]);
        this.snakeLoc.push([10,6]);
        this.snakeLoc.push([10,5]);
        this.snakeLoc.push([10,4]);

        for (let i = 0; i < this.snakeLoc.length; i++) {
            this.drawPoint(this.snakeLoc[i][0], this.snakeLoc[i][1], this.snakeColor);
        }
    }

    createFood() {
        let randomLoc;
        do {
            randomLoc = Math.floor(Math.random() * (this.mapRowNum * this.mapColNum));
        } while (this.isPointOnSnake(Math.floor(randomLoc / this.mapRowNum), randomLoc % this.mapColNum));

        this.foodLoc[0] = Math.floor(randomLoc / this.mapRowNum);
        this.foodLoc[1] = randomLoc % this.mapColNum;
        this.drawPoint(this.foodLoc[0], this.foodLoc[1], this.foodColor);
    }

    isPointOnSnake(r, c) {
        const snakeLoc = this.snakeLoc;
        for (let i = 0; i < snakeLoc.length; i++) {
            if (snakeLoc[i][0] == r && snakeLoc[i][1] == c) {
                return true;
            }
        }
        return false;
    }

    isPointOutOfMap(r, c) {
        return !(r >= 0 && r < this.mapRowNum && c >= 0 && c < this.mapColNum);
    }

    snakeMoves() {
        let snakeHeadRowIdx = this.snakeLoc[0][0];
        let snakeHeadColIdx = this.snakeLoc[0][1];

        if (this.currentKey == 37) {
            if (this.moveOnCol != 1) {
                this.moveOnCol = -1;
                this.moveOnRow = 0;
            }
        } else if (this.currentKey == 38) {
            if (this.moveOnRow != 1) {
                this.moveOnCol = 0;
                this.moveOnRow = -1;
            }
        } else if (this.currentKey == 39) {
            if (this.moveOnCol != -1) {
                this.moveOnCol = 1;
                this.moveOnRow = 0;
            }
        } else if (this.currentKey == 40) {
            if (this.moveOnRow != -1) {
                this.moveOnCol = 0;
                this.moveOnRow = 1;
            }
        }

        snakeHeadRowIdx += this.moveOnRow;
        snakeHeadColIdx += this.moveOnCol;

        if (snakeHeadRowIdx == this.foodLoc[0] && snakeHeadColIdx == this.foodLoc[1]) {
            this.snakeLoc.unshift([snakeHeadRowIdx, snakeHeadColIdx]);
            this.foodEaten++;
            this.createFood();
        } else if (!this.isPointOnSnake(snakeHeadRowIdx, snakeHeadColIdx) && !this.isPointOutOfMap(snakeHeadRowIdx, snakeHeadColIdx)) {
            const removedPoint = this.snakeLoc.pop();
            this.drawPoint(removedPoint[0], removedPoint[1], this.bgColor);
            this.snakeLoc.unshift([snakeHeadRowIdx, snakeHeadColIdx]);
        } else {
            clearInterval(this.gameController);
            this.isEndGame = true;
            this.endGame();
            return;    
        }
        this.drawPoint(snakeHeadRowIdx, snakeHeadColIdx, this.snakeHeadColor);
        this.drawPoint(this.snakeLoc[1][0], this.snakeLoc[1][1], this.snakeColor);
    }

    endGame() {
        this.clearCanvas();
        this.drawEndGameInfo();
        this.resetGameState();
    }

    clearCanvas() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.mapRowSize * this.mapRowNum, this.mapColSize * this.mapColNum);
    }

    drawPoint(r, c ,color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.mapColSize * c + 1, this.mapRowSize * r + 1, this.mapColSize - 2, this.mapRowSize - 2);
    }

    drawStartMsg() {
        this.clearCanvas();
        this.ctx.font = "bold 16px monospace";
        this.ctx.fillStyle = this.fontColor;
        this.ctx.textAlign="center";
        this.ctx.fillText("Press Space to START",this.mapRowSize * this.mapRowNum / 2, this.mapColSize * this.mapColNum / 2);
    }

    drawEndGameInfo() {
        this.ctx.font = "bold 16px monospace";
        this.ctx.fillStyle = this.fontColor;
        this.ctx.textAlign="center";
        this.ctx.fillText("GAME OVER",this.mapRowSize * this.mapRowNum / 2, this.mapColSize * this.mapColNum / 2 + 20);
        this.ctx.fillText("Press Space to RESTART...",this.mapRowSize * this.mapRowNum / 2, this.mapColSize * this.mapColNum / 2 + 40);
    
        this.ctx.font = "bold 48px monospace";
        this.ctx.fillStyle = this.fontColor;
        this.ctx.textAlign="center";
        this.ctx.fillText('Score:' + this.foodEaten,this.mapRowSize * this.mapRowNum / 2, this.mapColSize * this.mapColNum / 2 - 20);
    }
}