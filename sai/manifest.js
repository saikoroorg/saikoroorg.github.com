/* Manifest. */
const manifest = {
    "name": "Sai",
    "version": "0.8.20603",
    "short_name": "Sai",
    "author": "saikoro.org",
    "scope": "/sai/",
    "background_color": "#000",
    "theme_color": "#000",
    "icons": [{
        "src": "./icon.svg",
        "sizes": "300x300",
        "type": "image/svg"
    }],
    //*
    "resource": "../resource.png",
    "params": {
        "dice": {
            "count": [1, 9],
            "face": [6, 10]
        },
        "board": {
            "size": 6,
            "type": 1
        },
        "players": [1, 1],
        "seed": 0
    },
    "contents": ["./"],
    //*/
    "start_url": "./" + (window.location.search ? window.location.search + "&" : "?") + "app=1",
    "display": "standalone",
    "service": "../square/square-service.js"
};
