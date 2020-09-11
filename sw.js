const weatherAppCacheName = "dev-weatherApp-v1";

const assets = [
    "/",
    "/index.html",
    "/favicon.ico",
    "/css/style.css",
    "/js/app.js",
    "/images/logo/WeatherAppLogo.png",
    "/images/logo/WeatherAppLogofull.png",
    "/images/background/mountain_view.jpg",
]

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetchUrl );

async function onInstall(evt){
    console.log(`starting ${weatherAppCacheName} and is installed`);
    self.skipWaiting();
}

function onActivate(evt){
    evt.waitUntil(handleActivation());
    cleanCache();
}

async function handleActivation(){
    await preCache();
}

async function preCache(){
    caches.open(weatherAppCacheName).then( cache => cache.addAll(assets));
}

function cacheFetches(request, response){
    if(response.type === "error" || response.type =="opaque"){
        return Promise.resolve();
    }

    caches
        .open(weatherAppCacheName)
        .then(caches => caches.put(request, response.clone()));
}

function cleanCache(){
    return caches
        .keys()
        .then(keys => keys.filter(key => key !== weatherAppCacheName))
        .then(keys => 
            Promise.all(
                keys.map(key => {
                    console.log(`Deleting cache $(key)`);
                    return caches.delete(key);
                })
            )
        );   
}

function update(request){
    return fetch(request.url).then(
        response =>
            cache(request, request)
            .then(() => response)
    );
}

async function refresh(response) {
    return response
        .json() // read and parse JSON response
        .then(jsonResponse => {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                // report and send new data to client
                client.postMessage(
                    JSON.stringify({
                    type: response.url,
                    data: jsonResponse.data
                    })
                );
            });
        });
        return jsonResponse.data; // resolve promise with new data
    });
}

async function onFetchUrl(evt){
    if (evt.request.url.includes("/http://api.openweathermap.org/data/2.5/weather/")){
            evt.respondWith(caches.match(evt.request));
            evt.waitUnitl(update(evt.request).then(refresh));
    } else{
        evt.respondWith(
            caches
                .match(evt.request)
                .then(cached => cached || fetch(evt.request))
                .then( response => cacheFetches(evt.request, response))
                .then(() => response)
        );
    }
}



