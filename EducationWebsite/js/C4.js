var RED_PLAYER = 1, YELLOW_PLAYER = 2;
var ROWS = 6, COLS = 7;
var R = 50, GAP = 20;
var OFFSET_X = 1.5 * R, OFFSET_Y = 3 * R;

var gameOver, winPlayer;
var board;
var curPlayer = RED_PLAYER;
var lastRow, lastCol;
var victory;

window.onload = function () {
	canvas_frame = document.getElementById("canvas-frame");
	context_frame = canvas_frame.getContext("2d");
	canvas_piece = document.getElementById("canvas-piece");
	context_piece = canvas_piece.getContext("2d");
	context_piece.translate(OFFSET_X, OFFSET_Y);

	context_frame.fillStyle = "whitesmoke";
	context_frame.fillRect(0, 0, canvas_frame.width, canvas_frame.height);
	context_frame.translate(OFFSET_X, OFFSET_Y);
	context_frame.fillStyle = "blue";
	context_frame.fillRect(0, 0, 8 * GAP + 14 * R, 7 * GAP + 12 * R);

	frameSetup();
	boardSetup();
	displayMessage();

	gameOver = false;
	canvas_piece.addEventListener('mousemove', mouseMove, false);
	canvas_piece.addEventListener("mousedown", game, false);
}

function mouseMove(event) {
	if (gameOver)
		return;

	var x = event.x, y = event.y;
	var col = getCol(x);
	var row = getRow(y);

	if (col < 0 || col >= COLS)
		return;
	if (row < 0 || row >= ROWS )
		return;
	if (board[row][col])
		return;

	displayBoard();
	drawPiece(row, col, getPlayerColor());
}

function getCol(x) {
	var col = Math.round((x - GAP - 2 * R) / (GAP + 2 * R));
	return col;
}

function getRow(y) {
	var row = Math.round((y - GAP - 4 * R) / (GAP + 2 * R));
	return row;
}

function game() {
	placeToken(event);
	displayBoard();
	setPieceColor();

	displayMessage();
}

function boardSetup() {
	board = new Array();
	for (var i = 0; i < ROWS; i++) {
		board[i] = new Array();
		for (var j = 0; j < COLS; j++) {
			board[i][j] = 0;
		}
	}
}

function frameSetup() {
	for (var row = 0; row < ROWS; row++)
		for (var col = 0; col < COLS; col++) {
			var x = (col + 1) * GAP + (2 * col + 1) * R;
			var y = (row + 1) * GAP + (2 * row + 1) * R;
			context_frame.fillStyle = "whitesmoke";
			context_frame.beginPath()
			context_frame.arc(x, y, R, 0, 2 * Math.PI, false);
			context_frame.fill();
		}
}

function getPlayerColor() {
	if (curPlayer == RED_PLAYER)
		return "red";
	return "yellow";
}

function setPieceColor() {
	context_piece.fillStyle = getPlayerColor();
}

function displayMessage() {
	if (gameOver) {
		context_piece.clearRect(0, 0, canvas_piece.width, -2 * R);
		messageFormat();
		context_piece.fillText("Wins!    (F5 to restart)", 5.5 * R + 4 * GAP, -0.75 * R);
		canvas_piece.removeEventListener("mousedown", game);
		return;
	}

	setPieceColor();
	messageFormat();
	context_piece.fillText("Move", 5.5 * R + 4 * GAP, -0.75 * R);
}

function messageFormat() {
	context_piece.beginPath();
	context_piece.arc(5 * R + 3 * GAP, -R, R / 2, 0, 2 * Math.PI, false);
	context_piece.fill();
	context_piece.fillStyle = "black";
	context_piece.font = "24pt Arial";
}

function placeToken(event) {
	curCol = Math.floor((event.x - 2 * R) / ((14 * R + 8 * GAP) / 7));
	curRow = Math.floor((event.y - 2 * R) / ((14 * R + 8 * GAP) / 7));
	if (board[curRow][curCol] != 0)
		return;

	for (var i = ROWS - 1; i >= 0; i--) {
		if (board[i][curCol] == 0) {
			board[i][curCol] = curPlayer;
			lastRow = i;
			lastCol = curCol;
			break;
		}
	}

	checkVictory(lastRow, lastCol);
	if (gameOver)
		return;

	curPlayer = (RED_PLAYER + YELLOW_PLAYER) - curPlayer;
}

function displayBoard() {
	clearBoard();
	displayMessage(gameOver);

	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			if (board[i][j] == RED_PLAYER) {
				drawPiece(i, j, "red");
			}
			if (board[i][j] == YELLOW_PLAYER) {
				drawPiece(i, j, "yellow");
			}
		}
	}
}

function clearBoard() {
	context_piece.translate(-OFFSET_X, -OFFSET_Y);
	context_piece.clearRect(0, 0, canvas_piece.width, canvas_piece.height);
	context_piece.translate(OFFSET_X, OFFSET_Y);
}

function drawPiece(row, col, color) {
	var curX = (col + 1) * GAP + (2 * col + 1) * R;
	var curY = (row + 1) * GAP + (2 * row + 1) * R;

	context_piece.fillStyle = color;
	context_piece.beginPath();
	context_piece.arc(curX, curY, R, 0, 2 * Math.PI, false);
	context_piece.fill()
}

function checkVictory(row, col) {
	if (gameOver)
		return;

	gameOver = true;
	winPlayer = curPlayer;

	if (getAdj(row, col, 1, 0) + getAdj(row, col, -1, 0) > 2) { return true; }
	if (getAdj(row, col, 0, 1) + getAdj(row, col, 0, -1) > 2) { return true; }
	if (getAdj(row, col, 1, 1) + getAdj(row, col, -1, -1) > 2) { return true; }
	if (getAdj(row, col, 1, -1) + getAdj(row, col, -1, 1) > 2) { return true; }

	gameOver = false;
	return false;
}

function getAdj(row, col, row_inc, col_inc) {
	if (getVal(row, col) == getVal(row + row_inc, col + col_inc)) {
		return 1 + getAdj(row + row_inc, col + col_inc, row_inc, col_inc);
	} else {
		return 0;
	}
}

function getVal(row, col) {
	if (board[row] == undefined || board[row][col] == undefined) {
		return 0;
	} else {
		return board[row][col];
	}
}
