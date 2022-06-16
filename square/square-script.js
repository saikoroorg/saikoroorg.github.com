/* SQUARE User App Script. */

// Namespace.
var square = square || {};

/* VERSION/ *****************************/
square.version = "0.8.72b";
square.timestamp = "20616";
/************************************* /VERSION*/

// Global variables.
var rolling = -1; // Running counter.

// Board grid parameters.
var counts = 6; // Grid counts.
var pattern = 1; // Grid pattern. (Even->0:Chess, Odd->1:Goban)

function squarePattern() {
	pattern = pattern > 0 ? 0 : 1;
	rolling = -1;
};

function squareCounts(x) {
	counts = (counts + x > 18) ? 18 : (counts + x < 1) ? 1 : counts + x;
	rolling = -1;
};

// Main loop.
(async()=>{

	var buffer = null; // Original design canvas.
	var bufferSpriteWidth = 0;

	// Query parameters.
	//  McN/S   : M = Hand card maximum, N = Deck card maximum, S = Suit counts.
	//  &r=1234 = Random seed, p
	//  &p=1/3  = Deck sharing identifier.
	//  &n1~n13 = Card face number design.
	//  &f1~f4  = Card face design.
	//  &f5     = Card face dummy/joker design.
	//  &f6     = Card back design.
	//  &c1~c6  = Color palette.
	var keys = cubeParamKeys();

	// BACK:  f21f31f41f51f61f71f81f22f42f62f82f23f33f53f73f83f24f44f64f84f25f35f55f75f85f26f46f66f86f27f37f57f77f87f28f48f68f88f29f39f49f59f69f79f89
	// SPADE: c53c44c54c64c35c45c55c65c75c36c46c56c66c76c47c57c67
	// HEART: a43a63a34a44a54a64a74a35a45a55a65a75a46a56a66a57
	// DIAM:  d53d44d54d64d35d45d55d65d75d46d56d66d57  
	// CLUB:  b43b53b63b44b54b64b35b45b55b65b75b36b46b56b66b76b57
	// JOKER: e33e73e44e54e64e45e55e65e46e56e66e37e77
	// JACK:  f53f63f64f65f46f66f57f67
	// QUEEN: f43f53f63f44f64f45f65f46f56f67
	// KING:  f43f63f44f64f45f55f46f66f47f67
	// COLOR: fff d66 6b6 66d bb4 888 000

	// BACK:  e21081e29089e22028e82088e42e62e33e53e73e44e64e35e55e75e46e66e37e57e77e48e68
	// SPADE: c44067c35076c53054
	// HEART: a44066a34075a43044a63064a56057
	// DIAM:  d44066d53057d35075  
	// CLUB:  b43066b54057b35076
	// JOKER: e33e73e44066e37e77
	// JACK:  f53f63067f46f57
	// QUEEN: f43063f43046f63065f5
	// KING:  f43047f63064f66067f55
	// COLOR: d66 6b6 66d bb4 888 000

	// Example 1: Playing cards with 2-10,J,Q,K,A.
	// 5c52&n0=g21089&n1=f53f44047f64067f56&n2=f43063f64f45065f46f47067&n3=f43063f45065f47067f63067&n4=f43045f45065f63067&n5=f43063f44f45065f66f47067&n6=f43063f43047f45065f66f47067&n7=f43063f44f63067&n8=f43063f43047f55f63067f47067&n9=f43063f43045f45065f64067f47067&n10=f33037f53073f53057f73077f57077&n11=f53f63067f46f57&n12=f43063f43046f63065f56f67&n13=f43047f63064f66067f55&c1=d66&c2=6b6&c3=66d&c4=bb4&c5=888&c6=000&c7=fff

	// Example 2: Playing cards with 4 suits.
	// 5c52&n0=g21089&n1=c44067c35076c53054&n2=a44066a34075a43044a63064a56057&n3=d44066d53057d35075&n4=b43066b54057b35076&n5=e21e41e61e81e23e83e25e85e27e87e29e49e69e89&n6=e21081e29089e21029e81089e42e62e33e53e73e44e64e35e55e75e46e66e37e57e77e48e68&c1=d66&c2=6b6&c3=66d&c4=bb4&c5=888&c6=000&c7=fff

	// Example 3: Dice design cards.
	// 3c9&n0=g11099f11091f11018f91098f19099&n1=f55&n2=f73f37&n3=f73f55f37&n4=f33f73f37f77&n5=f33f73f55f37f77&n6=f33f73f35f75f37f77&n7=f33f73f35f55f75f37f77&n8=f33f53f73f35f75f37f57f77&n9=f33f53f73f35f55f75f37f57f77&n10=e11091e11018e91098e19099&n11=e11091e11018e91098e19099e33e73e44e54e64e45e55e65e46e56e66e37e77&c1=d66&c2=6b6&c3=66d&c4=bb4&c5=888&c6=000&c7=fff

//&n1=c53c44c54c64c35c45c55c65c75c36c46c56c66c76c47c57c67&n2=a43a63a34a44a54a64a74a35a45a55a65a75a46a56a66a57&n3=d53d44d54d64d35d45d55d65d75d46d56d66d57&n4=b43b53b63b44b54b64b35b45b55b65b75b36b46b56b66b76b57&n5=e33e73e44e54e64e45e55e65e46e56e66e37e77

	// Load color palette parameters.
	var palette = [cubeVector(255, 255, 255), cubeVector(0, 0, 0)];
	for (let j = 0; j <= keys.length; j++) {
		let data = cubeParamData("c"+ j);
		if (data.length >= 3) {
			let d = cubeDiv(data.length, 3); // d=1:RGB, d=2:RRGGBB.
			palette[j] = cubeVector(
				data[0 * d] * 16 + data[(0 + 1) * d - 1],
				data[1 * d] * 16 + data[(1 + 1) * d - 1],
				data[2 * d] * 16 + data[(2 + 1) * d - 1]);
		}
	}

	// Load face design parameters.
	let designsMax = 0;
	var bufferPixel = 2, bufferWidth = 9, bufferOffset = 1, bufferScale = 2;
	for (let j = 0; j <= keys.length; j++) {
		let data = cubeParamData("n" + j);
		for (let i = 0; i < data.length; i += 3) {
			let x = data[i + 1], y = data[i + 2];
			if (x > bufferWidth || y > bufferWidth) {
				if (x > 16 || y > 16) {
					bufferPixel = 1;
					bufferWidth = 32;
					bufferOffset = 4;
					//bufferScale = 1;
				} else if (x > 9 || y > 9) {
					bufferPixel = 1;
					bufferWidth = 16;
					bufferOffset = 2;
					//bufferScale = 2;
				}
				while (x > bufferWidth || y > bufferWidth) {
					bufferWidth = bufferWidth * 2;
					bufferOffset = bufferOffset * 2;
					//bufferScale = bufferScale / 2;
				}
			}
			if (j > 0) {
				designsMax = j > designsMax ? j : designsMax;
			}
		}
	}
	bufferSpriteWidth = bufferWidth * bufferScale + bufferOffset * 2;
	if (designsMax > 0) {
		buffer = cubeCanvas(bufferSpriteWidth, bufferSpriteWidth, bufferScale, designsMax);
		console.log(":bufferSpriteWidth=" + bufferSpriteWidth.toString() +
			" bufferWidth=" + bufferWidth.toString() +
			" bufferScale=" + bufferScale.toString() +
			" bufferOffset=" + bufferOffset.toString());
		for (let j = 0; j <= keys.length; j++) {
			let data = cubeParamData("n" + j);
			if (data.length > 0) {
				for (let i = 0; i < data.length; i += 3) {
					let pos = cubeVector(
						(data[i + 1] - 1) + bufferOffset / bufferScale,
						(data[i + 2] - 1) + bufferOffset / bufferScale, 0);

					// Color.
					let c = data[i] >= 10 ? data[i] - 9 : data[i];
					let color = palette[c] ? palette[c] : palette[1];

					// Pixel rect.
					let size = cubeVector(1, 1, 0);

					// Large rect.
					if (i < data.length - 3 && data[i + 3] == 0) {
						size.x = data[i + 4] - data[i + 1] + 1;
						size.y = data[i + 5] - data[i + 2] + 1;
						i += 3;
					}

					// Common data.
					if (j == 0) {
						for (let l = 1; l <= keys.length; l++) {
							cubeCanvasRect(pos, size, color, l - 1, buffer);
						}
					} else {
						cubeCanvasRect(pos, size, color, j - 1, buffer);
					}
				}
			}
		}
	}

	// Constant parameters.
	const frameNone = 0, frameBack = -1, frameBlank = -2;
	const frameCardStart = -3, frameButtons = [12, 12];
	const frameDigitStart = -3, frameDigitDirs = -1, frameDigitCounts = 20;
	var frameChipStart = 10, frameDiceStart = 1;

	// Dice parameters.
	var rollCounts = 0, diceCounts = 0, diceFrameMax = 0;

	// Card parameters.
	var cardCountsMax = 0, handCounts = 0, cardCounts = [0], cardFrameMax = 0;

	// Board(Chips) parameters.
	var chipCountsMax = 0, chipFrameMax = 0, frameChipDepth = 0;

	// Player and random parameter.
	var playerNumber = 1; // Player number.
	var playerCounts = 1; // Player counts.
	var seed = 0; // Random seed.

	// Check manifest parameters.
	if (square.manifest.params) {
		console.log("Load manifest parameters.");
		if (square.manifest.params.dice) {
			if (square.manifest.params.dice.count) {
				diceCounts = square.manifest.params.dice.count;
			}
			if (square.manifest.params.dice.roll) {
				rollCounts = square.manifest.params.dice.roll;
			}
			if (square.manifest.params.dice.face) {
				diceFrameMax = square.manifest.params.dice.face;
				frameChipStart = frameDiceStart + diceFrameMax;
			}
			console.log("Dice parameters:" + rollCounts + "d" + diceFrameMax);
		}
		if (square.manifest.params.cards) {
			if (square.manifest.params.cards.count) {
				cardCountsMax = square.manifest.params.cards.count;
			}
			if (square.manifest.params.cards.draw) {
				handCounts = square.manifest.params.cards.draw;
			}
			if (square.manifest.params.cards.faces) {
				cardCounts = square.manifest.params.cards.faces;
			}
			console.log("Card parameters:" + handCounts + "c" + cardCountsMax);
		}
		if (square.manifest.params.board) {
			if (square.manifest.params.board.size) {
				counts = square.manifest.params.board.size;
			}
			if (square.manifest.params.board.type) {
				pattern = square.manifest.params.board.type;
			}
			if (square.manifest.params.board.count) {
				chipCountsMax = square.manifest.params.board.count;
			}
			if (square.manifest.params.board.face) {
				chipFrameMax = square.manifest.params.board.face;
			}
			if (square.manifest.params.board.flip) {
				frameChipDepth = square.manifest.params.board.flip;
			}
			console.log("Board parameters:" + chipCountsMax + "x" + chipFrameMax + "x" + frameChipDepth);
		}

	// Set default parameters.
	} else {
		diceCounts = 9;
		rollCounts = 1;
		diceFrameMax = 6;
		cardCounts = [10];
		chipFrameMax = 2;
		counts = 6;
		pattern = 1;
	}

	// Check query parameters.
	for (let i = 0; i < 3; i++) {
		if (cubeParamContains(i, ["b","c","d"])) {
			console.log("Reset parameters.");
			chipCountsMax = 0;
			diceCounts = 0;
			cardCountsMax = 0;
		}
	}
	for (let i = 0; i < 3; i++) {
		console.log("Load query parameter:" + i);

		// Board and pieces parameters.
		if (cubeParamContains(i, "b")) {
			let params = cubeParamNumbers(i);
			console.log("Load board parameters " + i + ":" + params)
			if (params.length >= 4) {
				chipCountsMax = params[0] > 0 ? params[0] : -1;
				chipFrameMax = params[1];
				frameChipDepth = params[2];
				counts = params[params.length - 1];
				pattern = 0;
			} else if (params.length == 3) {
				chipCountsMax = params[0] > 0 ? params[0] : -1;
				chipFrameMax = params[1];
				frameChipDepth = 1;
				counts = params[params.length - 1];
				pattern = 0;
			} else if (params.length == 2) {
				chipCountsMax = params[0] > 0 ? params[0] : -1;
				chipFrameMax = params[1];
				frameChipDepth = 1;
			} else if (params.length == 1) {
				chipCountsMax = params[0] > 0 ? params[0] : -1;
			}
			console.log("Board parameters:" + chipCountsMax + "x" + chipFrameMax + "x" + frameChipDepth)

		// Dice parameters.
		} else if (cubeParamContains(i, "d")) {
			let params = cubeParamNumbers(i);
			console.log("Load dice parameters " + i + ":" + params)
			if (params.length >= 1) {
				diceCounts = rollCounts = params[0] > 0 ? params[0] : 1;
			}
			if (params.length >= 2) {
				diceFrameMax = params[1] < frameChipStart ? params[1] : frameChipStart - 1;
			}
			console.log("Dice parameters:" + rollCounts + "d" + diceFrameMax)

		// Cards parameters.
		} else if (cubeParamContains(i, "c")) {
			let params = cubeParamNumbers(i);
			console.log("Load card parameters " + i + ":" + params)
			if (params.length == 1) {
				handCounts = params[0];
				cardCountsMax = -1;
			}
			if (params.length >= 2) {
				handCounts = params[0];
				cardCounts = params.slice(1);
				cardCountsMax = -1;
			}
			console.log("Card parameters:" + handCounts + "c" + cardCountsMax)
		}
	}

	// Check query parameters.
	var playerParams = cubeParamNumbers("p"); // Player number/counts. p=1/1
	if (playerParams.length >= 1) {
		playerNumber = playerParams[0];
	}
	if (playerParams.length >= 2) {
		playerCounts = playerParams[1];
	}
	var randomParams = cubeParamNumbers("r"); // Random seed. r=0
	if (randomParams.length >= 1) {
		seed = randomParams[0];
	}

	// Check player/random parameters.
	if (square.manifest.params) {
		if (playerNumber == 1 && playerCounts == 1 && seed == 0) {
			if (square.manifest.params.players) {
				if (square.manifest.params.players.length >= 1) {
					playerNumber = square.manifest.params.players[0];
				}
				if (square.manifest.params.players.length >= 2) {
					playerCounts = square.manifest.params.players[1];
				}
			}
			if (square.manifest.params.seed > 0) {
				seed = square.manifest.params.seed;
			}
		}
	}

	// Set goban grids.
	if (pattern == 0 && cubeMod(counts, 2)) {
		counts -= 1;
		pattern = 1;
	}

	// Card count max.
	if (cardCounts.length > 0 && cardCountsMax < 0) {
		cardCountsMax = 0;
		for (let i = 0; i < cardCounts.length; i++) {
			cardCountsMax += cardCounts[i];
		}
	}

	// Chip count max.
	if (chipFrameMax > 0 && chipCountsMax < 0) {
		console.log("Update chip count:" + chipFrameMax + " " + chipCountsMax + "->" + counts)
		chipCountsMax = counts * counts;
	}

	// Initialize random seed.
	if (seed) {
		seed = cubeDate() * 1000000 + cubeMod(seed, 1000000);
		console.log("Seed=" + seed);
		cubeRandom(0, seed);
	}

	// Initialize resource sets.
	var resource0 = resource1 = resource, resourceCounts = 6;
	if (square.manifest.resource) {
		resource1 = square.manifest.resource;
	}

	//Example b1: Mini Reversi.
	// b1x2x6&b=a43b33a34b44
	//Example b2: Reversi.
	// b1x2x8&b=a54b44a45b55
	//Example b3: Mini Checker.
	// b2x2x6&p=1/2&b=a16a25a36a45a56a65b12b21b32b41b52b61
	//Example b4: Checker.
	// b2x2x8&p=1/2&b=a18a27a38a47a58a67a78a87b12b21b32b41b52b61b72b81
	//Example b5: 9-Ro Goban.
	// b2x9
	//Example b6: 13-Ro Goban.
	// b2x13

	// Initialize placement pieces.
	var placements = []; // Placement pieces.
	var piecesParams = cubeParamData("b");
	var piecesType = cubeDiv(counts, 2) + 1 - 0.5 * (cubeMod(counts, 2) ? pattern : !pattern);
	for (let i = 0; i < piecesParams.length / 3; i++) {
		let x = piecesParams[i * 3 + 1] - piecesType;
		let y = piecesParams[i * 3 + 2] - piecesType;
		let z = piecesParams[i * 3] >= 10 ? piecesParams[i * 3] - 9 : piecesParams[i * 3];
		placements.push(cubeVector(x, y, z));
	}

	var original = 0; // Original design icon frame.

	//var maximum = 6; // Maximum deck counts.
	//var rolling = 0; // Rolling count.

	// Screen size.
	const screenSizeX = 180, screenSizeY = 280;

	// Resize screen.
	cubeResizeScreen(screenSizeX, screenSizeY);

	var joypad = cubeJoypad();

	// Create button sprites.
	var buttonSprites = [], buttonMax = 2;
	for (var i = 0; i < buttonMax; i++) {
		buttonSprites[i] = await cubeSprite(resource0, 40, 40);
	}

	// Create card sprites.
	const cardExtraDeck = 0, cardExtraTrash = 1, cardExtraBank = 2, counterMax = 3;
	const cardExtraDice = 3, cardExtraHold = 4, cardExtraFocus = 5, cardExtraMax = 6;
	const cardSpriteScale = 1, cardSpriteWidth = 40;
	var cardSprites = [];
	for (var i = 0; i < cardCountsMax + chipCountsMax + diceCounts + cardExtraMax; i++) {
		if (buffer) {
			cardSprites[i] = await cubeCanvasSprite(buffer);
			//cubeResize(cardSpriteWidth, cardSpriteWidth, 1, cardSprites[i]);
		} else {
			cardSprites[i] = await cubeSprite(resource1);
			let width = cardSprites[i].imageSize.x / resourceCounts;
			cubeResize(width, width, cardSpriteWidth / width, cardSprites[i]);
		}
	}

	// Create count sprites.
	var counterSprites = [];
	for (var i = 0; i < counterMax; i++) {
		counterSprites[i] = await cubeSprite(resource0, 40, 40);
	}

	// Board size.
	const boardSize = 160, boardPosX = screenSizeX/2;

	// Card scales.
	const handScale = 1.0;
	const playScale = 1.0;
	const handFocusScale = 3.0;
	const playFocusScale = 3.0;
	const focusPosY = -8;
	const deckScale = 0.75;
	const bankScale = 0.75;
	const diceScale = 0.75;

	// Reset bank/dice position.
	let boardPosY = cardCountsMax > 0 ? 90 : 120;
	let deckPosY = boardPosY + boardSize/2 + 20;
	let bankPosY = boardPosY + boardSize/2 + 20;
	let dicePosY = boardPosY + boardSize/2 + 50;
	let handPosY = boardPosY + boardSize/2 + 90;

	// Counter number position.
	const numberPosY = 5;

	// Card/chip max stack count.
	const stackCountsMax = 5;

	// Create shade sprite.
	const shadeStarts = [cubeVector(0, 0), cubeVector(0, 0)];
	const shadeSizes = [cubeVector(screenSizeX, 40), cubeVector(screenSizeX, 40)];
	const shadeColors = [cubeVector(187, 187, 187), cubeVector(187, 187, 187)];
	var shadeCanvases = [
		cubeCanvas(shadeSizes[0].x, shadeSizes[0].y, 1),
		cubeCanvas(shadeSizes[1].x, shadeSizes[1].y, 1)];
	const shadeSpriteMax = 2;
	const shadePoses = [
		cubeVector(screenSizeX/2, handPosY),
		cubeVector(screenSizeX/2, 20)];
	var shadeSprites = [];
	var shadeOffsets = [0, 0];
	//for (var i = 0; i < shadeSpriteMax/2; i++) {
	//	cubeCanvasRect(shadeStarts[i], shadeSizes[i], shadeColors[i], 0, shadeCanvases[i]);
	//}
	for (var i = 0; i < shadeSpriteMax; i++) {
		cubeCanvasRect(shadeStarts[cubeDiv(i, 2)], shadeSizes[cubeDiv(i, 2)], shadeColors[i>0?1:0], 0, shadeCanvases[i]);
		shadeSprites[i] = await cubeCanvasSprite(shadeCanvases[i]);
		cubeDilute(0, shadeSprites[i]);
		cubeMove(shadePoses[i].x, shadePoses[i].y, shadeSprites[i]);
	}

	// Board sprite.
	var boardSprite = null, boardGridSize = null, boardMargin = null;

	// Cards.
	var decks = [], trashes = [], focuses = [];
	var handCards = [], playCards = [], holdCards = [];
	const blankCard = { x:0, y:0, z:0, angle:0, frame:frameCardStart, flag:0 };
	const backsidedCard = { x:0, y:0, z:0, angle:0, frame:frameBack, flag:1 };
	const rollingMaxOnDraw = 15;
	var drawCounts = 0;
	var opening = 0;

	// Dice.
	var dice = [];
	const backsidedDice = { x:0, y:0, angle:0, frame:frameDiceStart, flag:0 };
	const rollingMaxOnRoll = 30, rollingMaxOnReroll = 60;
	var rollingCounts = 0, rollingMax = 0;

	// Chips.
	var banks = [], playChips = [], holdChips = [];
	const backsidedChip = { x:0, y:0, angle:0, frame:frameChipStart, flag:0 };

	// Main loop.
	var result = 1;
	while (true) {

		// Load board sprite.
		let boardGridCounts = counts, boardGridPattern = pattern; // Grid pattern. (0:Chess, 1:Goban)
		let boardGridType = cubeMod(boardGridCounts, 2) ? boardGridPattern : !boardGridPattern; // 0:-1,0,1 1:-0.5,0.5
		let boardCanvas = cubeCanvas(boardSize + boardGridPattern * 2, boardSize + boardGridPattern * 2, 1);
		let boardGridColor = [cubeVector(238,238,238), cubeVector(187,187,187), cubeVector(136,136,136)];
		// #fff=rgb(255,255,255) #eee=rgb(238,238,238) #ccc=rgb(204,204,204) #bbb=(187,187,187) #aaa=rgb(170,170,170)
		// #888=rgb(136,136,136) #555=rgb(85,85,85) #333=rgb(51,51,51) #111=rgb(17,17,17) #000=rgb(0,0,0)
		boardGridSize = cubeVector(boardSize / boardGridCounts, boardSize / boardGridCounts);
		if (boardGridPattern > 0) {
			cubeCanvasRect(cubeVector(0, 0), cubeVector(boardSize+2, boardSize+2), boardGridColor[1], 0, boardCanvas);
			boardMargin = cubeVector(boardGridSize.x/2, boardGridSize.y/2);
		} else {
			boardMargin = null;
		}
		for (let j = 0; j < boardGridCounts; j++) {
			for (let i = 0; i < boardGridCounts; i++) {
				let c = boardGridPattern > 0 ? 0 : 1;
				if (playerCounts > 1) {
					let n = cubeMod(j, 2) ? ((j + 1) * boardGridCounts - (i + 1)) : (j * boardGridCounts + i);
					if (cubeMod(n, playerCounts) == playerNumber - 1) {
						c = boardGridPattern > 0 ? 0 : 2;
					}
				}
				cubeCanvasRect(
					cubeVector(i*boardGridSize.x+1+boardGridPattern,
						(boardGridCounts-(j+1))*boardGridSize.y+1+boardGridPattern),
					cubeVector(boardGridSize.x-2, boardGridSize.y-2), boardGridColor[c], 0, boardCanvas);
			}
		}
		boardSprite = await cubeCanvasSprite(boardCanvas);
		cubeMove(boardPosX, boardPosY, boardSprite);

		// Reset play card lines and scales.
		let cardScale = playScale * boardGridSize.y * 0.04;
		let chipScale = playScale * boardGridSize.y * 0.04;
		let holdScale = playScale * boardGridSize.y * 0.05;

		// Collision margin.
		let cardMargin = cubeVector(-80 / boardGridCounts, -80 / boardGridCounts);
		let buttonMargin = cubeVector(-12, -12);

		// Reset and shuffle decks.
		if (rolling < 0) {

			// Create new decks.
			console.log("Create new decks:" + cardCounts.length);
			decks = [], trashes = [], focuses = [];
			handCards = [], playCards = [], holdCards = [];
			drawCounts = 0;
			cardFrameMax = 0;
			for (let i = 0; i < cardCounts.length; i++) {
				let cardCount = cardCounts[i] < cardCountsMax - cardFrameMax ?
					cardCounts[i] : cardCountsMax - cardFrameMax
				for (let j = 0; j < cardCount; j++) {
					decks[cardFrameMax + j] = cubeClone(backsidedCard);
					decks[cardFrameMax + j].frame = frameCardStart - j;
					decks[cardFrameMax + j].flag = true;
					//console.log("i=" + i + " j=" + j);
				}
				cardFrameMax += cardCount;
			}

			// Create new dice.
			console.log("Create new dice:" + diceCounts);
			dice = [];
			for (let i = 0; i < diceCounts; i++) {
				dice[i] = cubeClone(backsidedDice);
				dice[i].frame = frameDiceStart + (diceFrameMax - 1);
			}
			rollingCounts = 0;

			// Create new chips.
			console.log("Create new chips:" + chipCountsMax);
			banks = [], playChips = [], holdChips = [];
			for (let j = 0; j < chipCountsMax; j++) {
				banks[j] = cubeClone(backsidedChip);
				banks[j].frame = frameChipStart;
				//console.log("j=" + j);
			}
			if (placements.length > 0) {
				for (let j = 0; j < placements.length; j++) {
						let chip = banks.pop();
						chip.x = placements[j].x;
						chip.y = placements[j].y;
						chip.z = 0;
						chip.frame = frameChipStart + (placements[j].z - 1);
						playChips.push(chip);
				}
			}

			// Shuffle decks by Fisher-Yates argorythm.
			for (let i = decks.length - 1; i > 0; i--) {
				let j = cubeRandom(i + 1);
				let d = decks[i];
				decks[i] = decks[j];
				decks[j] = d;
			}

			// Draw the initial card from decks.
			//var handCounts = counts;
			if (handCounts != handCards.length) {
				console.log("Draw the initial card from decks.");

				// Discard hand cards.
				while (handCounts < handCards.length && handCards.length > 0) {
					trashes.push(handCards.shift());
					drawCounts = 0;
				}
				// Draw initial card from decks.
				while (handCounts > handCards.length && decks.length > 0) {
					for (let k = 1; k <= playerCounts; k++) {
						if (decks.length > 0) {
							let card = decks.pop();

							// Draw and open cards from deck.
							if (k == playerNumber) {
								card.angle = 0;
								card.flag = false;
								handCards.push(card);
								if (result > 0) {
									drawCounts = 1;
								} else {
									drawCounts += 1;
								}
								rollingCounts = 0;

							// Discard to trashes from deck.
							} else {
								trashes.push(card);
							}
							result = 0;

							// Open hand cards.
							//opening = 1;
						}
					}
				}
				handCounts = handCards.length;
			}

			// Roll the initial dice.
			var diceLayouts = [];
			if (rollCounts > playChips.length) {
				//console.log("Draw the initial card from decks.");
				var rowsMax = cubeSqrt(rollCounts - 1) + 1;
				var lines = cubeDiv(rollCounts - 1, rowsMax) + 1;
				//console.log("rollCounts="+rollCounts+" rowsMax="+rowsMax+" lines=" + lines);
				for (var y = 0; y < lines; y++) {
					let rows = y > 0 ? rowsMax : cubeMod(rollCounts - 1, rowsMax) + 1;
					//console.log("y=" + y + " rows=" + rows);
					for (var x = 0; x < rows; x++) {
						let dx = (x + 1) / (rows + 1) * (rowsMax + 1) * 2;
						let dy = (y + 1) / (lines + 1) * (rowsMax + 1) * 2;
						let lx = cubeCut(dx - (rowsMax + 1));
						let ly = cubeCut(dy - (rowsMax + 1));
						let l = cubeVector(lx, ly);
						diceLayouts.push(l);
						console.log("x=" + x + " layout = "+l+" : "+(x + 1)+"/"+(rows + 1)+" "+(y + 1)+"/"+(lines + 1));
					}
				}

				// Discard all playing dice.
				for (var j = playChips.length - 1; j >= 0; j--) {
					if (playChips[j].frame >= frameDiceStart) {
						let chip = playChips.splice(j, 1)[0];
						chip.frame = frameDiceStart + diceFrameMax - 1;
						dice.push(chip);
					}
				}
				// Roll the initial dice.
				if (rollCounts > 0) {
					while (rollCounts > playChips.length && dice.length > 0) {
						if (dice.length > 0) {
							console.log("Roll the initial dice.");

							// Add chip to playing board and roll dice.
							let chip = dice.pop();
							chip.angle = 0;
							chip.flag = false;
							let i = cubeMod(diceCounts - dice.length - 1, diceLayouts.length);
							console.log("Roll the initial dice:" + i);
							chip.x = diceLayouts[i].x;
							chip.y = diceLayouts[i].y;
							chip.z = 0;
							chip.frame = frameDiceStart + cubeMod(cubeRandom(diceFrameMax) + playerNumber, diceFrameMax);
							playChips.push(chip);
							if (result > 0) {
								rollingCounts = 1;
							} else {
								rollingCounts += 1;
							}
							rollingMax = rollingMaxOnRoll;
						}
						result = 0;
					}
					if (dice.length > 0) {
						dice[dice.length - 1].frame = frameDiceStart + diceFrameMax - 1;
					}
				}
			}
		}

		// Sprite scale and angle.
		var angle = 0;

		// Drawing card.
		const holdingTime = 30, rotatingTime = 30;
		let holdingCardId = -1, releasedCardId = -1, focusingCardId = -1;
		for (rolling = 1; rolling >= 1; rolling++) {

			// Wait for input.
			await cubeReadJoypad(0, joypad);
			let action = cubeJoypadAction(joypad);
			let motion = cubeJoypadMotion(joypad);
			let motionLocalPos = motion ? cubeScreenLocalPos(motion) : null;

			// Check touching each cards.
			const touchingNothing = -1, touchingSomething = -2, touchingReleased = -3;
			const touchingButton = -4, touchingFocus = -5, touchingBoard = -6, touchingShade = -7;
			const touchingRolling = -8, touchingClosing = -9;
			let touchingCardId = touchingNothing;
			let touchingShadeL = -1, touchingShadeR = -1;
			let touchingBoardPos = null;

			// Check touching buttons.
			let touchingButtonId = -1;
			if (focuses.length > 0) {
				for (let i = 0; i < buttonMax; i++) {
					if (cubeCheck(motion, buttonMargin, buttonSprites[i])) {
						touchingCardId = touchingButton;
						touchingButtonId = i;
						break;
					}
				}
			}

			// Check touching hand card.
			if (touchingCardId == touchingNothing && drawCounts <= 0 && rollingCounts <= 0 &&
				/*opening > 10 &&*/ focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0) {
				for (let i = handCards.length - 1; i >= 0; i--) {
					if (cubeCheck(motion, null, cardSprites[i])) {
						touchingCardId = i;
						break;
					}
				}
			}

			// Check touching decks.
			if (touchingCardId == touchingNothing && cardCountsMax > 0 &&
				rollingCounts <= 0 &&
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0 &&
				cubeCheck(motion, null, cardSprites[handCards.length + playCards.length + playChips.length + cardExtraDeck])) {
				touchingCardId = handCards.length + playCards.length + playChips.length + cardExtraDeck;
			}

			// Check touching trashes.
			if (touchingCardId == touchingNothing && cardCountsMax > 0 && trashes.length > 0 &&
				drawCounts <= 0 && rollingCounts <= 0 &&
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0 &&
				cubeCheck(motion, null, cardSprites[handCards.length + playCards.length + playChips.length + cardExtraTrash])) {
				touchingCardId = handCards.length + playCards.length + playChips.length + cardExtraTrash;
			}

			// Check touching banks.
			if (touchingCardId == touchingNothing && 
				((chipCountsMax > 0 && banks.length > 0)/* || (cardCountsMax > 0 && opening > 0)*/) &&
				drawCounts <= 0 && rollingCounts <= 0 && /*opening <= 0 &&*/
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0 &&
				cubeCheck(motion, null, cardSprites[handCards.length + playCards.length + playChips.length + cardExtraBank])) {
				touchingCardId = handCards.length + playCards.length + playChips.length + cardExtraBank;
			}

			// Check touching dice.
			if (touchingCardId == touchingNothing && diceCounts > 0 &&
				drawCounts <= 0 && (rollingCounts <= 0 || dice.length > 0) && opening <= 0 &&
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0 &&
				cubeCheck(motion, null, cardSprites[handCards.length + playCards.length + playChips.length + cardExtraDice])) {
				touchingCardId = handCards.length + playCards.length + playChips.length + cardExtraDice;
			}

			// Check touching closing.
			/*if (touchingCardId == touchingNothing && diceCounts > 0 &&
				drawCounts <= 0 && (rollingCounts <= 0 || dice.length > 0) && opening > 0 &&
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0 &&
				cubeCheck(motion, null, cardSprites[handCards.length + playCards.length + playChips.length + cardExtraDice])) {
				touchingCardId = touchingClosing;
			}*/

			// Check touching focuses.
			if (touchingCardId == touchingNothing &&
				drawCounts <= 0 && rollingCounts <= 0 &&
				focuses.length > 0 &&
				cubeCheck(motion, cardMargin, cardSprites[handCards.length + playCards.length + playChips.length + cardExtraFocus])) {
				touchingCardId = touchingFocus;
			}

			// Check touching play chips.
			if (touchingCardId == touchingNothing && drawCounts <= 0 &&
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0) {
				for (let i = handCards.length + playCards.length + playChips.length - 1; i >= handCards.length + playCards.length; i--) {
					if (cubeCheck(motion, cardMargin, cardSprites[i])) {
						let j = i - handCards.length - playCards.length;
						// Ignore stacked chips.
						//if (playChips[j].z <= 0) {

							// Find the higher chip in the same location.
							for (let k = 0; k < playChips.length; k++) {
								if (playChips[k].x == playChips[j].x && playChips[k].y == playChips[j].y && playChips[k].z > playChips[j].z) {
									j = k;
								}
							}

							if (playChips[j].frame < frameChipStart || rollingCounts <= 0) {
								touchingCardId = j + handCards.length + playCards.length;
								break;
							}
						//}
					}
				}
			}

			// Check touching play cards.
			if (touchingCardId == touchingNothing && drawCounts <= 0 && rollingCounts <= 0 &&
				focuses.length <= 0 && holdCards.length <= 0 && holdChips.length <= 0) {
				for (let i = handCards.length + playCards.length - 1; i >= handCards.length; i--) {
					if (cubeCheck(motion, cardMargin, cardSprites[i])) {
						let j = i - handCards.length;
						// Ignore stacked cards.
						//if (playCards[j].z <= 0) {

							// Find the higher card in the same location.
							for (let k = 0; k < playCards.length; k++) {
								if (playCards[k].x == playCards[j].x && playCards[k].y == playCards[j].y && playCards[k].z > playCards[j].z) {
									j = k;
								}
							}

							touchingCardId = j + handCards.length;
							break;
						//}
					}
				}
			}

			// Check touching hand shade.
			if (touchingCardId == touchingNothing &&
				(holdCards.length > 0 || handCards.length > 0 || opening > 0) &&
				(focuses.length <= 0 || focusingCardId < handCards.length)) {
				for (let i = 0; i < 1/*shadeSpriteMax*/; i++) {
					if (cubeCheck(motion, null, shadeSprites[i])) {
						touchingCardId = touchingShade - i;
						break;
					}
				}
			}

			// Check touching playing board.
			if (touchingCardId == touchingNothing/* &&
				(holdCards.length > 0 || holdChips.length > 0 || (cardCountsMax > 0 && opening > 0))*/) {
				if (cubeCheck(motion, boardMargin, boardSprite)) {
					touchingCardId = touchingBoard;
				}
			}

			// Touch decks.
			if (touchingCardId == handCards.length + playCards.length + playChips.length + cardExtraDeck) {

				// Empty deck.
				if (decks.length == 0) {
					if (result > 0 && trashes.length > 0) {

						// Recycle trashes to decks and shuffle.
						if (action && action.z < 0 && result > 0) {

							console.log("Recycle trashes to decks.");

							while (trashes.length > 0) {
								let j = cubeRandom(trashes.length);
								let card = trashes.splice(j, 1)[0];
								// Open all cards.
								card.flag = true;
								//card.frame = card.frame < 0 ? -card.frame : card.frame;
								decks.push(card);
							}
							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
							rolling = 0;

						// Start to touch empty deck.
						} else {
							if (holdingCardId < 0) {
								holdingCardId = touchingCardId;
								releasedCardId = -1;

								// Reset for touching animation.
								rolling = 0;
							}
						}
					} else {

						console.log("Touch decks.");

						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;
					}

				// Draw card from decks.
				} else if (decks.length > 0 && rollingCounts <= 0) {

					// Draw card from decks.
					if (action) {
					//if (motion && rolling > 5) {
						if (action.z < 0 && handCards.length + playCards.length < cardCountsMax) {

							console.log("Draw card from decks.");

							for (let k = 1; k <= playerCounts; k++) {
								if (decks.length > 0) {
									let card = decks.pop();

									// Draw and open cards from deck.
									if (k == playerNumber) {
										card.angle = 0;
										card.flag = false;
										handCards.push(card);
										handCounts += 1;
										if (result > 0) {
											drawCounts = 1;
										} else {
											drawCounts += 1;
										}

										// Open hand cards.
										//opening = 1;

									// Discard to trashes from deck.
									} else {
										trashes.push(card);
									}
									result = 0;
								}
							}
						}

						console.log("Release touch over decks.");

						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;
						rolling = 0;

					// Start to touch decks.
					} else {
						if (holdingCardId < 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;

							// Reset for touching animation.
							rolling = 0;
						}
					}

				}
			}

			// Touch trashes.
			if (touchingCardId == handCards.length + playCards.length + playChips.length + cardExtraTrash) {

				if (result > 0) {

					// Focus trash card on tapping.
					if (action && action.z < 0 && trashes.length > 0) {

						if (focusingCardId != touchingCardId) {
							if (trashes[trashes.length-1].flag) {
								console.log("Turn over trash card on tapping.");
								trashes[trashes.length-1].flag = false;
							} else {
								console.log("Focus trash card on tapping.");
								angle = trashes[trashes.length - 1].angle = 0; // Reset angle animation.
								focuses.push(cubeClone(trashes[trashes.length - 1]));
								focusingCardId = touchingCardId = touchingCardId;
							}
						} else {
							focuses.pop();
							focusingCardId = touchingNothing;
						}

						holdingCardId = touchingSomething;
						//touchingCardId = touchingSomething;

						/*console.log("Turn over the trash card on tapping.");

						//trashes[trashes.length-1].frame = -trashes[trashes.length-1].frame;
						trashes[trashes.length-1].flag = !trashes[trashes.length-1].flag;

						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;*/
						rolling = 0;

					// Start to touch trashes.
					} else {
						if (holdingCardId < 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;

							// Reset for touching animation.
							if (trashes.length > 0) {
								rolling = 0;
							}
						}

					//} else if (holdCards.length > 0) {
						// Reset for touching animation.
						//rolling = 0;

					// Nothing to do.
					/*} else {
						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;*/
					}

				}
			}

			// Touch banks.
			if (touchingCardId == handCards.length + playCards.length + playChips.length + cardExtraBank) {

				if (result > 0) {

					// Change the chip on tapping.
					if (action && action.z < 0) {

						/*if (focuses.length <= 0 && opening > 0) {
							console.log("Close hand cards on tapping.");

							opening = 0;
						} else*/ if (banks.length > 0) {
							console.log("Change the bank chip on tapping.");

							if (chipFrameMax > 1) {
								banks[banks.length-1].frame = frameChipStart + cubeMod(banks[banks.length-1].frame - frameChipStart + 1, chipFrameMax);
							} else {
								banks[banks.length-1].frame = frameChipStart + cubeMod(banks[banks.length-1].frame - frameChipStart + 1, chipFrameMax * frameChipDepth);
							}
						}

						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;
						rolling = 0;

					// Start to touch banks.
					} else {
						if (holdingCardId < 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;

							// Reset for touching animation.
							if (banks.length > 0 || opening > 0) {
								rolling = 0;
							}
						}
					}

				}
			}

			// Touch dice.
			if (touchingCardId == handCards.length + playCards.length + playChips.length + cardExtraDice) {

				if (opening <= 0) {

					// Roll dice on tapping.
					if (action) {
						console.log("Dice roll on tapping.");
						let newRollCount = dice.length > 0 ? diceCounts - dice.length + 1 : 0;

						// Reroll the dice.
						var diceLayouts = [];
						var rowsMax = cubeSqrt(newRollCount - 1) + 1;
						var lines = cubeDiv(newRollCount - 1, rowsMax) + 1;
						//console.log("newRollCount="+newRollCount+" rowsMax="+rowsMax+" lines=" + lines);
						for (var y = 0; y < lines; y++) {
							let rows = y > 0 ? rowsMax : cubeMod(newRollCount - 1, rowsMax) + 1;
							//console.log("y=" + y + "/" + lines + " rows=" + rows);
							for (var x = 0; x < rows; x++) {
								let dx = (x + 1) / (rows + 1) * (rowsMax + 1) * 2;
								let dy = (y + 1) / (lines + 1) * (rowsMax + 1) * 2;
								let lx = cubeCut(dx - (rowsMax + 1));
								let ly = cubeCut(dy - (rowsMax + 1));
								diceLayouts.push([lx, ly]);
								//console.log("x=" + x + " y=" + y + " layout = "+lx+","+ly+" : "+(x + 1)+"/"+(rows + 1)+" "+(y + 1)+"/"+(lines + 1));
							}
						}
						//console.log("layouts=" + diceLayouts.length);

						// Discard all playing dice.
						for (var j = playChips.length - 1; j >= 0; j--) {
							if (playChips[j].frame < frameChipStart) {
								console.log("Discard the dice." +j +"/"+ newRollCount);
								let chip = playChips.splice(j, 1)[0];
								//chip.frame = frameDiceStart + diceFrameMax - 1;
								dice.push(chip);
							}
						}
						rollingCounts = 0;
						// Reroll the dice.
						if (newRollCount > 0) {
							for (let i = 0; i < newRollCount && dice.length > 0; i++) {
								console.log("Reroll the dice." +i +"/"+ newRollCount);

								// Add chip to playing board and roll dice.
								let chip = dice.pop();
								chip.angle = 0;
								chip.flag = false;
								chip.x = diceLayouts[i][0];
								chip.y = diceLayouts[i][1];
								chip.z = 0;
								chip.frame = frameDiceStart + cubeMod(cubeRandom(diceFrameMax) + playerNumber, diceFrameMax);
								playChips.push(chip);
								rollingCounts += 1;
								rollingMax = rollingMaxOnRoll;
							}
							if (dice.length > 0) {
								dice[dice.length - 1].frame = frameDiceStart + diceFrameMax - 1;
							}
							result = 0;
						}

						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;

					// Start to touch dice.
					} else {
						if (holdingCardId < 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;

							// Reset for touching animation.
							//if (dice.length > 0) {
								rolling = 0;
							//}
						}
					}

				}
			}

			// Touch buttons.
			if (touchingButtonId >= 0) {
				if (result > 0) {

					// Check release action.
					if (action) {

						// Rotate the released card to right.
						if (touchingButtonId == 1) {
							angle = cubeMod(angle + 90, 360);

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
							rolling = 0;

						// Rotate the released card to left.
						} else if (touchingButtonId == 0) {
							angle = cubeMod(angle - 90, 360);

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
							rolling = 0;
						}
					}
				}
			}

			// Touch focuses.
			if (touchingCardId == touchingFocus) {
				if (result > 0) {

					// Check release action.
					if (action) {

						// Turn over the card on tapping.
						if (action.z < 0 && focusingCardId >= 0) {

							console.log("Turn over the focusing hand card on tapping.");

							if (focusingCardId < handCards.length) {
								let j = focusingCardId ;
								focuses[focuses.length - 1].flag = handCards[j].flag = !handCards[j].flag;
							} else if (focusingCardId < handCards.length + playCards.length) {
								let j = focusingCardId - handCards.length;
								focuses[focuses.length - 1].flag = playCards[j].flag = !playCards[j].flag;
							} else {
								focuses[focuses.length - 1].flag = trashes[trashes.length - 1].flag = !trashes[trashes.length - 1].flag;
							}

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
							rolling = 0;
						}

					// Start to touch focuses.
					} else {
						if (holdingCardId != touchingFocus) {
							holdingCardId = touchingFocus;
							rolling = 0;
						}
					}
				}
			}

			// Touch hand cards.
			if (0 <= touchingCardId && touchingCardId < handCards.length) {
				if (result > 0) {
					let j = touchingCardId;

					// Check release action.
					if (action && action.z < 0) {

						if (focuses.length <= 0 && opening <= 0) {
							console.log("Open hand cards on tapping.");

							opening = 1;

						// Focus hand card on tapping.
						} else if (focusingCardId != touchingCardId && opening > 10) {

							if (focusingCardId != touchingCardId) {
								if (handCards[j].flag) {
									console.log("Turn over hand card on tapping.");
									handCards[j].flag = false;
								} else {
									console.log("Focus hand card on tapping.");
									angle = handCards[j].angle = 0; // Reset angle animation.
									focuses.push(cubeClone(handCards[j]));
									focusingCardId = touchingCardId;
								}
							} else {
								focuses.pop();
								focusingCardId = touchingNothing;
							}

							//holdingCardId = touchingSomething;
							//touchingCardId = touchingSomething;
						}

						// Turn over the hand card on tapping.
						/*if (action.z < 0) {
							handCards[j].flag = !handCards[j].flag;
						}*/

						holdingCardId = touchingSomething;
						touchingCardId = touchingSomething;
						rolling = 0;

					// Start to touch hand cards.
					} else {
						if (holdingCardId < 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;
						//} else if (touching > 60) {
						//	handCards[j].angle = cubeMod(handCards[j].angle + 90, 360);
						//	touching = 0;

							// Reset for touching animation.
							rolling = 0;
						}
					}

				}
			}

			// Touch playing cards.
			if (handCards.length <= touchingCardId && touchingCardId < handCards.length + playCards.length) {
				if (result > 0) {
					let j = touchingCardId - handCards.length;

					// Check release action.
					if (action) {

						// Focus playing card on tapping.
						if (action.z < 0 && focusingCardId != touchingCardId) {

							if (focusingCardId != touchingCardId) {
								if (playCards[j].flag) {
									console.log("Turn over playing card on tapping.");
									playCards[j].flag = false;
								} else {
									console.log("Focus playing card on tapping.");
									angle = playCards[j].angle; // Reset angle animation.
									focuses.push(cubeClone(playCards[j]));
									//playCards.push(card); // Move card to bottom.
									focusingCardId = touchingCardId = touchingCardId; //handCards.length + playCards.length - 1;
								}
							} else {
								focuses.pop();
								focusingCardId = touchingNothing;
							}

							holdingCardId = touchingSomething;
							//touchingCardId = touchingSomething;

						} else if (action.z < 0) {
							console.log("Turn over the playing card on tapping.");

							// Turn over the playing card on tapping.
							playCards[j].flag = !playCards[j].flag;

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
						}

						rolling = 0;

					// Start to touch playing cards.
					} else {
						if (holdingCardId < 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;
							rolling = 0;
						}

						// Reset for touching animation.
						//rolling = 0;
					}

				}
			}

			// Touch playing chips.
			if (handCards.length + playCards.length <= touchingCardId && touchingCardId < handCards.length + playCards.length + playChips.length) {
				//if (result > 0) {
					let j = touchingCardId - handCards.length - playCards.length;

					// Check release action.
					if (action) {

						if (action.z < 0) {

							if (playChips[j].frame < frameChipStart) {
								if (j < playChips.length - rollingCounts) {
									console.log("Reroll the playing dice on tapping.");

									let chip = playChips.splice(j, 1)[0];
									chip.frame = frameDiceStart + cubeMod(cubeRandom(diceFrameMax) + playerNumber, diceFrameMax);
									playChips.push(chip);
									if (result > 0) {
										rollingCounts = 1;
									} else {
										rollingCounts += 1;
									}
									rollingMax = rollingMaxOnReroll;
									result = 0;
								}
							} else {
								if (frameChipDepth > 1) {
									console.log("Turn over the playing chip on tapping.");

									// Turn over the playing chip on tapping.
									playChips[j].frame = frameChipStart + cubeMod(playChips[j].frame - frameChipStart + chipFrameMax, chipFrameMax * frameChipDepth);
								}
							}

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
						}

						rolling = 0;

					// Start to touch playing chips.
					} else {
						if (holdingCardId < 0 && drawCounts <= 0 && rollingCounts <= 0) {
							holdingCardId = touchingCardId;
							releasedCardId = -1;
							rolling = 0;
						}

						// Reset for touching animation.
						//rolling = 0;
					}

				//}
			}

			// Update hand shade grid.
			const shadeGridLineMax = 10;
			let shadeGridLine = handCards.length < shadeGridLineMax ? handCards.length : shadeGridLineMax;
			let shadeLines = cubeDiv(handCards.length - 1, shadeGridLine);
			let shadeGridSize = cubeVector(shadeSizes[0].x / (shadeGridLine + 1), shadeSizes[0].y / (shadeLines + 1));

			// Update shade offset.
			let offset = 0;
			if (opening > 0) {
				opening += 1;
				offset = shadeLines >= 1 ? 20 : 30;
				if (shadeOffsets[0] != offset) {
					let d = offset - shadeOffsets[0];
					if (-5 < d && d < 5) {
						shadeOffsets[0] = offset;
					} else {
						shadeOffsets[0] += cubeDiv(d, 2);
					}
				}
			} else {
				shadeOffsets[0] = 0;
			}

			// Touch hand shade.
			if (touchingCardId == touchingShade) {
				if (result > 0) {

					// Check touching position.
					let mod2 = shadeGridSize.x < shadeGridSize.x && cubeMod(handCards.length, 2);
					let x = cubeDiv(motionLocalPos.x - (shadeSprites[0].pos.x - shadeSprites[0].size.x/2), shadeGridSize.x);
					let y = cubeDiv(motionLocalPos.y - (shadeSprites[0].pos.y - shadeSprites[0].size.y/2), shadeGridSize.y);
					touchingShadeL = x - 1 >= 0 ? x + y * shadeGridLine - 1 : -1;
					touchingShadeR = x + y * shadeGridLine;

					// Check release action.
					if (action) {

						// Insert hold cards to hand cards.
						if (holdCards.length > 0) {

							console.log("Insert hold cards to hand cards.");

							let k = touchingShadeR;
							while (holdCards.length > 0) {
								let card = holdCards.pop();
								card.angle = 0;
								handCards.splice(k, 0, card);
							}
							handCounts = handCards.length;

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
							rolling = 0;

						} else if (focuses.length <= 0 && handCards.length > 0 && opening <= 0) {
							console.log("Open hand cards on tapping.");

							opening = 1;

						} else {
							if ((focuses.length <= 0 || focusingCardId < handCards.length) && opening > 0) {
								console.log("Close hand cards on tapping.");
								opening = 0;
							}

							if (focuses.length > 0) {
								console.log("Cancel focusing cards.");
								focuses.pop();
								focusingCardId = touchingNothing;
							}
						}
					}

				}
			}

			// Touch another shades.
			/*if (touchingCardId <= touchingShade) {
				if (result > 0) {

					// Rotate hold cards after wait.
					if (holdCards.length > 0) {

						if (touchingCardId == touchingShade - 1) {
							angle = angle<0?-180:180;
						} else if (touchingCardId == touchingShade - 2) {
							angle = angle<-90?-270:90;
						} else if (touchingCardId == touchingShade - 3) {
							angle = angle<90?-90:270;
						} else {
							angle = 0;
						}

						//holdingCardId = touchingSomething;
						//touchingCardId = touchingSomething;
					}

				}
			}*/

			// Touch playing board.
			if (touchingCardId == touchingBoard) {
				if (result > 0) {

					// Check touching position.
					if (boardGridType) {
						touchingBoardPos = cubeVector(
							cubeDiv(motionLocalPos.x - boardSprite.pos.x, boardGridSize.x) + 0.5,
							cubeDiv(motionLocalPos.y - boardSprite.pos.y, boardGridSize.y) + 0.5);
					} else {
						touchingBoardPos = cubeVector(
							cubeDiv(motionLocalPos.x - (boardSprite.pos.x - boardGridSize.x/2), boardGridSize.x),
							cubeDiv(motionLocalPos.y - (boardSprite.pos.y - boardGridSize.y/2), boardGridSize.y));
					}

					// Check release action.
					if (action) {

						// Replace cards to playing board.
						if (holdCards.length > 0) {

							console.log("Put hold cards to playing board.");

							// Discard playing cards to trashes.
							/*{
								let j = i - handCards.length;
								for (let j = 0; j < playCards.length; j++) {
									if (playCards[j].x == touchingBoardPos.x && playCards[j].y == touchingBoardPos.y) {
										let card = playCards.splice(j, 1)[0];
										card.angle = 0;
										trashes.push(card);
									}
								}
							}*/

							// Discard playing chips to banks/dice.
							/*{
								let j = i - handCards.length - playCards.length;
								for (let j = 0; j < playChips.length; j++) {
									if (playChips[j].x == touchingBoardPos.x && playChips[j].y == touchingBoardPos.y) {
										let chip = playChips.splice(j, 1)[0];
										if (chip.frame >= frameChipStart) {
											chip.frame = frameChipStart + cubeMod(chip.frame - frameChipStart, chipFrameMax);
											banks.push(chip);
										} else {
											//chip.frame = frameDiceStart + diceFrameMax - 1;
											dice.push(chip);
										}
									}
								}
							}*/

							// Put hold cards to playing board.
							while (holdCards.length > 0) {
								let hold = holdCards.pop();
								hold.x = touchingBoardPos.x;
								hold.y = touchingBoardPos.y;
								hold.z = 0;

								// Find the nearest card in the same location.
								for (let i = playCards.length - 1; i >= 0; i--) {
									if (playCards[i].x == hold.x && playCards[i].y == hold.y) {
										if (playCards[i].z + 1 < stackCountsMax) {
											console.log("Add card to stacked cards:" + i +
												":" + hold.x + "," + hold.y + "," + hold.z + ":" + boardGridCounts);
											hold.z = playCards[i].z + 1;
											playCards.splice(i + 1, 0, hold);
											hold = null;
											break;
										} else {
											console.log("Skip max stacked cards.");
											hold.y = hold.y - 1;
											i = playCards.length;
											continue;
										}
									}
								}

								// Find the card closest to the bottom.
								if (hold) {
									if (hold.x >= -boardGridCounts/2 && hold.x <= boardGridCounts/2 &&
											hold.y >= -boardGridCounts/2 && hold.y <= boardGridCounts/2) {
										for (let i = 0; i <  playCards.length; i++) {
											if (playCards[i].y > hold.y || (playCards[i].y == hold.y && playCards[i].x > hold.x)) {
												console.log("Insert card behind the closest to the bottom:" + i +
													":" + hold.x + "," + hold.y + "," + hold.z + ":" + boardGridCounts);
												playCards.splice(i, 0, hold);
												hold = null;
												break;
											}
										}

									// Discard to trash.
									} else {
										console.log("Discard to trash:" + hold.x + "," + hold.y + "," + hold.z);
										trashes.push(hold);
										hold = null;
									}
								}

								// Put hold card to playing board.
								if (hold) {
									console.log("Put hold chips to playing board:" +
											hold.x + "," + hold.y + "," + hold.z + ":" + boardGridCounts);
									playCards.push(hold);
									hold = null;
								}
							}

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;

						// Replace chips to playing board.
						} else if (holdChips.length > 0) {

							console.log("Put hold chips to playing board.");

							// Put hold chips to playing board.
							while (holdChips.length > 0) {
								let hold = holdChips.pop();
								hold.x = touchingBoardPos.x;
								hold.y = touchingBoardPos.y;
								hold.z = 0;

								// Find the nearest chip in the same location.
								for (let i = playChips.length - 1; i >= 0; i--) {
									if (playChips[i].x == hold.x && playChips[i].y == hold.y) {
										if (playChips[i].z + 1 < stackCountsMax) {
											console.log("Add chip to stacked chips:" + i +
												":" + hold.x + "," + hold.y + "," + hold.z + ":" + boardGridCounts);
											hold.z = playChips[i].z + 1;
											playChips.splice(i + 1, 0, hold);
											hold = null;
											break;
										} else {
											console.log("Skip max stacked chips.");
											hold.y = hold.y - 1;
											i = playChips.length;
											continue;
										}
									}
								}

								// Find the chip closest to the bottom.
								if (hold) {
									if (hold.x >= -boardGridCounts/2 && hold.x <= boardGridCounts/2 &&
											hold.y >= -boardGridCounts/2 && hold.y <= boardGridCounts/2) {
										for (let i = 0; i <  playChips.length; i++) {
											if (playChips[i].y > hold.y || (playChips[i].y == hold.y && playChips[i].x > hold.x)) {
												console.log("Insert chip behind the closest to the bottom:" + i +
													":" + hold.x + "," + hold.y + "," + hold.z + ":" + boardGridCounts);
												playChips.splice(i, 0, hold);
												hold = null;
												break;
											}
										}
									// Discard to bank.
									} else {
										console.log("Discard to bank:" + hold.x + "," + hold.y + "," + hold.z);
										banks.push(hold);
										hold = null;
									}
								}

								// Put hold chip to playing board.
								if (hold) {
									console.log("Put hold chips to playing board:" +
											hold.x + "," + hold.y + "," + hold.z + ":" + boardGridCounts);
									playChips.push(hold);
									hold = null;
								}
							}

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;

						} else if (focuses.length > 0) {

							if (rolling > 10) {
								console.log("Cancel focusing cards.");
								focuses.pop();
								focusingCardId = touchingNothing;
							}

						/*} else if (opening > 0) {
							if (rolling > 10) {
								console.log("Close hand cards on tapping.");

								opening = 0;
							}*/

						} else {
							console.log("Touch playing board.");

							holdingCardId = touchingSomething;
							touchingCardId = touchingSomething;
						}

					// Start to touch playing board.
					/*} else {
						if (holdingCardId < 0) {
							//console.log("Start to touch playing board.");
							holdingCardId = touchingCardId;
							releasedCardId = -1;
						}*/
					}

				}
			}

			// Touch closing.
			/*if (touchingCardId == touchingClosing) {
				if (result > 0) {
					if (opening > 0) {
						if (action) {
							console.log("Close hand cards on tapping.");

							opening = 0;

						// Start to touch dice.
						} else if (motion) {
							console.log("Start tapping.");
							if (holdingCardId < 0) {
								holdingCardId = touchingClosing;
								touchingCardId = touchingClosing;
								releasedCardId = -1;

								// Reset for touching animation.
								rolling = 0;
							}
						}
					}
				}
			}*/

			// Touch nothing.
			if (touchingCardId == touchingNothing) {
				//if (result > 0) {

					if (holdCards.length <= 0 && holdChips.length <= 0) {
						if (focuses.length > 0) {

							if (action && rolling > 10) {
								console.log("Cancel focusing cards.");
								focuses.pop();
								focusingCardId = touchingNothing;
							}

						/*} else if (opening > 0) {
							if (action && rolling > 10) {
								console.log("Close hand cards on tapping.");

								opening = 0;
							}*/

						// Roll dice on tapping.
						/*} else if (diceCounts > 0 && drawCounts <= 0 && opening <= 0 && (dice.length > 0 || result > 0)) {
							if (action) {
								console.log("Dice roll on tapping.");
								let newRollCount = dice.length > 0 ? diceCounts - dice.length + 1 : 0;

								// Reroll the dice.
								var diceLayouts = [];
								var rowsMax = cubeSqrt(newRollCount - 1) + 1;
								var lines = cubeDiv(newRollCount - 1, rowsMax) + 1;
								//console.log("newRollCount="+newRollCount+" rowsMax="+rowsMax+" lines=" + lines);
								for (var y = 0; y < lines; y++) {
									let rows = y > 0 ? rowsMax : cubeMod(newRollCount - 1, rowsMax) + 1;
									//console.log("y=" + y + "/" + lines + " rows=" + rows);
									for (var x = 0; x < rows; x++) {
										let dx = (x + 1) / (rows + 1) * (rowsMax + 1) * 2;
										let dy = (y + 1) / (lines + 1) * (rowsMax + 1) * 2;
										let lx = cubeCut(dx - (rowsMax + 1));
										let ly = cubeCut(dy - (rowsMax + 1));
										diceLayouts.push([lx, ly]);
										//console.log("x=" + x + " y=" + y + " layout = "+lx+","+ly+" : "+(x + 1)+"/"+(rows + 1)+" "+(y + 1)+"/"+(lines + 1));
									}
								}
								//console.log("layouts=" + diceLayouts.length);

								// Discard all playing dice.
								for (var j = playChips.length - 1; j >= 0; j--) {
									if (playChips[j].frame < frameChipStart) {
										console.log("Discard the dice." +j +"/"+ newRollCount);
										let chip = playChips.splice(j, 1)[0];
										//chip.frame = frameDiceStart + diceFrameMax - 1;
										dice.push(chip);
									}
								}
								rollingCounts = 0;

								// Reroll the dice.
								if (newRollCount > 0) {
									for (let i = 0; i < newRollCount && dice.length > 0; i++) {
										console.log("Reroll the dice." +i +"/"+ newRollCount);

										// Add chip to playing board and roll dice.
										let chip = dice.pop();
										chip.angle = 0;
										chip.flag = false;
										chip.x = diceLayouts[i][0];
										chip.y = diceLayouts[i][1];
										chip.frame = frameDiceStart + cubeMod(cubeRandom(diceFrameMax) + playerNumber, diceFrameMax);
										playChips.push(chip);
										rollingCounts += 1;
										rollingMax = rollingMaxOnRoll;
									}
									if (dice.length > 0) {
										dice[dice.length - 1].frame = frameDiceStart + diceFrameMax - 1;
									}
									result = 0;
								}

								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;

							// Start to touch dice.
							} else if (motion) {
								console.log("Start tapping.");
								if (holdingCardId < 0) {
									holdingCardId = touchingRolling;
									touchingCardId = touchingRolling;
									releasedCardId = -1;

									// Reset for touching animation.
									rolling = 0;
								}
							}*/
						}
					}

				//}
			}

			// Update hand shade grid.
			shadeGridLine = handCards.length < shadeGridLineMax ? handCards.length : shadeGridLineMax;
			shadeLines = cubeDiv(handCards.length - 1, shadeGridLine);
			shadeGridSize = cubeVector(screenSizeX / (shadeGridLine + 1), 40 / (shadeLines + 1));

			// Update focusing card angle animation.
			if (focuses.length > 0 && focusingCardId >= 0) {
				if (focuses[focuses.length - 1].angle != angle) {
					let d = cubeMod(angle - focuses[focuses.length - 1].angle, 360);
					if (-5 < d && d < 5) {
						focuses[focuses.length - 1].angle = angle;
					} else {
						focuses[focuses.length - 1].angle += cubeDiv(d > 180 ? d - 360 : d < -180 ? d + 360 : d, 2);
					}
				}

				// Update focusing hand card angle animation.
				if (focusingCardId < handCards.length) {
					//let j = focusingCardId;
					//handCards[j].angle = focuses[focuses.length - 1].angle;

				// Update focusing playing card angle animation.
				} else if (focusingCardId < handCards.length + playCards.length + playChips.length) {
					let j = focusingCardId - handCards.length;
					playCards[j].angle = focuses[focuses.length - 1].angle;

				// Update focusing trash card angle animation.
				} else {
					//trashes[trashes.length - 1].angle = focuses[focuses.length - 1].angle;
				}
			}

			// On holding cards.
			if (holdCards.length > 0) {

				// Update holding card angle animation.
				for (let i = 0; i < holdCards.length; i++) {
					if (holdCards[i].angle != angle) {
						let d = cubeMod(angle - holdCards[i].angle, 360);
						if (-5 < d && d < 5) {
							holdCards[i].angle = angle;
						} else {
							holdCards[i].angle += cubeDiv(d > 180 ? d - 360 : d < -180 ? d + 360 : d, 2);
						}
					}
				}

				// Cancel holding cards.
				if (action) {
					console.log("Cancel holding cards.");

					// Discard to trashes.
					while (holdCards.length > 0) {
						let hold = holdCards.pop();
						hold.angle = 0;
						trashes.push(hold);
					}

					// Close hand cards when out of cards.
					if (handCards.length <= 0) {
						opening = 0;
					}

					holdingCardId = touchingSomething;
				}

			// On holding chips.
			} else if (holdChips.length > 0) {

				// Cancel holding chips.
				if (action) {

					console.log("Cancel holding chips.");

					// Discard to banks/dice.
					while (holdChips.length > 0) {
						let hold = holdChips.pop();
						if (hold.frame >= frameChipStart) {
							hold.frame = frameChipStart + cubeMod(hold.frame - frameChipStart, chipFrameMax);
							banks.push(hold);
						} else {
							//hold.frame = frameDiceStart + diceFrameMax - 1;
							dice.push(hold);
						}
					}
					holdingCardId = touchingSomething;
				}

			// Not holding.
			} else {

				// Start holding.
				if ((holdingCardId != touchingCardId || rolling > holdingTime) && drawCounts <= 0 && rollingCounts <= 0) {

					// Start to hold released cards.
					if (holdingCardId == touchingReleased) {

						console.log("Start to hold released cards.");

						while (releasedCards.length > 0) {
							let card = releasedCards.pop();
							holdCards.push(card);
						}

					// Start to hold focusing cards.
					} else if (holdingCardId == touchingFocus && focusingCardId >= 0) {

						console.log("Start to hold focuses.");

						// Start to hold focusing hand cards.
						if (focusingCardId < handCards.length) {
							let j = focusingCardId;

							console.log("Start to hold focusing hand cards:" + j);

							if (handCards[j].frame != 0) {
								let card = handCards.splice(j, 1)[0];
								angle = card.angle = focuses[focuses.length - 1].angle;
								holdCards.push(card);
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;

								focusingCardId = touchingNothing;
								focuses.pop();
							}
						
						// Start to hold focusing playing cards.
						} else if (focusingCardId < handCards.length + playCards.length) {
							let j = focusingCardId - handCards.length;

							console.log("Start to hold focusing playing cards:" + j);

							if (playCards[j].frame != 0) {
								let card = playCards.splice(j, 1)[0];
								angle = card.angle = focuses[focuses.length - 1].angle;
								holdCards.push(card);
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
								touchingBoardPos = cubeVector(card.x, card.y);

								focusingCardId = touchingNothing;
								focuses.pop();
							}
						
						// Start to hold focusing trash cards.
						} else {

							console.log("Start to hold focusing trash cards:" + j);

							if (trashes[trashes.length - 1].frame != 0) {
								let card = trashes.pop();
								angle = card.angle = focuses[focuses.length - 1].angle;
								holdCards.push(card);
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
								//touchingBoardPos = cubeVector(card.x, card.y);

								focusingCardId = touchingNothing;
								focuses.pop();
							}
						}

					// Start to hold hand cards.
					} else if (holdingCardId >= 0 && holdingCardId < handCards.length) {
						let j = holdingCardId;

						console.log("Start to hold hand cards:" + j);

						if (j < handCards.length) {
							if (handCards[j].frame != 0) {
								let card = handCards.splice(j, 1)[0]
								/*if (opening <= 0) {
									card.flag = true;
								}*/
								holdCards.push(card);
								angle = 0;
								holdingCardId = touchingShade;
								touchingCardId = touchingShade;
							}
						}

					// Start to hold playing cards.
					} else if (holdingCardId >= handCards.length &&
						holdingCardId < handCards.length + playCards.length) {
						let j = holdingCardId - handCards.length;

						console.log("Start to hold playing cards:" + j);

						if (j < playCards.length) {
							if (playCards[j].frame != 0) {

								// Move the chip in the same location to higher.
								/*for (let k = 0; k < j; k++) {
									if (playCards[k].x == playCards[j].x && playCards[k].y == playCards[j].y) {
										if (playCards[k].z < 0) {
											for (let l = k; l < j; l++) {
												if (playCards[l].x == playCards[j].x && playCards[l].y == playCards[j].y) {
													playCards[l].z = playCards[l].z + 1;
												}
											}
										}
										break;
									}
								}*/

								let hold = playCards.splice(j, 1)[0];
								holdCards.push(hold);
								angle = hold.angle;
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
								touchingBoardPos = cubeVector(hold.x, hold.y);
								hold.x = hold.y = hold.z = 0;
							}
						}

					// Start to hold playing chips.
					} else if (holdingCardId >= handCards.length &&
						holdingCardId < handCards.length + playCards.length + playChips.length) {
						let j = holdingCardId - handCards.length - playCards.length;

						console.log("Start to hold playing chips:" + j);

						if (j < playChips.length) {
							if (playChips[j].frame != 0) {

								// Move the chip in the same location to higher.
								/*for (let k = 0; k < j; k++) {
									if (playChips[k].x == playChips[j].x && playChips[k].y == playChips[j].y) {
										if (playChips[k].z < 0) {
											for (let l = k; l < j; l++) {
												if (playChips[l].x == playChips[j].x && playChips[l].y == playChips[j].y) {
													playChips[l].z = playChips[l].z + 1;
												}
											}
										}
										break;
									}
								}*/

								let hold = playChips.splice(j, 1)[0];
								holdChips.push(hold);
								angle = hold.angle;
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
								touchingBoardPos = cubeVector(hold.x, hold.y);
								hold.x = hold.y = hold.z = 0;
							}
						}

					// Start to hold decks.
					} else if (holdingCardId == handCards.length + playCards.length + playChips.length + cardExtraDeck) {

						console.log("Start to hold decks.");

						if (decks.length > 0) {
							let j = decks.length - 1;
							if (decks[j].frame != 0) {
								let card = decks.pop();
								// Hide all cards.
								//card.frame = card.frame > 0 ? -card.frame : card.frame;
								//card.flag = true;
								holdCards.push(card);
								angle = 0;
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
							}
						}

					// Start to hold trashes.
					} else if (holdingCardId == handCards.length + playCards.length + playChips.length + cardExtraTrash) {

						console.log("Start to hold trashes.");

						if (trashes.length > 0) {
							let j = trashes.length - 1;
							if (trashes[j].frame != 0) {
								holdCards.push(trashes.splice(j, 1)[0]);
								angle = 0;
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
							}
						}

					// Start to hold banks.
					} else if (holdingCardId == handCards.length + playCards.length + playChips.length + cardExtraBank) {

						console.log("Start to hold banks.");

						if (banks.length > 0/* && opening <= 0*/) {
							let j = banks.length - 1;
							if (banks[j].frame != 0) {
								let chip = banks.pop();
								if (banks.length > 0) {
									banks[banks.length - 1].frame = chip.frame;
								}
								holdChips.push(chip);
								angle = 0;
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
							}
						}

					// Start to hold dice.
					} else if (holdingCardId == handCards.length + playCards.length + playChips.length + cardExtraDice) {

						console.log("Start to hold dice.");

						if (dice.length > 0) {
							let j = dice.length - 1;
							if (dice[j].frame != 0) {
								let chip = dice.pop();
								if (dice.length > 0) {
									dice[dice.length - 1].frame = frameDiceStart + diceFrameMax - 1;
								}
								holdChips.push(chip);
								angle = 0;
								holdingCardId = touchingSomething;
								touchingCardId = touchingSomething;
							}
						}

					}

					// Cancel focusing cards.
					/*if (touchingCardId == touchingSomething) {
						if (focuses.length > 0) {
							focuses.pop();
							focusingCardId = touchingNothing;
						}
					}*/
				}
			}

			// Roll sprites.
			if (result <= 0) {
				angle = cubeMod(angle + 20, 360);

				// Keep rolling.
				if (motion) {
					rolling = 0;

				// Timeout and show result.
				} else if (drawCounts > 0 && rolling > rollingMaxOnDraw) {
					angle = 0;
					result = 1;
					rolling = 1;
					drawCounts = 0;
					rollingCounts = 0;

				// Timeout and show result.
				} else if (rollingCounts > 0 && rolling > rollingMax) {
					angle = 0;
					result = 1;
					rolling = 1;
					drawCounts = 0;
					rollingCounts = 0;
				}

				//console.log("result="+result+" "+rolling+" drawCounts="+drawCounts+" rollingCounts="+rollingCounts);
			}

			// Update sprite animations.
			for (let i = 0; i < handCards.length + playCards.length + playChips.length + cardExtraMax; i++) {
				let n = frameNone;

				// Update hand cards.
				if (i < handCards.length) {
					let j = i;
					if (opening <= 0) {
						n = frameBlank;
					} else if (result <= 0 && rolling < rollingMaxOnDraw - 5 && j >= handCards.length - drawCounts) { // Drawing.
						n = frameBack;
					} else if (handCards[j].flag) {
						n = frameBack;
					} else {
						n = handCards[j].frame;
					}

				// Update playing cards.
				} else if (i < handCards.length + playCards.length) {
					let j = i - handCards.length;
					if (playCards[j].flag) {
						n = frameBack;
					} else {
						n = playCards[j].frame;
					}

				// Update playing chips.
				} else if (i < handCards.length + playCards.length + playChips.length) {
					let j = i - handCards.length - playCards.length;
					if (result <= 0 && rolling < rollingMax - 5 && j >= playChips.length - rollingCounts) { // Rolling.
						n = frameDiceStart + cubeRandom(diceFrameMax);
					} else if (playChips[j].flag) {
						n = frameBack;
					} else {
						n = playChips[j].frame;
					}

				// Update decks.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraDeck) {
					if (cardFrameMax > 0) {
						if (decks.length > 0) {
							n = frameBack;
						} else {
							n = frameBlank;
						}
					}

				// Update trashes.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraTrash) {
					if (cardFrameMax > 0) {
						if (trashes.length > 0) {
							if (trashes[trashes.length - 1].flag) {
								n = frameBack;
							} else {
								n = trashes[trashes.length - 1].frame;
							}
						} else {
							n = frameBlank;
						}
					}

				// Update banks.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraBank) {
					/*if (opening > 0) {
						n = frameBlank;
					} else if (opening <= 0 && chipFrameMax > 0) {*/
					if (chipCountsMax > 0) {
						if (banks.length > 0) {
							n = banks[banks.length - 1].frame;
						} else {
							n = frameNone;
						}
					}

				// Update dice.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraDice) {
					if (opening > 0) {
						//n = frameBlank;
					} else if (diceCounts > 0) {
						if (dice.length > 0) {
							n = dice[dice.length - 1].frame;
						} else {
							n = frameDiceStart + diceFrameMax - 1;
						}
					}

				// Update holding card/chip.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraHold) {
					if (holdCards.length > 0 && motion) {
						if (touchingBoardPos) {
							n = frameBlank;
						} else if (opening <= 0 && touchingCardId == touchingShade) {
							n = frameBlank;
						} else if (holdCards[holdCards.length - 1].flag) {
							n = frameBack;
						} else {
							n = holdCards[holdCards.length - 1].frame;
						}
					} else if (holdChips.length > 0 && motion) {
						if (holdChips[holdChips.length - 1].flag) {
							n = frameBack;
						} else {
							n = holdChips[holdChips.length - 1].frame;
						}
					} else {
						n = frameBlank;
					}

				// Update focusing card.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraFocus) {
					if (focuses.length > 0) {
						if (focuses[focuses.length - 1].flag) {
							n = frameBack;
						} else {
							n = focuses[focuses.length - 1].frame;
						}
					} else if (holdCards.length > 0 && motion) {
						//n = frameBlank;
						if (holdCards[holdCards.length - 1].flag) {
							n = frameBack;
						} else {
							n = holdCards[holdCards.length - 1].frame;
						}
					} else if (holdChips.length > 0 && motion) {
						n = holdChips[holdChips.length - 1].frame;
					} else {
						n = frameBlank;
					}
				}

				cubeAnimate(n, cardSprites[i]);
			}

			// Grid and center positions.
			let mx = screenSizeX * 1, my = screenSizeY * 1;
			let ox = (screenSizeX - mx) * 0.5, oy = (screenSizeY - my) * 0.5;

			// Reset buttons.
			for (let k = 0; k < buttonMax; k++) {
				cubeAnimate(0, buttonSprites[k]);
			}

			// Set sprite positions.
			for (let i = 0; i < handCards.length + playCards.length + playChips.length + cardExtraMax; i++) {
				let a0 = 1.0, s = 1.0, a = 0, sx = ox, sy = oy; // Default parameters.

				// Set hand card positions.
				if (i < handCards.length) {
					let j = i;

					// Alpha,Angle animation.
					if (i >= handCards.length - drawCounts) {

						// Drawing.
						if (rolling < rollingMaxOnDraw - 5) {
							a = angle;

						// Showing.
						} else if (rolling < rollingMaxOnDraw) {
							a0 = rolling < rollingMaxOnDraw ? 1 * (-0.5 + 0.1 * rolling) : 1 * 1.0;
						}

					// Focusing animation.
					} else if (focuses.length > 0) {
						if (focusingCardId < handCards.length) {
							a0 = 0;
						//} else if (focusingCardId == i) {
						//	a0 = 0;
						} else {
							a0 = 0.25;
						}

					// Drawing cards or rolling dice.
					//} else if (drawCounts > 0 || rollingCounts > 0) {
					//	a0 = 0.75;
					}

					// Position direct setting.
					let x = cubeMod(j, shadeGridLine);
					let y = cubeDiv(j, shadeGridLine);
					sx = (shadeSprites[0].pos.x - shadeSprites[0].size.x/2) + (x + 1) * shadeGridSize.x;
					sy = (shadeSprites[0].pos.y - shadeSprites[0].size.y/2 - shadeOffsets[0]) + (y + 1) * shadeGridSize.y;

					// Touching hand cards scale animation.
					if (touchingCardId == i) {
						s = handScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);

					// Touching hand shade scale animation.
					} else if (touchingCardId == touchingShade) {
						if (holdCards.length > 0) {
							if (j == touchingShadeL) {
								s = handScale * 1.1;
								sx = sx - 6 * handScale;
							} else if (j == touchingShadeR) {
								s = handScale * 1.1;
								sx = sx + 6 * handScale;
							}
						} else {
							s = handScale * (rolling < 5 ? (1.2 - 0.04 * rolling) : 1.0);
						}

					// Drawing scale animation.
					//} else if (rolling < 5 && i >= handCards.length - drawCounts && rollingCardId < 0) {
					//	s = handScale * (0.8 + 0.04 * rolling);

					} else {
						s = handScale;
					}

				// Set playing card positions.
				} else if (i < handCards.length + playCards.length) {
					let j = i - handCards.length;
					const margin = 1;

					// Position direct setting.
					let z = (playCards[j].z > 0 ? playCards[j].z : playCards[j].z / 2) * boardGridSize.y / stackCountsMax;
					sx = boardSprite.pos.x + playCards[j].x * boardGridSize.x;
					sy = boardSprite.pos.y + playCards[j].y * boardGridSize.y - z;

					// Touching scale animation.
					if (touchingCardId == i && releasedCardId < 0) {
						s = cardScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2)

					// Focusing animation.
					} else if (focuses.length > 0) {
						s = cardScale;
						if (focusingCardId == i) {
							a0 = 0;
						} else {
							a0 = 0.25;
						}

					// Drawing cards or rolling dice.
					//} else if (drawCounts > 0 || rollingCounts > 0) {
					//	s = cardScale;
					//	a0 = 0.75;

					// Default animation.
					} else {
						s = cardScale;
					}

					// Higher card alpha.
					if (playCards[j].z < 0) {
						a0 = a0 * 0.2;
					}

					// Rotation.
					a = playCards[j].angle;

					// Buttons on focusing.
					/*if (focusingCardId == i) {
						for (let k = 0; k < buttonMax; k++) {
							cubeAnimate(frameButtons[k], buttonSprites[k]);
							cubeDilute(0.2, buttonSprites[k]);
							let buttonScale = focusScale * 0.5;
							if (touchingButtonId == k) {
								buttonScale = focusScale * (rolling < 5 ? (1.2 - 0.02 * rolling) : 1.1);
							}
							cubeExpand(buttonScale, buttonSprites[k]);
							cubeMove(sx + focusScale * 40 * (k - 0.5), sy, buttonSprites[k]);
						}
					}*/

				// Set playing chip positions.
				} else if (i < handCards.length + playCards.length + playChips.length) {
					let j = i - handCards.length - playCards.length;
					const margin = 1;

					// Position direct setting.
					let z = (playChips[j].z > 0 ? playChips[j].z : playChips[j].z / 2) * boardGridSize.y / stackCountsMax;
					sx = boardSprite.pos.x + playChips[j].x * boardGridSize.x;
					sy = boardSprite.pos.y + playChips[j].y * boardGridSize.y - z;

					// Rotation.
					a = playChips[j].angle;

					// Alpha,Angle animation.
					if (j >= playChips.length - rollingCounts) {
						s = chipScale;

						// Drawing.
						if (rolling < rollingMax - 5) {
							a = angle;

						// Showing.
						} else if (rolling < rollingMax) {
							a0 = rolling < rollingMax ? 1 * (-0.5 + 0.1 * rolling) : 1 * 1.0;
						}

					// Touching scale animation.
					} else if (touchingCardId == i && releasedCardId < 0) {
						s = chipScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2)

					// Not focusing animation.
					} else if (focuses.length > 0) {
						s = chipScale;
						a0 = 0.25;

					// Touching dice animation.
					//} else if (touchingCardId == touchingRolling && playChips[j].frame < frameChipStart) {
					//	s = chipScale * 0.8;
					} else if (touchingCardId == handCards.length + playCards.length + playChips.length + cardExtraDice && playChips[j].frame < frameChipStart) {
						s = chipScale * 0.8;

					// Drawing cards or rolling dice.
					//} else if (drawCounts > 0 || (rollingCounts > 0 && playChips[j].frame >= frameChipStart)) {
					//	s = chipScale;
					//	a0 = 0.75;

					// Default animation.
					} else {
						s = chipScale;
					}

					// Higher chip alpha.
					if (playChips[j].z < 0) {
						a0 = a0 * 0.2;
					}

				// Set deck position.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraDeck) {
					sx = ox + mx * 1 / 4;
					sy = deckPosY;//oy + my * (0 + 2 * deckScale) / 18;

					if (decks.length <= 0) {
						a0 = 0.25;
					} else if (focuses.length > 0) {
						a0 = 0.25;

					//} else if (opening > 0) {
					//	a0 = (opening < 5 ? (1 - 0.05 * opening) : 0.5);

					//} else if (rollingCounts > 0) {
					//	a0 = 0.75;
					}

					// Scale animation.
					if (touchingCardId == i) {
						s = deckScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);
					} else {
						s = deckScale;
					}

					// Number.
					let m = cardFrameMax <= 0 ? frameNone :
						decks.length > frameDigitCounts ? frameNone :
						decks.length > 0 ? frameDigitStart + frameDigitDirs * decks.length : frameNone;
					cubeAnimate(m, counterSprites[cardExtraDeck]);
					cubeDilute(0.2, counterSprites[cardExtraDeck]);
					cubeExpand(0.5, counterSprites[cardExtraDeck]);
					cubeMove(sx, sy - deckScale * 20 - numberPosY, counterSprites[cardExtraDeck]);

					// Number.
					m = cardFrameMax <= 0 ? frameNone :
						handCards.length > frameDigitCounts ? frameNone :
						handCards.length > 0 ? frameDigitStart + frameDigitDirs * handCards.length : frameNone;
					cubeAnimate(m, counterSprites[cardExtraBank]);
					cubeDilute(0.2, counterSprites[cardExtraBank]);
					cubeExpand(0.5, counterSprites[cardExtraBank]);
					cubeMove(ox + mx / 2, sy - deckScale * 20 - numberPosY, counterSprites[cardExtraBank]);

				// Set trash position.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraTrash) {
					sx = ox + mx * 3 / 4;
					sy = deckPosY;//oy + my * (0 + 2 * deckScale) / 18;

					if (focuses.length > 0) {
						if (focusingCardId >= handCards.length + playCards.length) {
							a0 = 0;
						//} else if (focusingCardId == i) {
						//	a0 = 0;
						} else {
							a0 = 0.25;
						}

					} else if (trashes.length <= 0) {
						a0 = 0.25;

					//} else if (opening > 0) {
					//	a0 = (opening < 5 ? (1 - 0.05 * opening) : 0.5);

					// Drawing cards or rolling dice.
					//} else if (drawCounts > 0 || rollingCounts > 0) {
					//	a0 = 0.25;

					} else {
						a0 = 0.5;
					}

					// Scale animation.
					if (touchingCardId == i) {
						s = deckScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);
					} else {
						s = deckScale;
					}

					// Number.
					let m = cardFrameMax <= 0 ? frameNone :
						trashes.length > frameDigitCounts ? frameNone :
						trashes.length > 0 ? frameDigitStart + frameDigitDirs * trashes.length : frameNone;
					cubeAnimate(m, counterSprites[cardExtraTrash]);
					cubeDilute(0.2, counterSprites[cardExtraTrash]);
					cubeExpand(0.5, counterSprites[cardExtraTrash]);
					cubeMove(sx, sy - deckScale * 20 - numberPosY, counterSprites[cardExtraTrash]);

				// Set bank position.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraBank) {
					sx = ox + mx * 1 / 2;
					sy = bankPosY;//oy + my * (0 + 2 * deckScale) / 18;

					if (focuses.length > 0) {
						a0 = 0.25;

					//} else if (opening > 0) {
					//	a0 = (opening < 5 ? (1 - 0.05 * opening) : 0.5);

					//} else if (opening > 0) {
					//	a0 = 0.1;

					// Drawing cards or rolling dice.
					//} else if (drawCounts > 0 || rollingCounts > 0) {
					//	a0 = 0.5;
					}

					// Scale animation.
					/*if (opening > 0) {
						if (touchingCardId == i) {
							s = bankScale * (rolling < 5 ? (1.0 - 0.04 * rolling) : 0.8);
						} else {
							s = bankScale * 0.8;
						}
					} else {*/
						if (touchingCardId == i) {
							s = bankScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);
						} else {
							s = bankScale;
						}
					//}

				// Set dice position.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraDice) {
					sx = ox + mx * 1 / 2;
					sy = dicePosY;//oy + my * (0 + 2 * deckScale) / 18;

					if (focuses.length > 0) {
						a0 = 0.25;

					//} else if (opening > 0) {
					//	a0 = 0.5;//(opening < 5 ? (1 - 0.05 * opening) : 0.5);

					// Drawing cards or rolling dice.
					//} else if (drawCounts > 0 || (rollingCounts > 0 && dice.length <= 0)) {
					//	a0 = 0.25;

					} else if (dice.length <= 0) {
						a0 = 0.5;
					} else {
						a0 = 1;
					}

					// Scale animation.
					if (touchingCardId == touchingClosing) {
						s = diceScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);
					} else if (touchingCardId == touchingRolling) {
						s = diceScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);
					} else if (touchingCardId == i) {
						s = diceScale * (rolling < 5 ? (1.4 - 0.04 * rolling) : 1.2);
					} else if (dice.length <= 0) {
						s = diceScale * 0.8;
					} else {
						s = diceScale;
					}

				// Set holding card/chip position.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraHold) {

					// Set holding card position.
					if (holdCards.length > 0 && motion) {
						let localPos = cubeScreenLocalPos(motion);
						sx = localPos.x;
						sy = localPos.y;

						if (touchingBoardPos) {
							a0 = 0.8;
						}

						// Scale.
						s = holdScale * 1.2;

						// Rotation.
						a = holdCards[holdCards.length - 1].angle;

					// Set holding chip position.
					} else if (holdChips.length > 0 && motion) {
						let localPos = cubeScreenLocalPos(motion);
						sx = localPos.x;
						sy = localPos.y;

						if (touchingBoardPos) {
							a0 = 0.8;
						}

						// Scale.
						s = holdScale * 1.2;

						// Rotation.
						a = holdChips[holdChips.length - 1].angle;
					} else {
						a0 = 0;
					}

				// Set focusing hand/playing/trash card position.
				} else if (i == handCards.length + playCards.length + playChips.length + cardExtraFocus) {

					// Set focuses position.
					if (focuses.length > 0) {
						let focusScale = 1;

						// Focusing hand card.
						if (focusingCardId < handCards.length) {
							focusScale = handFocusScale;

							sx = ox + mx * 1 / 2;
							sy = (shadeSprites[0].pos.y - shadeSprites[0].size.y/2 + focusPosY);

							if (touchingCardId == touchingFocus) {
								s = handFocusScale * (rolling < 5 ? (1.2 - 0.02 * rolling) : 1.1);
							} else {
								s = handFocusScale;
							}

							// Rotation animation..
							a = focuses[focuses.length - 1].angle;

						// Focusing playing card.
						} else if (focusingCardId < handCards.length + playCards.length) {
							focusScale = playFocusScale;
							let j = focusingCardId - handCards.length;

							// Position direct setting.
							sx = boardSprite.pos.x + playCards[j].x * boardGridSize.x;
							sy = boardSprite.pos.y + playCards[j].y * boardGridSize.y;

							if (touchingCardId == touchingFocus) {
								s = playFocusScale * (rolling < 5 ? (1.2 - 0.02 * rolling) : 1.1);
							} else {
								s = playFocusScale;
							}

							// Rotation.
							a = focuses[focuses.length - 1].angle;

						// Focusing trash card.
						} else {
							focusScale = handFocusScale;

							sx = ox + mx * 1 / 2;
							sy = (shadeSprites[0].pos.y - shadeSprites[0].size.y/2 + focusPosY);

							if (touchingCardId == touchingFocus) {
								s = handFocusScale * (rolling < 5 ? (1.2 - 0.02 * rolling) : 1.1);
							} else {
								s = handFocusScale;
							}

							// Rotation animation..
							a = focuses[focuses.length - 1].angle;
						}

						// Buttons on focusing.
						for (let k = 0; k < buttonMax; k++) {
							cubeAnimate(frameButtons[k], buttonSprites[k]);
							cubeDilute(0.2, buttonSprites[k]);
							let buttonScale = focusScale * 0.5;;
							if (touchingButtonId == k) {
								buttonScale = focusScale * (rolling < 5 ? (1.2 - 0.02 * rolling) : 1.1);
							}
							cubeExpand(buttonScale, buttonSprites[k]);
							cubeMove(sx + focusScale * 40 * (k - 0.5), sy, buttonSprites[k]);
						}

					// Set holding card shade position.
					} else if (holdCards.length > 0 && touchingBoardPos) {

						// Position direct setting.
						sx = boardSprite.pos.x + touchingBoardPos.x * boardGridSize.x;
						sy = boardSprite.pos.y + touchingBoardPos.y * boardGridSize.y;
						s = holdScale;
						a0 = 0.4;
						s = holdScale * 1.0;

						// Rotation.
						a = holdCards[holdCards.length - 1].angle;

					// Set holding chip shade position.
					} else if (holdChips.length > 0 && touchingBoardPos) {

						// Position direct setting.
						sx = boardSprite.pos.x + touchingBoardPos.x * boardGridSize.x;
						sy = boardSprite.pos.y + touchingBoardPos.y * boardGridSize.y;
						s = holdScale;
						a0 = 0.4;
						s = holdScale * 1.0;

						// Rotation.
						a = holdChips[holdChips.length - 1].angle;

					} else {

						a0 = 0;
					}
				}

				// Update transformations.
				cubeDilute(a0, cardSprites[i]);
				cubeExpand(s * cardSpriteScale, cardSprites[i]);
				cubeRotate(a, cardSprites[i]);
				cubeMove(sx, sy, cardSprites[i]);
			}

			// Update shade animation.
			for (let i = 0; i < shadeSpriteMax; i++) {
				let j = touchingShade - i;
				let a = 0;
				if (opening > 0 && i == 0) {
					if (touchingCardId == j) {
						a = (rolling < 5 ? (0.5 * 0.10 * rolling) : 1.0);
					} else {
						a = 0.5;
					}
				} else if ((touchingCardId == j || (touchingCardId >= 0 && touchingCardId < handCards.length && i == 0)) &&
					(holdCards.length > 0 || (cardCountsMax > 0 && focuses.length <= 0 && handCards.length > 0))) {
					a = (rolling < 5 ? (0.3 * 0.04 * rolling) : 0.5);
				}
				cubeDilute(a, shadeSprites[i]);
			}

			// Clear screen.
			cubeClear();
			cubeDraw(boardSprite);
			for (let i = 0; i < shadeSpriteMax; i++) {
				cubeDraw(shadeSprites[i]);
			}

			// Draw sprites.
			for (let i = 0; i < counterMax; i++) {
				cubeDraw(counterSprites[i]);
			}
			for (let i = 0; i < buttonMax; i++) {
				cubeDraw(buttonSprites[i]);
			}
			cubeDraw(cardSprites[handCards.length + playCards.length + playChips.length + cardExtraDeck]);
			cubeDraw(cardSprites[handCards.length + playCards.length + playChips.length + cardExtraTrash]);
			cubeDraw(cardSprites[handCards.length + playCards.length + playChips.length + cardExtraBank]);
			cubeDraw(cardSprites[handCards.length + playCards.length + playChips.length + cardExtraDice]);
			for (let i = 0; i < handCards.length + playCards.length + playChips.length; i++) {
				cubeDraw(cardSprites[i]);
			}
			cubeDraw(cardSprites[handCards.length + playCards.length + playChips.length + cardExtraHold]);
			cubeDraw(cardSprites[handCards.length + playCards.length + playChips.length + cardExtraFocus]);

			await cubeWait(10);
		}
	}
})();
