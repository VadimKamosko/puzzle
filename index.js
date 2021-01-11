let field = document.querySelector('.field');


let fieldMasGame = [];
let noneBlock;

function StartNewGame(size) {
    noneBlock = [size - 1, size - 1];
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
    drawField(size);
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
    field.lastChild.classList.add('noneBox');
}

field.addEventListener('click', (e) => {
    let cl = e.target.dataset.index;
    let index = cl.split('_');
    check(index);
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
    if(checkWin())
    {
        alert('Win');
    }
}

function checkWin() {
    let win = true;
    let t = fieldMasGame.flat();
    if(t.indexOf('')!=t.length-1)
        return false;
    for (let i = 0; i < t.length - 2; i++)
        if (t[i] > t[i + 1]) {
            win = false;
            break;
        }
    return win;
}

StartNewGame(3);
