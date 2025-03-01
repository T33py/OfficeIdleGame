import * as fs from 'node:fs'


export function get_pages(){
    var pages = {}
    var files = fs.readdirSync('pages')
    files.forEach(file => {
        if (file.includes('.html')){
            var page_name = file.replace('.html', '')
            pages[page_name] = fs.readFileSync('pages/' + file)
        }
    });
    return pages
}
