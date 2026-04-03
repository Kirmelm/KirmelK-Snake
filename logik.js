const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

// Подгон размера
const size = Math.floor(Math.min(window.innerWidth * 0.9, 360) / box) * box;
canvas.width = size;
canvas.height = size;

// Сохранение рекорда
let score = 0;
let best = localStorage.getItem('snakeBest') || 0;
document.getElementById('best').innerText = best;

let snake = [{x: 5*box, y: 5*box}];
let food = { x: 10*box, y: 10*box };
let d = "RIGHT";
let isGameOver = false;

// Клавиатура
document.addEventListener("keydown", e => {
    if(e.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    if(e.key === "ArrowUp" && d !== "DOWN") d = "UP";
    if(e.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    if(e.key === "ArrowDown" && d !== "UP") d = "DOWN";
});

window.setDir = (newD) => {
    if(newD === "LEFT" && d !== "RIGHT") d = "LEFT";
    if(newD === "UP" && d !== "DOWN") d = "UP";
    if(newD === "RIGHT" && d !== "LEFT") d = "RIGHT";
    if(newD === "DOWN" && d !== "UP") d = "DOWN";
};

// Генерация рандомного топа (от 10 до 50)
function generateTop() {
    const names = ["Killer", "Snake_Pro", "Neon_X", "CyberGhost", "Elite_01", "FastBoi", "Shadow", "Mamba", "Alpha", "Zero"];
    const list = names.map(name => ({
        name: name,
        score: Math.floor(Math.random() * 41) + 10 // Рандом от 10 до 50
    })).sort((a,b) => b.score - a.score);

    document.getElementById('leaderList').innerHTML = list.map((it, i) => `
        <div class="row"><span>${i+1}. ${it.name}</span><span>${it.score}</span></div>
    `).join('');
}
generateTop();

function draw() {
    if(isGameOver) return;

    ctx.fillStyle = "#000";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // Сетка
    ctx.strokeStyle = "rgba(0, 242, 254, 0.08)";
    for(let i=0; i<canvas.width; i+=box) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Еда
    ctx.fillStyle = "#ff0844";
    ctx.shadowBlur = 10; ctx.shadowColor = "#ff0844";
    ctx.beginPath(); ctx.arc(food.x+box/2, food.y+box/2, box/3.5, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Змейка (берём 0-й элемент для головы)
    snake.forEach((c, i) => {
        ctx.fillStyle = i === 0 ? "#00f2fe" : "#00a2fe";
        ctx.beginPath();
        ctx.roundRect(c.x+1, c.y+1, box-2, box-2, 5);
        ctx.fill();
    });

    let hX = snake[0].x;
    let hY = snake[0].y;

    if(d === "LEFT") hX -= box;
    if(d === "UP") hY -= box;
    if(d === "RIGHT") hX += box;
    if(d === "DOWN") hY += box;

    if(hX === food.x && hY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = {
            x: Math.floor(Math.random() * (canvas.width/box)) * box,
            y: Math.floor(Math.random() * (canvas.height/box)) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {x: hX, y: hY};

    // Проверка смерти
    if(hX < 0 || hX >= canvas.width || hY < 0 || hY >= canvas.height || snake.some(c => c.x === hX && c.y === hY)) {
        isGameOver = true;
        if(score > best) {
            localStorage.setItem('snakeBest', score);
            alert("НОВЫЙ РЕКОРД: " + score);
        } else {
            alert("ИГРА ОКОНЧЕНА. СЧЕТ: " + score);
        }
        location.reload();
        return;
}

snake.unshift(newHead);
setTimeout(draw, 200);
}

draw();