const Gameboard = (function () {
	const rows = 3,
		columns = 3;
	let board;
	let markerCount = 0;
	const resetBoard = () => {
		board = [];
		markerCount = 0;
		for (let i = 0; i < rows; i++) {
			board[i] = [];
			for (let j = 0; j < columns; j++) {
				board[i].push(Cell());
			}
		}
	};

	resetBoard();

	const getBoard = () => board;
	const getMarkerCount = () => markerCount;
	const placeMarker = (player, row, column) => {
		if (board[row][column].getMarker() !== "") {
			DisplayController.displayAlert(
				"Cannot place in already occupied cell!"
			);
		} else {
			board[row][column].addMarker(player.marker);
			markerCount++;
		}
	};

	const getBoardWithMarkers = () =>
		board.map((row) => row.map((cell) => cell.getMarker()));

	return {
		getBoard,
		placeMarker,
		getBoardWithMarkers,
		resetBoard,
		getMarkerCount,
	};
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

	let activePlayer = players[1];
	let gameOver = false;

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
		DisplayController.displayTurn(`${getActivePlayer().name}'s turn.`);
	};

	const getActivePlayer = () => activePlayer;

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
		if (gameOver == true) {
			DisplayController.displayAlert("Game is already over!");
			return;
		}

		Gameboard.placeMarker(getActivePlayer(), row, column);
		DisplayController.updateGameboard();
		if (checkWinner() != undefined) {
			DisplayController.displayAlert(
				`${getActivePlayer().name} wins the game!`
			);
			gameOver = true;
			return;
		} else if (Gameboard.getMarkerCount() === 9) {
			DisplayController.displayAlert("Tie!");
			gameOver = true;
			return;
		}

		switchPlayerTurn();
	};

	switchPlayerTurn();

	return { playRound, getActivePlayer };
}

const DisplayController = (function () {
	const gameboardContainer = document.querySelector(".gameboard-container");
	//renderGameboard
	(() => {
		const board = Gameboard.getBoardWithMarkers();
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				const div = document.createElement("div");
				div.textContent = board[i][j];
				gameboardContainer.appendChild(div);
				div.addEventListener("click", () => {
					game.playRound(i, j);
				});
			}
		}
	})();
	const cells = document.querySelectorAll("div.gameboard-container > div");
	const updateGameboard = () => {
		const board = Gameboard.getBoardWithMarkers();

		let i = 0,
			j = 0;
		for (const cell of cells) {
			cell.textContent = board[i][j];
			if (j < 2) j++;
			else {
				i++;
				j = 0;
			}
		}
	};

	const turn = document.querySelector("p.turn");
	const alert = document.querySelector("p.alert");

	const displayAlert = (text) => {
		alert.textContent = text;
	};

	const displayTurn = (text) => {
		turn.textContent = text;
	};

	return { updateGameboard, displayAlert, displayTurn };
})();

const createGame = (function () {
	const newGameOpenButton = document.querySelector("[data-open-modal]");
	const resetGameButton = document.getElementById("reset-game");
	resetGameButton.hidden = true;
	const newGameModal = document.querySelector("[data-modal]");
	const newGameForm = document.getElementById("chooseNames");
	newGameOpenButton.addEventListener("click", () => {
		newGameModal.showModal();
	});
	newGameForm.addEventListener("submit", (e) => {
		e.preventDefault();
		let playerOne = document.getElementById("player-one");
		let playerTwo = document.getElementById("player-two");

		newGameModal.close();
		newGameOpenButton.hidden = true;
		resetGameButton.hidden = false;
		game = GameController(playerOne.value, playerTwo.value);
		resetGameButton.addEventListener("click", () => {
			game = GameController(playerOne.value, playerTwo.value);
			Gameboard.resetBoard();
			DisplayController.updateGameboard();
			DisplayController.displayAlert();
		});
	});
})();

let game;
