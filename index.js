let field = document.querySelector('.field');
let timer = document.querySelector('.timer');
let moves = document.querySelector('.moves');
let pause = document.querySelector('.pause')


let fieldMasGame, noneBlock, moveCount, time, difficult = 3;

function StartNewGame(size = 3, m = 0, t = 0, mas = [], block = [size - 1, size - 1]) {
    moveCount = m;
    time = t;
    fieldMasGame = mas;
    noneBlock = block;
    if(t==0)
        newGame(size);
    timerGame();
    drawField(size);
}

function newGame(size) {
    fieldMas = Array(size ** 2 - 1).fill(1).map((v, i) => i + 1);
    shuffle(fieldMas);
    let a = [];
    fieldMas.map((elem, i) => {
        if (i % size == 0 && i != 0) {
            fieldMasGame.push(a);
            a = [];
        }
        a.push(elem);
    })
    a.push('');
    fieldMasGame.push(a);
}

function clearField()
{
    let menu = field.firstElementChild;
    while (field.firstElementChild) {
        field.firstChild.remove();
    }
    field.appendChild(menu);
    document.querySelector('.menu').style.display = 'none';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function drawField(size) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let box = document.createElement('div');
            box.classList.add('box');
            box.style.height = 500 / size + 'px';
            box.style.width = 500 / size + 'px';
            box.setAttribute('data-index', i + "_" + j);
            box.innerHTML = fieldMasGame[i][j];
            field.appendChild(box);
        }
    }
    document.querySelector(`[data-index='${noneBlock[0] + "_" + noneBlock[1]}']`).classList.add('noneBox');
}

field.addEventListener('click', (e) => {
    if (e.target.dataset.index) {
        let cl = e.target.dataset.index;
        let index = cl.split('_');
        check(index);
    }
})

function check([i, j]) {
    let b;
    let [noneI, noneJ] = noneBlock;
    if (noneI == i) {
        if (j == +noneJ + 1 || j == +noneJ - 1) {
            changeIndex(i, j, noneI, noneJ)
        }
    }
    if (noneJ == j) {
        if (i == +noneI + 1 || i == +noneI - 1) {
            changeIndex(i, j, noneI, noneJ)
        }
    }
}

function move(i, j, Ni, Nj) {
    let temp1 = document.querySelector(`[data-index='${i + "_" + j}']`);
    let temp2 = document.querySelector(`[data-index='${Ni + "_" + Nj}']`);
    temp2.classList.toggle('noneBox');
    temp2.innerHTML = temp1.innerHTML;
    temp1.innerHTML = '';
    temp1.classList.add('noneBox');
}

function changeIndex(i, j, noneI, noneJ) {
    move(i, j, noneI, noneJ);
    b = fieldMasGame[i][j];
    fieldMasGame[i][j] = "";
    fieldMasGame[noneI][noneJ] = b;
    noneBlock = [i, j];
    moves.innerHTML = "Moves " + (++moveCount);
    if (checkWin()) {
        alert('Win');
    }
}

function checkWin() {
    let win = true;
    let t = fieldMasGame.flat();
    if (t.indexOf('') != t.length - 1)
        return false;
    for (let i = 0; i < t.length - 2; i++)
        if (t[i] > t[i + 1]) {
            win = false;
            break;
        }
    return win;
}
let timerid;
document.querySelector('.menu').addEventListener('click', (e) => {
    if (e.target.dataset.menuitem) {
        menubar(e.target.dataset.menuitem);
    }
});

pause.addEventListener('click', () => {
    document.querySelector('.menu').style.display = 'block';
    clearInterval(timerid);
})

function timerGame() {
    timerid = setInterval(() => {
        timer.innerHTML = "Time " + (++time)
    }, 1000)
}


function menubar(num) {
    if (num == 1) {
        timerGame();
        document.querySelector('.menu').style.display = 'none';
    }
    if (num == 2) {
        clearField();
        timer.innerHTML = "Time " + 0;
        moves.innerHTML = "Moves " + 0;
        StartNewGame(difficult);
    }
    if (num == 3) {
        let menu = document.querySelector('.menu').firstElementChild;
        document.querySelector('.menu').firstElementChild.remove();
        let s = document.createElement('select');
        let btn = document.createElement('button');
        s.options[0] = new Option("выберите сложность", "3");
        s.options[1] = new Option("3/3", "3");
        s.options[2] = new Option("4/4", "4");
        s.options[3] = new Option("5/5", "5");
        s.options[4] = new Option("6/6", "6");
        s.options[5] = new Option("7/7", "7");
        s.options[6] = new Option("8/8", "8");
        document.querySelector('.menu').appendChild(s);
        btn.innerHTML = "GoBack";
        document.querySelector('.menu').appendChild(btn);
        s.addEventListener('change', () => {
            difficult = s.value;
        })
        btn.addEventListener('click', () => {
            document.querySelector('.menu').firstElementChild.remove();
            document.querySelector('.menu').firstElementChild.remove();
            document.querySelector('.menu').appendChild(menu);
        })
    }
    if (num == 4) {
        let saveobj =
        {
            size: difficult,
            move: moveCount,
            time: time,
            field: fieldMasGame,
            block: noneBlock
        }
        let savelocal = JSON.stringify(saveobj);
        localStorage.setItem(new Date().getTime(), savelocal);
    }
    if (num == 5) {
        let menu = document.querySelector('.menu').firstElementChild;
        document.querySelector('.menu').firstElementChild.remove();
        let div = document.createElement('div');
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let a = document.createElement('button');
            a.innerHTML = key;
            div.appendChild(a);
        }
        document.querySelector('.menu').appendChild(div);
        div.addEventListener('click', (e) => {
            div.remove();
            document.querySelector('.menu').appendChild(menu);
            let download= JSON.parse(localStorage.getItem(e.target.innerHTML));
            clearField();
            timer.innerHTML = "Time " + download.time;
            moves.innerHTML = "Moves " + download.move;
            StartNewGame(download.size,download.move,download.time,download.field,download.block);
        })
    }
}
StartNewGame();
