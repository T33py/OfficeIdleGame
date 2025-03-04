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

    router.route(req, res)
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`)
});