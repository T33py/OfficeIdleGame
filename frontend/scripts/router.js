import http from 'http'

export class Router {
    constructor(pages){
        this.pages = pages
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
            return this.pages['index']
        }
        
        var page = request.url.replace('/', '')
        if (page in this.pages){
            var content = this.render_page(this.pages[page])
            return content
        }

        return 'unknown page'
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