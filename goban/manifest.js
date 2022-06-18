// App settings.
const manifest = {
	"name": "Goban",
	"short_name": "Goban",
	"scope": "/goban/",
	"resource": "../square/resource.png",
	"params": {
		"dice": {
			"face": 20
		},
		//* //goban
		"board": {
			"size": 8,
			"type": 1,
			"face": 2,
			"count": 64
		},
		"players": [1, 1]
		/*/ //reversi
		"board": {
			"size": 8,
			"type": 0,
			"face": 1,
			"flip": 2,
			"count": 64,
			"place": [[1,4,4],[2,5,4],[2,4,5],[1,5,5]]
		},
		"players": [1, 1]
		/* //chess
		"board": {
			"size": 8,
			"type": 0,
			"face": 12,
			"count": 32,
			"place": [
				[9,1,1],[5,2,1],[7,3,1],[11,4,1],[13,5,1],[7,6,1],[5,7,1],[9,8,1],
				[3,1,2],[3,2,2],[3,3,2],[3,4,2],[3,5,2],[3,6,2],[3,7,2],[3,8,2],
				[4,1,7],[4,2,7],[4,3,7],[4,4,7],[4,5,7],[4,6,7],[4,7,7],[4,8,7],
				[10,1,8],[6,2,8],[8,3,8],[12,4,8],[14,5,8],[8,6,8],[6,7,8],[10,8,8]]
		},
		"players": [1, 2]
		//*/
	},
	"service": "../square/square-service.js"
};

// reversi: b1x2x8&b=a54b44a45b55
// checker: 24b2x2x8&p=1/2&b=a18a38a58a78a27a47a67a87a16a36a56a76b23b43b63b83b12b32b52b72b21b41b61b81
// chess: 32b12x8&p=1/2&b=i11e21g31k41m51g61e71i81c12c22c32c42c52c62c72c82d17d27d37d47d57d67d77d87j18f28h38l48n58h68f78j88

