var iS = 40;
var hitbox = 10;
var game;
var maxX;
var maxY;
var maxT;

var os = [];
var lastId = 0;

var gameInterval;
var enemy = {
    s: 'p',
    p: 'r',
    r: 's'
}

window.onload = function () {
    game = document.getElementById('game');
    maxX = +game.clientWidth;
    maxY = +game.clientHeight;
}


function start() {
    clearInterval(gameInterval);
    os = [];
    game.innerHTML = '';
    maxT = +document.getElementById('team').value;
    for (let i = 0; i < maxT; i++) {
        create('r');
        create('p');
        create('s');
    }

    gameInterval = setInterval(gamef, 16);
}

function gamef() {

    const elR = document.getElementById('rocksize');
    const elP = document.getElementById('papersize');
    const elS = document.getElementById('scissorssize');

    elR.innerHTML = os.filter(r => r.type == 'r').length;
    elP.innerHTML = os.filter(p => p.type == 'p').length;
    elS.innerHTML = os.filter(s => s.type == 's').length;

    for (let o of os) {
        const targets = os.filter(t => t.type != o.type);
        if (targets.length) {
            const distances = [];
            for (let t of targets) {
                const distance = Math.sqrt(Math.pow(t.x - o.x, 2) + Math.pow(t.y - o.y, 2));
                distances.push({
                    d: distance,
                    id: t.id,
                    t: t
                });
            }

            distances.sort((a, b) => a.d - b.d);
            const target = distances[0].t;

            let danger = enemy[target.type] == o.type;

            let mov = 2

            if (danger) {
                mov = -mov;
            } else {
                mov = Math.abs(mov);
            }

            doMove(o, target, mov)

            if (o.x + iS > maxX) {
                o.x = maxX - iS;
                o.image.style.left = o.x + 'px';
            }

            if (o.x < 0) {
                o.x = 0;
                o.image.style.left = o.x + 'px';
            }

            if (o.y + iS > maxY) {
                o.y = maxY - iS;
                o.image.style.top = o.y + 'px';
            }

            if (o.y < 0) {
                o.y = 0;
                o.image.style.top = o.y + 'px';
            }

            if (!danger) {
                if (target.x > (o.x - hitbox) && target.x < (o.x + hitbox)) {
                    if (target.y > (o.y - hitbox) && target.y < (o.y + hitbox)) {
                        target.image.src = o.image.src;
                        target.type = o.type;
                    }
                }
            }
        }
    }
}

function doMove(origin, target, speed) {
    if (target.x > origin.x) {
        origin.x += speed;
        origin.image.style.left = origin.x + 'px';
    }

    if (target.x < origin.x) {
        origin.x -= speed;
        origin.image.style.left = origin.x + 'px';
    }

    if (target.y > origin.y) {
        origin.y += speed;
        origin.image.style.top = origin.y + 'px';
    }

    if (target.y < origin.y) {
        origin.y -= speed;
        origin.image.style.top = origin.y + 'px';
    }
}


function create(type) {
    const y = Math.abs(Math.floor((Math.random() * maxY)) - iS);
    const x = Math.abs(Math.floor((Math.random() * maxX)) - iS);

    const image = getImage(type);

    image.style.width = iS + 'px';
    image.style.height = iS + 'px';
    image.style.position = 'absolute';
    image.style.top = y + 'px';
    image.style.left = x + 'px';
    game.appendChild(image);

    const o = {
        x,
        y,
        image,
        type,
        id: lastId,
    }

    os.push(o);

    lastId++;
}

function getImage(type) {
    const image = new Image();
    image.src = `./${type}.png`;
    return image;
}
