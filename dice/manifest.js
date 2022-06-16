// App settings.
const manifest = {
    "name": "Dice",
    "short_name": "Dice",
    "scope": "/dice/",
    "resource": "resource.svg",
    "params": {
        "dice": {
            "count": 10,
            "roll": 1,
            "face": 10
        },
        "board": {
            "size": 10,
            "type": 1,
            "count": 0
        }
    },
    "service": "../square/square-service.js"
};

