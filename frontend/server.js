import * as fs from 'node:fs'
import http from 'http' 
import { get_pages } from './scripts/page_setup.js';
import { Router } from './scripts/router.js'

const hostname = '127.0.0.1';
const port = 5001;
// const index = fs.readFileSync('index.html');
const router = new Router(get_pages())

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    if (req.method == 'POST'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            console.log(body);
            router.post_event(body)
            res.write('OK'); 
            res.statusCode = 200
            res.end(); 
        });
    }
    else if(req.method == 'GET'){
        var result = router.route(req)
        if (result == null) {
            res.statusCode = 400
            res.end('ERROR!!!')
            return
        }
        res.end(result);
}
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`)
});