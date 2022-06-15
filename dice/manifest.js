// Web app manifest for progressive web app.
const manifest = {
    "name": "Dice",
    "short_name": "Dice",
    "scope": "/dice/",
    "resource": "resource.svg",
    "params": {
        "dice": {
            "count": [1, 16],
            "face": [10, 21]
        },
        "board": {
            "size": 10,
            "type": 1,
            "count": 0
        }
    },
    "service": "../square/square-service.js"
};

