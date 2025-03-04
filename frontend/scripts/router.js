import http from 'http'

export class Router {
    constructor(pages){
        this.pages = pages
        this.apis = [ 'get_events', 'get_snapshot', 'post_event' ]
        this.callbacks = {}
        this.backend_url = 'http://127.0.0.1:5000/'
    }

    /**
     * Routes incomming requests to the correct page
     * @param {http.IncomingMessage} request 
     * @param {http.ServerResponse} result
     */
    async route(request, result) {
        if (request.url == '/'){
            return this.pages['index.html']
        }
        
        var page = request.url
        if (!page.includes('.')){
            page += '.html'
        }
        if (page in this.pages){
            result.end(this.render_page(page, this.pages[page]));
            return
        }
        
        page = page.replace('.html', '')
        var api = page.split('/')[1]
        if (this.apis.includes(api)){
            if (api == 'post_event'){
                
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk;
                });
                request.on('end', () => {
                    this.post_event(body)
                    result.write('OK'); 
                    result.statusCode = 200
                    result.end(); 
                });
            }
            else if (api == 'get_events'){
                var evs = await this.get_events(page.split('/')[2])
                result.end(JSON.stringify(evs))
            }
            else if (api == 'get_snapshot'){
                var snap = await this.get_snapshot()
                result.end(JSON.stringify(snap))
                return 

            }
            return null
        }

        return 'unknown page'
    }

    async post_event(event){
        fetch(this.backend_url + 'input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event
        });
    }

    async get_snapshot(){
        var snapshot = null
        await fetch(
            this.backend_url + 'snapshot', 
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        ).then(async (response) => {
            var s = await response.json()
            snapshot = s
        })
        return snapshot
    }

    async get_events(id){
        var evs = null
        // console.log(`fetching from: ${this.backend_url + 'events/' + id}`)
        await fetch(this.backend_url + 'events/' + id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(async (response) => {
            // console.log(response)
            var events = await response.json()
            evs = events
            return 
        })
        // console.log(evs)
        return evs
    }

    /**
     * render the page
     * @param {string} page 
     * @param {string} content 
     * @returns 
     */
    render_page(page, content){
        if (page in this.callbacks){
            this.callbacks[page].forEach(callback => {
                content = callback(content)
            });
        }
        return content
    }

    register_callback(page, callback) {
        if (!(page in this.callbacks)){
            this.callbacks[page] = []
        }
        this.callbacks[page].append(callback)
    }
}