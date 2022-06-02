/* Manifest. */
const manifest = {
    "name": "Goban",
    "version": "0.8.20602",
    "short_name": "Goban",
    "author": "saikoro.org",
    "scope": "/goban/",
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
            "count": [0, 0],
            "face": [0, 10]
        },
        "cards": {
            "count": 0,
            "faces": []
        },
        "board": {
            "size": 8,
            "type": 1,
            "face": [2, 0]
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
