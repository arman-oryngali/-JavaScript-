let scoreBlock; //для отображение очков
let score = 0; //очки

const config = { //настройки игры
	step: 0,
	maxStep: 6, //чтобы пропускать игровой цикл
	sizeCell: 16, //размер одной ящейки
	sizeBerry: 16 / 4 //размер ягоды
}

const snake = { //все про змейку
	x: 160,
	y: 160, //х,у координаты
	dx: config.sizeCell,
	dy: 0, //это скорость повертикали и погоризонтали
	tails: [], //массив ящейки
	maxTails: 3
}

let berry = {
	x: 0,
	y: 0 //координаты ягоды
} 


let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
drawScore();

function gameLoop() {

	requestAnimationFrame( gameLoop ); //игровой цикл и игра будет 
	if ( ++config.step < config.maxStep) {
		return;
	}
	config.step = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawBerry();
	drawSnake();
}
requestAnimationFrame( gameLoop );

function drawSnake() {
	snake.x += snake.dx;
	snake.y += snake.dy;

	collisionBorder();

	// todo бордер
	snake.tails.unshift( { x: snake.x, y: snake.y } );

	if ( snake.tails.length > snake.maxTails ) {
		snake.tails.pop();
	}

	snake.tails.forEach( function(el, index){
		if (index == 0) {
			context.fillStyle = "#FA0556"; //голова змейки
		} else {
			context.fillStyle = "#A00034"; //тело змейки
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

		if ( el.x === berry.x && el.y === berry.y ) { //чтобы увеличивать хвост змейки и очки
			snake.maxTails++;
			incScore();
			randomPositionBerry();
		}

		for( let i = index + 1; i < snake.tails.length; i++ ) {

			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) {
				refreshGame(); //чтобы запускать заново
			}

		}

	} );
}

function collisionBorder() { //чтобы змейка из другого края, в другой переходил
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
}
function refreshGame() {
	score = 0;
	drawScore();

	snake.x = 160;
	snake.y = 160;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;

	randomPositionBerry();
}

function drawBerry() { //чтобы ягоды на уровень
	context.beginPath();
	context.fillStyle = "#A00034";
	context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI );
	context.fill();
}

function randomPositionBerry() { //координат для ягоды
	berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
	berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function incScore() { //увеличивает очки 
	score++;
	drawScore();
}

function drawScore() { //отображает очки на странице
	scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) { //рандом
	return Math.floor( Math.random() * (max - min) + min );
}

document.addEventListener("keydown", function (e) { //управление
	if ( e.code == "KeyW" ) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyA" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "KeyS" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyD" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});