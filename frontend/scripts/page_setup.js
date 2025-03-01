import * as fs from 'node:fs'


export function get_pages(){
    var pages = {}
    var files = fs.readdirSync('pages')
    files.forEach(file => { 
        pages['/' + file] = fs.readFileSync('pages/' + file)
    });
    return pages
}
