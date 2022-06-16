// App settings.
const manifest = {
    "name": "Goban",
    "short_name": "Goban",
    "scope": "/goban/",
    "resource": "resource.png",
    "params": {
        "dice": {
            "face": 10
        },
        "board": {
            "size": 8,
            "type": 1,
            "count": 81,
            "face": 2
        }
    },
    "service": "../square/square-service.js"
};
