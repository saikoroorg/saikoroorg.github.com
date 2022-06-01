// Web app manifest for progressive web app.
const manifest = {
    "name": "Dice",
    "version": "0.8.20601",
    "short_name": "Dice",
    "author": "saikoro.org",
    "background_color": "#000",
    "theme_color": "#000",
    "icons": [{
        "src": "icon.png",
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
            "face": [10, 20]
        },
        "players": [1,1],
        "seed": 0
    },//*/
    "json": "manifest.json"
};

