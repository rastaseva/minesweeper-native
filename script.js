const smiley = document.querySelector('.container_header_smiley-Btn');
const minefield = document.querySelector('.container_minefield');

let appendBombs = document.querySelector('.container_header_counter_img_2');
let appendTensBombs = document.querySelector(".container_header_counter_img_1");
let appendHundredsBombs = document.querySelector(".container_header_counter_img_0");

let appendSeconds = document.querySelector('.container_header_timer_img_2');
let appendTensSeconds = document.querySelector(".container_header_timer_img_1");
let appendHundredsSeconds = document.querySelector(".container_header_timer_img_0");




smiley.addEventListener('mousedown', () => {
    smiley.style.background = "url('sprites/minesweeper-sprites_smiley(clicked).jpg')"
});
smiley.addEventListener('mouseup', () => {
    smiley.style.background = "url('sprites/minesweeper-sprites_smiley.jpg')"
});
smiley.addEventListener('click', restart);

minefield.addEventListener('mousedown', () => {
    smiley.style.background = "url('sprites/minesweeper-sprites_smiley(field-clicked).jpg')"
});
minefield.addEventListener('mouseup', () => {
    smiley.style.background = "url('sprites/minesweeper-sprites_smiley.jpg')"
});
let mins = '00';
let seconds = '00';
let tens = '00';

let Interval;

minefield.onclick = start;
minefield.oncontextmenu = start;

function start() {
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10)
}

function startTimer() {
    tens++;
    if (tens > 99) {
        seconds++;
        appendSeconds.setAttribute('src', `sprites/minesweeper-sprites_${seconds}.jpg`);
        tens = 0;
    }
    if (seconds > 9) {
        const tens = seconds.toString().split('');
        appendSeconds.setAttribute('src', `sprites/minesweeper-sprites_${tens[1]}.jpg`);
        appendTensSeconds.setAttribute('src', `sprites/minesweeper-sprites_${tens[0]}.jpg`);
    }
    if (seconds > 99) {
        const hundreds = seconds.toString().split('');
        appendSeconds.setAttribute('src', `sprites/minesweeper-sprites_${hundreds[2]}.jpg`);
        appendTensSeconds.setAttribute('src', `sprites/minesweeper-sprites_${hundreds[1]}.jpg`);
        appendHundredsSeconds.setAttribute('src', `sprites/minesweeper-sprites_${hundreds[0]}.jpg`);

    }
}

function gameOver() {
    smiley.style.background = "url('sprites/minesweeper-sprites_smiley-lose.jpg')";
    minefield.style['pointer-events'] = 'none';
    clearInterval(Interval);
}

function restart() {
    location.reload();
    minefield.style['pointer-events'] = 'auto';
    return;
}

function startMinesweeper(width, height, bombQuantity) {

    let bombsLeftCount = bombQuantity;
    const cellsCount = width * height;
    minefield.innerHTML = '<button></button>'.repeat(cellsCount);
    const cells = [...minefield.children];

    let cellsLeftCounter = cellsCount;

    minefield.addEventListener('click', (ev) => {
        if (ev.target.tagName !== 'BUTTON') {
            return;
        }

        const index = cells.indexOf(ev.target);
        const column = index % width;
        const row = Math.floor(index / width);

        function firstMoveValidator() {
            if (this.isRun) {
                return false
            }
            for (let bomb of bombs) {
                if (index === bomb) {
                    const bombsAfterFirstMove = bombs.splice(bombs.indexOf(bomb), 1, bomb += 1);
                }
            }

            this.isRun = true;
        }
        firstMoveValidator()
        clickCell(row, column)

    });

    minefield.addEventListener('contextmenu', (ev) => {
        if (ev.target.tagName !== 'BUTTON') {
            return;
        }
        ev.preventDefault();
        markMine(ev);
        return;
    });

    const bombs = [...Array(cellsCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, bombQuantity);

    function clickCell(row, column) {

        if (!cellValidator(row, column)) return;

        let index = row * width + column;
        const cell = cells[index];


        if (cell.disabled === true) return;

        cell.disabled = true;

        cell.style.background = "url('sprites/minesweeper-sprites_cell(clicked).jpg')";


        if (bombCheck(row, column)) {
            for (let bomb of bombs) {
                if (cells[bomb].style.background !== 'url("sprites/minesweeper-sprites_mine(defused).jpg")') {
                    cells[bomb].style.background = "url('sprites/minesweeper-sprites_bomb(shown).jpg')";
                }

            }
            cell.style.background = "url('sprites/minesweeper-sprites_bomb(dead).jpg')";
            gameOver();
            return;
        }

        cellsLeftCounter--;

        if (cellsLeftCounter === bombQuantity) {
            smiley.style.background = "url('sprites/minesweeper-sprites_smiley-win.jpg')"
            minefield.style['pointer-events'] = 'none';
            clearInterval(Interval);
            return;
        }

        const count = getMineCount(row, column);

        if (count !== 0) {
            cell.style.background = `url('sprites/minesweeper-sprites_${count}(mine).jpg')`;
            return;
        }
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                clickCell(row + j, column + i)
            }
        }

        function cellValidator(row, column) {
            return row >= 0 &&
                row < height &&
                column >= 0 &&
                column < width
        };



        function bombCheck(row, column) {
            const index = row * width + column;
            return bombs.includes(index)
        };

        function getMineCount(row, column) {
            let count = 0
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (bombCheck(row + j, column + i)) {
                        count++
                    }
                }
            }
            return count;
        };
    }



    function markMine(cell) {
        if (cell.target.style.background === 'url("sprites/minesweeper-sprites_mine(question).jpg")') {

            cell.target.style.background = 'url("sprites/minesweeper-sprites_cell.jpg")'
            bombsLeftCount++;
            const bombsLeftString = bombsLeftCount.toString().split('');
            appendBombs.setAttribute('src', `sprites/minesweeper-sprites_${bombsLeftString[1]}.jpg`);
            appendTensBombs.setAttribute('src', `sprites/minesweeper-sprites_${bombsLeftString[0]}.jpg`);
            return;
        }
        if (!cell.target.disabled && cell.target.style.background === "" ||
            cell.target.style.background === 'url("sprites/minesweeper-sprites_cell.jpg")') {

            bombsLeftCount--;
            const bombsLeftString = bombsLeftCount.toString().split('');
            appendBombs.setAttribute('src', `sprites/minesweeper-sprites_${bombsLeftString[1]}.jpg`);
            appendTensBombs.setAttribute('src', `sprites/minesweeper-sprites_${bombsLeftString[0]}.jpg`);
            if (bombsLeftCount < 10) {
                appendBombs.setAttribute('src', `sprites/minesweeper-sprites_${bombsLeftString[0]}.jpg`);
                appendTensBombs.setAttribute('src', 'sprites/minesweeper-sprites_0.jpg');
            }
            if (bombsLeftCount <= 0) {
                appendBombs.setAttribute('src', 'sprites/minesweeper-sprites_0.jpg');
            }
            cell.target.style.background = 'url("sprites/minesweeper-sprites_mine(defused).jpg")';
            return;
        }
        if (cell.target.style.background === 'url("sprites/minesweeper-sprites_mine(defused).jpg")') {
            cell.target.style.background = 'url("sprites/minesweeper-sprites_mine(question).jpg")';
            return;
        }
    }
    clearInterval(Interval);

};

startMinesweeper(16, 16, 40);