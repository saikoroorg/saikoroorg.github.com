/* SQUARE User App Service Worker. */

// Namespace.
var square = square || {};

square.manifest = {
    "name": "Square",
    "version": "0.8.20616",
    "short_name": "Square",
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
    "params": {
        "dice": {
            "count": [1, 9],
            "face": [6, 9]
        },
        "cards": {
            "count": [0, 10],
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
    "contents": ["./"],
    "start_url": "./" + (window.location.search ? window.location.search + "&" : "?") + "app=1",
    "display": "standalone",
    "service": "./square/square-service.js"
};

// Merge manifest.
if (manifest) {
    Object.assign(square.manifest, manifest);
}
//console.log("Manifest:" + JSON.stringify(square.manifest));

// Manifest json filename.
const manifestjson = "manifest.json";

// Script for client to register service worker.
if (!self || !self.registration) {

    // Set manifest parameters.
    document.querySelector("#title").innerText = document.querySelector("title").innerText = square.manifest.name;
    document.querySelector("#author").innerText = square.manifest.author + square.manifest.scope.slice(0, -1);
    document.querySelector("#version").innerText = "#" + square.manifest.version.substr(-4);
    document.querySelector("#icon").src = square.manifest.icons[0].src;

    let head = document.querySelector("head");
    let link = document.createElement("link");
    link.setAttribute("rel", "manifest");
    link.setAttribute("href", manifestjson);
    head.appendChild(link);

    //const str = JSON.stringify(manifest);
    //const blob = new Blob([str], {type: 'application/json'});
    //const url = URL.createObjectURL(blob);
    //document.querySelector('#manifest').setAttribute('href', url);

    navigator.serviceWorker.register(square.manifest.service, {"scope": square.manifest.scope});

// Script for service worker.
} else {
    const identifier = manifest.name + "/" + manifest.version;

    // Event on installing service worker.
    self.addEventListener("install", (evt) => {

        // Cache all contents.
        evt.waitUntil(caches.open(identifier).then((cache) => {

            // Contents to cache.
            // (need to set relative path "./" or absolute path "/")
            return cache.addAll(square.manifest.contents).then(() => self.skipWaiting());
        }));
    });

    // Event on activating service worker.
    self.addEventListener("activate", (evt) => {

        // Delete old cache files when the cache version updated.
        evt.waitUntil(caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key != identifier) {
                    return caches.delete(key);
                }
            }));
        }));
    });

    // Event on fetching network request.
    self.addEventListener("fetch", (evt) => {

        // Returns manifest.
        let reqCloned = evt.request.clone();
        if (reqCloned.url.match(manifestjson + "$")) {

            let res = new Response(JSON.stringify(square.manifest),
                {"status": 200, "statusText": "OK",
                 "headers": {"Content-Type": "application/json"}});
            evt.respondWith(res);

        // Returns the cache file that matches the request.
        } else {
            evt.respondWith(caches.match(reqCloned, {ignoreSearch: true}).then((res) => {

                // Fetch if not found.
                return res || fetch(reqCloned).then((res) => {

                    // Cache the fetched file.
                    if (res.ok) {
                        let resCloned = res.clone();
                        caches.open(identifier).then((cache) => {
                            cache.put(evt.request, resCloned);
                        });
                    }

                    // Returns the fetched file.
                    return res;
                });
            }));
        }
    });
}
