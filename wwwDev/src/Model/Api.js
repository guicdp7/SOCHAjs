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
        this._noImagePath = App.f("/img/sem-img.jpg");
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
        if (this._url.indexOf("://") > -1) {
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
            if (App.is_connected && !App.isPlatform("browser") && XMLHttpRequest) {
                const reqLoad = () => {
                    if (self._req.status === 200){
                        const fileBlob = new Blob([self._req.response]);
                        let fileName =  Library.getExtByMimeType(fileBlob.type);
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
                                        fileSize = fileBlob.size;
                                    fw.onwrite = (e) => {
                                        if (written < fileSize) {
                                            fw.doWrite();
                                        }
                                        else {
                                            App.set(self.getUrl, fullPath);
                                            end(fullPath);
                                        }
                                    };
                                    fw.doWrite = () => {
                                        const sz = Math.min(BLOCK_SIZE, fileSize - written);
                                        const sub = fileBlob.slice(written, written + sz);
                                        written += sz;
                                        fw.write(sub);
                                    };
                                    fw.doWrite();
                                });
                            }
                            else {
                                end(this.getUrl);
                                console.log("fullPath is clear");
                            }
                        });
                        end();
                    }
                    else{
                        end({ error: self._req.status });
                    }
                };
                self._req = new XMLHttpRequest();
                self._req.open(self._method, self.getUrl, true);
                self._req.responseType = "arraybuffer";
                self._req.addEventListener("load", reqLoad);
                self._req.send(App.getHttpQueryByObject(self._postData));
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
            if (App.empty(r)){
                end(this._noImagePath, 0);
            }
            else{
                if (App.empty(r.error)) {
                    end(r, 1);
                }
                else {
                    end(this._noImagePath, 0);
                    console.log(r.error);
                }
                lazyLoad.init();
            }
        });
    }
}