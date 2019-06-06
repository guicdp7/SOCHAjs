class Api extends Model {
    /*Eventos Iniciais */
    constructor(url, postData = {}, method = "POST", is_cache = true) {
        super();
        /*Variáveis */
        this._url = url;
        this._postData = postData;
        this._method = method;
        this._is_cache = is_cache;
        this._req = null;
        this._getCache._noImagePath = "img/sem-img.jpg";
    }
    /*Funções Privadas */
    get _getCache() {
        return App.get(this.getCacheHash);
    }
    set _setCache(val) {
        App.set(this.getCacheHash, val);
    }

    /*Funções Getter Setter */
    get getCacheHash() {
        return App.MD5(this.getUrl + JSON.stringify(this._postData) + this._method);
    }
    get getUrl() {
        if (this._url.indexOf("http") > -1) {
            return this._url;
        }
        return App.data.apiLink + this._url;
    }
    set setUrl(url) {
        this._url = url;
    }
    set setNoImagePath(path) {
        this._noImagePath = path;
    }
    /*Funções */
    send(end = (r, s) => { }, responseType = "json") {
        const cache = this._getCache;
        if (App.empty(cache)) {
            if (App.is_connected) {
                this._req = App.ajax(this.getUrl, end, this._method, responseType, this._postData, {
                    "Content-Type": "application/x-www-form-urlencoded"
                });
            }
            else {
                end({ error: "no connection" });
            }
        }
        else {
            end(cache);
        }
    }
    download(end = () => { }) {
        const self = this,
            cacheFile = App.get(this.getUrl);

        const down = () => {
            if (App.is_connected && !App.isPlatform("browser")) {
                this._req = App.ajax(this.getUrl, (r) => {
                    let fileName =  Library.getExtByMimeType(r.type);
                    if (Array.isArray(fileName)){
                        fileName = fileName[0];
                    }
                    fileName = self.getCacheHash + "." + fileName;
                    App.getFile(fileName, (f) => {
                        const fullPath = f.nativeURL;
                        if (!App.empty(fullPath)) {
                            f.createWriter((fw) => {
                                let written = 0;
                                const BLOCK_SIZE = 1 * 1024 * 1024,
                                    fileSize = r.size;
                                fw.onwrite = (e) => {
                                    if (written < fileSize) {
                                        fw.doWrite();
                                    }
                                    else {
                                        App.set(this.getUrl, fullPath);
                                        end(fullPath);
                                    }
                                };
                                fw.doWrite = () => {
                                    const sz = Math.min(BLOCK_SIZE, fileSize - written);
                                    const sub = r.slice(written, written + sz);
                                    written += sz;
                                    fw.write(sub);
                                };
                                fw.doWrite();
                            });
                        }
                        else {
                            end(self._url);
                        }
                    });
                }, "POST", "blob", this._postData, [{
                    "Content-type": "application/x-www-form-urlencoded"
                }]);
            }
            else if (App.isPlatform("browser")){
                end(this.getUrl);
            }
            else {
                end({ error: "no connection" });
            }
        };

        if (!App.empty(cacheFile)) {
            App.isFile(cacheFile, (r) => {
                if (r) {
                    end(cacheFile);
                }
                else {
                    down();
                }
            });
        }
        else {
            down();
        }
    }
    getImgFrom(end = (r, s) => { }) {
        this.download((r) => {
            if (r.error) {
                end(this._noImagePath, 0);
            }
            else {
                end(r, 1);
            }
        });
    }
}