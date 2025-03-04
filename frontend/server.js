import * as fs from 'node:fs'
import http from 'http' 
import { get_pages } from './scripts/page_setup.js';
import { Router } from './scripts/router.js'
import * as os from 'os'

const hostname = getLocalIpAddress();
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



function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      for (const iface of interfaces[interfaceName]) {
        // Skip over internal (loopback) and non-IPv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '0.0.0.0'; // Fallback if no IP address is found
  }