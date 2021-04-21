"use strict";

const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 5,
    stones: 10, // количество препятствий на поле
    winFoodCount: 50,
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getColsCount() < 10 || this.getColsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }

        return result;
    },
};

const map = {
    cells: null,
    usedCells: [],

    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {}; // {x1_y1: td, x1_y2: td}
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');

                this.cells[`x${col}_y${row}`] = td;
                tr.appendChild(td);
            }
        }

    },

    render(snakePointsArray, foodPoint, stonePointsAppay) { //TODO
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, idx) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });

        stonePointsAppay.forEach((point, idx) => {
            const stoneCell = this.cells[`x${point.x}_y${point.y}`];
            stoneCell.classList.add('stone');
            this.usedCells.push(stoneCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);
    }
};

const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,

    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    isOnPoint(point) {
        return this.getBody().some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());
        this.body.pop();
    },

    growUp() {
        const lastBodyIdx = this.body.length - 1;
        const lastBodyPoint = this.body[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint); // {...lastBodyPoint}

        this.body.push(lastBodyPointClone);
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0];

        switch(this.direction) {
            case 'up':
                return {x: firstPoint.x, y: firstPoint.y - 1};
            case 'right':
                return {x: firstPoint.x + 1, y: firstPoint.y};
            case 'down':
                return {x: firstPoint.x, y: firstPoint.y + 1};
            case 'left':
                return {x: firstPoint.x - 1, y: firstPoint.y};
        }
    },

    setDirection(direction) {
        this.direction = direction;
    },
};

/*
// Этот объект я заменил на конструктор, чтобы камни на поле и еда сделать одним классом - все свойства и методы у них одинаковые. Различие будет в том, в каком свойстве объекта игры они будут храниться.
const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};
*/

function UnitOnField(lifetime=null) {
    this.x = null;
    this.y = null;
    this.lifetime = lifetime; // этот параметр нужен только препятствиям, поэтому у еды он будет по умолчанию - null
    this.status = true; // аналогично предыдущему
}
UnitOnField.prototype.getCoordinates = function() {
    return {
        x: this.x,
        y: this.y,
    };
}
UnitOnField.prototype.setCoordinates = function(point) {
    this.x = point.x;
    this.y = point.y;
}
UnitOnField.prototype.isOnPoint = function(point) {
    return this.x === point.x && this.y === point.y;
}
UnitOnField.prototype.ticks = function() { // изменяем состояние препятствий по времени, возвращаем флаг необходимости обновить координаты
// для примера я установил для каждого камня 100 ходов видимости и 100 ходов невидимости. параметры захардкожены, но в принципе их можно вынести в конфиг.
    if (this.lifetime) {
        this.lifetime--;
        if (this.lifetime > 100) { // препятствие включено
            this.status = true;
            return false;
        } else if (this.lifetime > 0) { // препятствие выключено
            this.status = false;
            return false;
        } else { // препятствие снова включено и надо изменить его местоположение
            this.status = true;
            this.lifetime += 200;
            return true;
        }
    }
}

const food = new UnitOnField();

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
    food,
    stones: [], // сюда будем сладывать препятствия
    status,
    count: 0, // это наш счетчик
    countviewer: null,
    tickInterval: null,

    init(userSettings = {}) {
        this.config.init(userSettings);
        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());
        
        for (let sc = 0; sc < this.config.settings.stones; sc++) { // генерируем препятствия в заданном количестве
            this.stones.push(new UnitOnField(sc * 10 + 150)); // каждое препятствие имеет время жизни (со сдвигом на 10 ходов)
        }
        
        this.countviewer = document.getElementById('count'); // связываем счетчик и блок вывода

        this.setEventHandlers();
        this.reset();
    },

    reset() {
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up');
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.stones.forEach(item => item.setCoordinates(this.getRandomFreeCoordinates())); // генерим стартовые координаты камней
        this.count = 0; // обнуляем счет при перезапуске игры
        this.render();
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            }
        ];
    },
    
    getStoneMap() { // получаем координаты препятствий, но только видимых
        let arr = [];
        this.stones.forEach(item => {
            if (item.status) arr.push(item.getCoordinates());
        })
        return arr;
    },

    stoneHere(point) { // проверяем, находится ли в указанной точке хоть какой-то из включенных камней
        return this.stones.some(stone => stone.isOnPoint(point) && stone.status);
    },

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.getStoneMap(), ...this.snake.getBody()]; // здесь добавлены координаты препятствий

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра закончена', true);
    },

    setPlayButton(textContents, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = textContents;
        isDisabled
            ? playButton.classList.add('disabled')
            : playButton.classList.remove('disabled');
    },

    tickHandler() {
        if (!this.canMakeStep()) {
            return this.finish();
        }

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            this.count++; // Здесь мы изменяем счетчик при съедании еды
            this.food.setCoordinates(this.getRandomFreeCoordinates());

            if (this.isGameWon()) this.finish();
        }

        this.stones.forEach(item => { // ход камней. если камень ожил, генерим ему новые координаты
            if (item.ticks()) item.setCoordinates(this.getRandomFreeCoordinates());
        })

        this.snake.makeStep();
        this.render();
    },

    canMakeStep() { // добавлена проверка на столконовение с камнем
        const nextHeadPoint = this.snake.getNextStepHeadPoint();

        return !this.snake.isOnPoint(nextHeadPoint) && !this.stoneHere(nextHeadPoint) &&
            nextHeadPoint.x < this.config.getColsCount() &&
            nextHeadPoint.y < this.config.getRowsCount() &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0;
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) this.snake.setDirection(direction);
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
        }
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.getStoneMap());
        this.countviewer.innerText = this.count; // выводим текущее значение счетчика
    }
};

// Можно было бы тут врезать ввод пользовательских параметров с проверкой валидности, но я ограничусь фиксированными значениями
let userSpeed = 2;
let userCount = 10;
let userStones = 5;
game.init({speed: userSpeed, stones: userStones, winFoodCount: userCount});
