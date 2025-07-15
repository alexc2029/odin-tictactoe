const Gameboard = (function () {
	let board = [];
	const rows = 3,
		columns = 3;
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell());
		}
	}

	const getBoard = () => board;
	const placeMarker = (player, row, column) => {
		if (board[row][column].getMarker() !== "") {
			console.log("Cannot place in already occupied cell");
		} else {
			board[row][column].addMarker(player.marker);
		}
	};

	const getBoardWithMarkers = () =>
		board.map((row) => row.map((cell) => cell.getMarker()));

	const printBoard = () => {
		console.log(getBoardWithMarkers());
	};
	return { getBoard, placeMarker, getBoardWithMarkers, printBoard };
})();

function Cell() {
	let marker = "";
	const addMarker = (playerMarker) => {
		marker = playerMarker;
	};
	const getMarker = () => marker;
	return { addMarker, getMarker };
}

function createPlayer(name, marker) {
	return { name, marker };
}

function GameController(
	playerOneName = "Player One",
	playerTwoName = "Player Two"
) {
	const players = [
		createPlayer(playerOneName, "X"),
		createPlayer(playerTwoName, "O"),
	];

	let activePlayer = players[0];

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		Gameboard.printBoard();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const checkWinner = () => {
		const board = Gameboard.getBoardWithMarkers();
		for (let i = 0; i < board.length; i++) {
			if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
				if (board[i][0] != "") {
					return board[i][0];
				}
			}
			if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
				if (board[0][i] != "") {
					return board[0][i];
				}
			}
		}
		if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
			if (board[0][0] != "") {
				return board[0][0];
			}
		}
		if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
			if (board[0][2] != "") {
				return board[0][2];
			}
		}
	};

	const playRound = (row, column) => {
		console.log(
			`Placing ${getActivePlayer().name}'s ${
				getActivePlayer().marker
			} marker in row ${row} and column ${column}`
		);

		Gameboard.placeMarker(getActivePlayer(), row, column);
		const winner =
			checkWinner() == players[0].marker ? players[0] : players[1];
		if (winner) {
			console.log(`${winner.name} wins the game!`);
			return;
		}

		switchPlayerTurn();
		printNewRound();
	};

	printNewRound();

	return { playRound, getActivePlayer };
}

const game = GameController();
game.playRound(1, 0);
game.playRound(1, 0);
game.playRound(0, 0);
game.playRound(0, 0);
game.playRound(2, 0);
