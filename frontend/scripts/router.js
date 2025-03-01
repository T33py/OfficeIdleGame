import http from 'http'

export class Router {
    constructor(pages){
        this.pages = pages
        this.apis = [ 'get_events', 'get_snapshot', 'post_event' ]
        this.callbacks = {}
    }

    /**
     * Routes incomming requests to the correct page
     * @param {http.IncomingMessage} request 
     * @returns Rendered HTML page
     */
    route(request) {
        console.log(request.url)
        if (request.url == '/'){
            return this.pages['index.html']
        }
        
        var page = request.url
        if (!page.includes('.')){
            page += '.html'
        }
        if (page in this.pages){
            return this.render_page(page, this.pages[page])
        }
        
        page = page.replace('.html', '').replace('/', '').replace(' ', '')
        if (this.apis.includes(page)){
            if (page == 'post_event'){
                console.log('POST')
                this.post_event(request)
            }
            return null
        }

        return 'unknown page'
    }

    async post_event(event){
        fetch('http://127.0.0.1:5000/input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event
        });
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