/* Manifest. */
const manifest = {
    "name": "Saikoro.org",
    "version": "0.8.20613",
    "short_name": "Saikoro",
    "author": "saikoro.org",
    "scope": "/",
    "background_color": "#000",
    "theme_color": "#000",
    "icons": [{
        "src": "./icon.svg",
        "sizes": "300x300",
        "type": "image/svg"
    },{
        "src": "./icon.png",
        "sizes": "192x192",
        "type": "image/png"
    }],
    /*
    "resource": "resource.png",
    "params": {
        "dice": {
            "count": [1, 9],
            "face": [6, 10]
        },
        "cards": {
            "count": [0, 0],
            "faces": [54]
        },
        "board": {
            "size": 6,
            "type": 1,
            "count": 0,
            "face": [1, 6]
        },
        "players": [1, 1],
        "seed": 0
    },
    "contents": ["./"],
    //*/
    "start_url": "./" + (window.location.search ? window.location.search + "&" : "?") + "app=1",
    "display": "standalone",
    "service": "./square/square-service.js"
};
