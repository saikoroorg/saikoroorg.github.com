/* Manifest. */
const manifest = {
    "name": "Karuta",
    "version": "0.8.20603",
    "short_name": "Karuta",
    "author": "saikoro.org",
    "scope": "/karuta/",
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
        "cards": {
            "count": [1, 54],
            "faces": [54]
        },
        "board": {
            "size": 6,
            "type": 1,
            "count": 0
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
