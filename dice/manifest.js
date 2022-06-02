// Web app manifest for progressive web app.
const manifest = {
    "name": "Dice",
    "version": "0.8.20601",
    "short_name": "Dice",
    "author": "saikoro.org",
    "background_color": "#fff",
    "theme_color": "#fff",
    "icons": [{
        "src": "./icon.svg",
        "sizes": "300x300",
        "type": "image/svg"
    },{
        "src": "./icon.png",
        "sizes": "192x192",
        "type": "image/png"
    }],
    "start_url": "./" + (window.location.search ? window.location.search + "&" : "?") + "app=1",
    "scope": "/dice/",
    "display": "standalone",
    //*/
    "resource": "resource.svg",
    "params": {
        "dice": {
            "count": [1, 16],
            "face": [10, 21]
        },
        "board": {
            "size": 10,
            "type": 1,
        },
        "players": [1,1],
        "seed": 0
    },//*/
    "json": "manifest.json"
};

