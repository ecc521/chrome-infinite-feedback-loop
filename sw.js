function messageAllClients(message) {
return self.clients.matchAll().then(clients => {
  clients.forEach(client => client.postMessage(message));
})
}

const cacheName = "rivers.run"
const waitOnFirstLoad = 2500 //Milliseconds to wait before fetching items on preload list. Helps prevent duplicate requests on first load.

self.addEventListener("install", function() {
    self.skipWaiting()
})


//Milliseconds to wait for network response before using cache
//When set to 0, cached data will be returned immediately, and cache will be updated in background.
const defaultWaitPeriod = 0


function fetchHandler(event) {
    event.respondWith((async function(){
		let waitperiod = defaultWaitPeriod

        let cache = await caches.open(cacheName)

        let url = event.request.url

        let fromcache = await caches.match(url)

        //If it is less than 5 minutes old, return the cached data.
        //Note that the date header isn't always set.
		if (fromcache && Date.now() - new Date(fromcache.headers.get("date")).getTime() < 60*1000*5) {
			return fromcache
		}

		let fromnetwork = fetch(event.request)

        if (!fromcache) {
            //No cache. All we can do is return network response
            let response = await fromnetwork
            await cache.put(url, response.clone())
            return response
        }
        else {

            //We have cached data
            return new Promise(function(resolve, reject){

				let served = 0

                //If the fetch event fails (ex. offline), return cached immediately
                fromnetwork.catch(function(e){
					messageAllClients(url + " errored. Using cache.")
					if (!served) {
						served = 1
						resolve(fromcache)
					}
                })

				//Fetch from network and update cache
                fromnetwork.then(function(response){
					let otherServed = served
					served = 1
                    cache.put(url, response.clone()).then(() => {
						if (otherServed) {
							messageAllClients("Updated cache for " + url)
						}
						else {
							messageAllClients(url + " has been loaded from the network")
						}
						resolve(response)
					})
                })


                    //If the network doesn't respond quickly enough, use cached data
                    setTimeout(function(){
						if (!served) {
							served = 1
                        	messageAllClients(url + " took too long to load from network. Using cache")
							resolve(fromcache)
						}
                    }, waitperiod)
                })
            }
    }()))
}

self.addEventListener("fetch", fetchHandler)


