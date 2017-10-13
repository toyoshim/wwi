self.addEventListener('install', e => {
    e.waitUntil(caches.open('wwi-contents-cache-v1').then(cache => {
        console.log('installing to cache');
        return Promise.all([
            './index.html',
            './manifest.json',
            './BreathController.js',
            './TouchController.js',
        ].map(url => {
            console.log('fetching ' + url + '...');
            return fetch(new Request(url)).then(response => {
                console.log(' ... ' + url + ': status=' + response.status);
                if (response.ok)
                    return cache.put(url, response);
                return Promise.reject('fetch error :' + url + ', status=' + response.status);
            });
        }));
    }));
});

self.addEventListener('fetch', e => {
    caches.match(e.request).catch(() => {
        console.log('forwarding: ' + e.request.url);
        return fetch(e.request);
    }).then(response => {
        return response;
    });
});
