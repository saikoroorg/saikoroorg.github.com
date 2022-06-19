// App settings.
const manifest = {
	"name": "Goban",
	"short_name": "Goban",
	"scope": "/goban/",
	"resource": "../square/resource.png",
	"params": {
		"dice": {
			"face": 10
		},
		//* //goban
		"board": {
			"size": 8,
			"type": 1,
			"face": 2,
			"count": 64
		},
		"players": [1, 1]
		/* //reversi
		"board": {
			"size": 8,
			"type": 0,
			"face": 1,
			"flip": 2,
			"count": 64,
			"place": [[2,4,4],[1,5,4],[1,4,5],[2,5,5]]
		},
		"players": [1, 1]
		/* //chess
		"board": {
			"size": 8,
			"type": 0,
			"face": 12,
			"count": 32,
			"place": [
				[7,1,1],[3,2,1],[5,3,1],[9,4,1],[11,5,1],[5,6,1],[3,7,1],[7,8,1],
				[1,1,2],[1,2,2],[1,3,2],[1,4,2],[1,5,2],[1,6,2],[1,7,2],[1,8,2],
				[2,1,7],[2,2,7],[2,3,7],[2,4,7],[2,5,7],[2,6,7],[2,7,7],[2,8,7],
				[8,1,8],[4,2,8],[6,3,8],[10,4,8],[12,5,8],[6,6,8],[4,7,8],[8,8,8]]
		},
		"players": [1, 2]
		//*/
	},
	"service": "../square/square-service.js"
};

// reversi: b1x2x8&b=b44a54a45b55
// checker: 24b2x8&p=1/2&b=a23a43a63a83a12a32a52a72a21a41a61a81b18b38b58b78b27b47b67b87b16b36b56b76
// chess: 32b12x8&p=1/2&b=g11c21e31i41k51e61c71g81a12a22a32a42a52a62a72a82b17b27b37b47b57b67b77b87h18d28f38j48l58f68d78h88

