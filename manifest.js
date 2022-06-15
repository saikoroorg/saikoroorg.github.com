/* Manifest. */
const manifest = {
    "name": "Saikoro.org",
    "short_name": "Saikoro",
    "scope": "/",
    "params": {
        "dice": {
            "count": [1, 9],
            "face": [6, 9]
        },
        "cards": {
            "count": [0, 0],
            "faces": [54]
        },
        "board": {
            "size": 6,
            "type": 1,
            "count": 0,
            "face": [1, 4]
        },
        "players": [1, 1],
        "seed": 0
    },
    "service": "./square/square-service.js"
};
