class Library extends Model {
    /*Eventos Iniciais */
    constructor() {
        super();
        /*Variáveis */
    }
    /*Variáveis Getter Static */
    static get mimeTypes(){
        return {
            'aac': 'audio/aac', 'abw': 'application/x-abiword',
            'arc': 'application/octet-stream', 'avi': 'video/x-msvideo',
            'azw': 'application/vnd.amazon.ebook', 'bin': 'application/octet-stream',
            'bmp': 'image/bmp', 'bz': 'application/x-bzip', 'bz2': 'application/x-bzip2',
            'csh': 'application/x-csh', 'css': 'text/css', 'csv': 'text/csv',
            'doc': 'application/msword', 'eot': 'application/vnd.ms-fontobject',
            'epub': 'application/epub+zip', 'gif': 'image/gif', 'htm': 'text/html',
            'html': 'text/html', 'ico': 'image/x-icon', 'ics': 'text/calendar',
            'jar': 'application/java-archive', 'jpeg': 'image/jpeg', 'jpg': 'image/jpeg',
            'js': 'application/javascript', 'json': 'application/json', 'mid': 'audio/midi',
            'midi': 'audio/midi', 'mpeg': 'video/mpeg', 'mp2': 'audio/mpeg', 'mp3': 'audio/mpeg3',/* ... */
            'png': 'image/png', 'pdf': 'application/pdf', 'ppt': 'application/vnd.ms-powerpoint',
            'rar': 'application/x-rar-compressed', 'rtf': 'application/rtf',
            'sh': 'application/x-sh', 'svg': 'image/svg+xml', 'swf': 'application/x-shockwave-flash',
            'tar': 'application/x-tar', 'tif': 'image/tiff', 'tiff': 'image/tiff',/* ... */
            'xls': 'application/vnd.ms-excel', 'xlsx': 'application/vnd.ms-excel',
            'xml': 'application/xml', 'xul': 'application/vnd.mozilla.xul+xml', 'zip': 'application/zip',
            '3gp': 'video/3gpp', '3g2': 'video/3gpp2', '7z': 'application/x-7z-compressed'

        };
    }
    /*Funções Static */
    static getMimeTypeByExt(ext){
        const mimeTypes = Library.mimeTypes;
        return mimeTypes[ext];
    }
    static getExtByMimeType(mimeType){
        const mimeTypes = App.invertObject(Library.mimeTypes);
        return mimeTypes[mimeType];
    }
}