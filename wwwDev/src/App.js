"use strict";
let _global = {};
class App {
    /*Eventos Iniciais */
    constructor() {
        /*Variáveis */
        this.divApp = null;

        /*Status do App */
        this._updateStatus = App.get("updateStatus");
        if (App.empty(App.getAppStatus)) {
            App.setAppStatus = {
                docLoad: false,
                docLoaded: false,
                deviceReady: false,
                appReady: false
            };
        }

        /*Atribuindo Eventos Iniciais */
        if (!App.getAppStatus.docLoad) {
            document.addEventListener("DOMContentLoaded", this.onDocLoad.bind(this));
        }
        if (!App.getAppStatus.deviceReady) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this));
        }
    }
    /*O Documento Carregou */
    onDocLoad() {
        if (!App.getAppStatus.docLoad) {
            this._changeAppStatus("docLoad");
            this._readDefaultScripts(() => {
                this._readDefaultClasses(() => {
                    this._changeAppStatus("docLoaded");
                });
            });
        }
        else {
            console.log("Document has already loaded");
        }
    }
    /*O Dispositivo está Pronto */
    onDeviceReady() {
        if (!App.getAppStatus.deviceReady) {
            this._changeAppStatus("deviceReady");
            /*Botões Físicos */
            document.addEventListener("backbutton", this.onBackButtonClick);
            if (App.isPlatform("android")) {
                navigator.app.overrideButton("menubutton", true);
                document.addEventListener("menubutton", this.onMenuButtonClick, false);
            }
        }
        else {
            console.log("Device has already ready");
        }
    }
    /*O App já carregou */
    onAppReady() {
        if (!App.getAppStatus.appReady) {
            this._changeAppStatus("appReady");
            this.divApp = App.$("#divApp");
            this.checkUpdates(() => {
                App.openPage("Specification");
            });
        }
        else {
            console.log("App has already ready");
        }
    }
    /*Funções Públicas */
    checkUpdates(end = () => { }) {
        const status = this._updateStatus;
        if (App.empty(status) || App.is_connected) {
            if (App.is_connected) {
                this._getAppData(end);
            }
            else {
                const msg = new Message("Para que possamos continuar, você precisa estar conectado á internet.", "Você não está conectado!");
                msg.show((r) => {
                    App.close();
                });
            }
        }
        else {
            end();
        }
    }
    /*Eventos Globais */
    onBackButtonClick() {

    }
    onMenuButtonClick() {

    }
    /*Funções Privadas */
    _getAppData(end = () => { }) {
        const apiUpdate = new Api("update", { retorno: "json" });
        apiUpdate.send((r) => {
            if (!App.empty(r.tables)) {
                const db = new Database();
                db.updateTables(r.tables, end);
            }
        });
    }
    _changeAppStatus(type) {
        let appStatus = App.getAppStatus;
        appStatus[type] = true;
        App.setAppStatus = appStatus;
        console.log(type);
        if (appStatus.docLoad && appStatus.deviceReady && appStatus.docLoaded) {
            if (!appStatus.appReady) {
                this.onAppReady();
            }
        }
    }
    _readDefaultClasses(end = () => { }) {
        const classes = App.default.classes;
        let i = 0;
        const add = () => {
            if (i < classes.length) {
                App.import(classes[i], () => {
                    i++;
                    add();
                });
            }
            else {
                end();
            }
        };
        add();
    }
    _readDefaultScripts(end = () => { }) {
        const scripts = App.default.scripts;
        let i = 0;
        const add = () => {
            if (i < scripts.length) {
                App.addScript(scripts[i], () => {
                    i++;
                    add();
                });
            }
            else {
                end();
            }
        };
        add();
    }
    /*Variáveis Getter e Setter Static */
    static get getAppLanguage(){
        const appLang = App.get("appLang");
        return !App.empty(appLang) ? appLang : "pt-br";
    }
    static get getAppStatus() {
        return App.get("appStatus", "global");
    }
    static set setAppLanguage(value){
        App.set("appLang", value);
    }
    static set setAppStatus(value) {
        App.set("appStatus", value, "global");
    }
    static get data() {
        return {
            name: "SOCHAjs",
            defaultColor: "#ffffff",
            apiLink: "http://your.api.here"
        };
    }
    static get default() {
        return {
            scripts: [
                /*Scripts Padrão*/
            ],
            classes: [
                /*Classes Padrão*/
                "Model",
                "View",
                "Controller",
                "Model/Language",
                "Model/Database",
                "Model/Library",
                "Model/Loader",
                "Model/Api",
                "Model/Message"
            ]
        };
    }
    static get is_connected() {
        const networkState = navigator.connection.type;
        return networkState == "none" ? false : networkState;
    }
    static get is_mobile() {
        const a = navigator.userAgent.toLowerCase();
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        }
        return false;
    }
    static get getAppPath() {
        return location.href.replace("index.html", "");
    }
    static get getPageHistory() {
        return App.get("pageHistory", "global");
    }
    static get getThisPage() {
        const pageHistory = App.getPageHistory;
        const length = pageHistory.length;
        if (length > 0) {
            return pageHistory[length - 1];
        }
        return false;
    }
    static set setPageHistory(value) {
        App.set("pageHistory", value, "global");
    }

    /*Funções Static */
    static $(selector, parent = document) {
        let res = parent.querySelectorAll(selector);
        if (!res.length && ["#", ".", "*"].indexOf(selector.charAt(0)) == -1) {
            res = parent.querySelectorAll("#" + selector);
        }
        return res.length > 0 ? (res.length == 1 ? res[0] : res) : false;
    }
    static addScript(path, end = () => { }, once = false) {
        const scripts = App.get("addedScripts", "session"),
            add = () => {
                App.isFile(path, (r) => {
                    if (r) {
                        $.getScript(path, () => {
                            scripts.push(path);
                            App.set("addedScripts", scripts, "session");
                            end(true);
                        })
                    }
                    else {
                        end(false);
                    }
                });
            };
        if (!once || scripts.indexOf(path) == -1) {
            add();
        }
        else {
            end(false);
        }
    }
    static addElement(parentElement, childElement, where = "inside") {
        if (where == "inside") {
            return parentElement.appendChild(childElement);
        }
        else if (where == "before") {
            return parentElement.parentElement.insertBefore(childElement, parentElement);
        }
        else if (where == "after") {
            return parentElement.parentElement.insertBefore(childElement, parentElement.nextSibling);
        }
        return false;
    }
    static ajax(url, end = (r, s) => { }, method = "GET", responseType = "json", data = {}, headers = []) {
        const HttpReq = XMLHttpRequest ? XMLHttpRequest : ActiveXObject("Microsoft.XMLHTTP");
        if (url.indexOf("://") == -1) {
            url = App.getAppPath + url;
        }
        const req = new HttpReq();
        req.open(method, url, true);
        for (let key in headers) {
            req.setRequestHeader(key, headers[key]);
        }
        req.responseType = responseType;
        req.onload = () => end(req.response, req.status);
        req.onerror = (e) => end({ error: req.response }, req.status);
        req.send(App.getHttpQueryByObject(data));
        return req;
    }
    static arrayPush(array1 = [], array2 = [], type = "array") {
        let array = [];
        if (type == "object") {
            array = {};
        }
        for (let key in array1) {
            if (type == "object") {
                array[key] = array1[key];
            }
            else {
                array.push(array1[key]);
            }
        }
        for (let key in array2) {
            if (type == "object") {
                array[key] = array2[key];
            }
            else {
                array.push(array2[key]);
            }
        }
        return array;
    }
    static class(action = "add", elements = [], classes = []) {
        if (!App.empty(elements)) {
            if (!Array.isArray(elements)) {
                if (!elements[0] && elements !== false) {
                    elements = [elements];
                }
            }
            if (!Array.isArray(classes)) {
                classes = [classes];
            }
            for (let i = 0; i < elements.length; i++) {
                let elmt = elements[i];
                if (typeof elmt == "string"){
                    elmt = App.$(elmt);
                }
                for (let j = 0; j < classes.length; j++) {
                    elmt.classList[action](classes[j]);
                }
            }
        }
        return classes;
    }
    static createElement(tagName, attributes = {}) {
        const element = document.createElement(tagName);
        for (let key in attributes) {
            if (key == "innerHTML") {
                element.innerHTML = attributes[key];
            }
            else {
                element.setAttribute(key, attributes[key]);
            }
        }
        return element;
    }
    static clone(object) {
        return $.extend(true, {}, object);
    }
    static close() {
        if (App.isPlatform("windows")) {
            window.close();
        }
        else if (App.isPlatform("android")) {
            navigator.app.exitApp();
        }
        else {
            console.log("Can't Close this App");
        }
    }
    static empty(value) {
        const notEmpty = [
            "number", "bigint", "function", "boolean", "symbol"
        ];
        if (value !== undefined && value !== null) {
            if (notEmpty.indexOf(typeof value) > -1) {
                return false;
            }
            else if (value.length > 0) {
                return false;
            }
            else if (App.isNode(value)) {
                return false;
            }
            else if (typeof value == "object") {
                if (Object.keys(value).length > 0) {
                    return false;
                }
            }
        }
        return true;
    }
    static firstLetter(text = "", action = "upper"){
        let result = text;
        if (action == "upper"){
            result = text.charAt(0).toUpperCase() + text.slice(1);
        }
        else if (action == "lower"){
            result = text.charAt(0).toLowerCase() + text.slice(1);
        }
        return result;
    }
    static get(key, storageType = "local") {
        let res = [];
        if (storageType == "global") {
            res = _global[key];
        }
        else {
            res = window[storageType + "Storage"].getItem(key);
        }
        return App.empty(res) ? [] : JSON.parse(res);
    }
    static getFile(name, end = (r) => { }, is_temp = false, is_exclusive = false) {
        const types = [window.TEMPORARY, window.PERSISTENT],
            fileError = (cod) => { end({ error: cod }); };
        let type = is_temp ? 0 : 1;
        window.requestFileSystem(types[type], 5 * 1024 * 1024, (fs) => {
            fs.root.getFile(name, { create: true, exclusive: is_exclusive }, end, fileError);
        }, fileError);
    }
    static getHttpQueryByObject(obj = {}) {
        let str = [];
        for (let key in obj) {
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
        }
        return str.join("&");
    }
    static getUrlParameter(name, link = location.href) {
        let tmp = [], value = false;
        link.substr(link.indexOf("?") + 1).split("&").forEach((i) => {
            tmp = i.split("=");
            if (decodeURIComponent(tmp[0]) === name) { value = decodeURIComponent(tmp[1]); }
        });
        return value;
    }
    static goBackPage(end = (pc) => { }) {
        const pageHistory = App.getPageHistory;
        const length = pageHistory.length;
        if (length > 1) {
            const lastPage = pageHistory[length - 2];
            pageHistory.splice(length - 2, 2);
            App.setPageHistory = pageHistory;
            App.openPage(lastPage.id, lastPage.args, end);
            return true;
        }
        else {
            end(false);
        }
        return false;
    }
    static includeHTML(end = () => { }, elements = [], paths = [], parentElement = app.divApp) {
        if (App.empty(elements)) {
            elements = App.$("*", parentElement);
        }
        if (!Array.isArray(elements)) {
            if (!elements[0] && elements !== false) {
                elements = [elements];
            }
        }
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        let count = 0;
        const arrayFiles = [],
            length = elements.length,
            searchIncludeHTML = (element) => {
                if (count < length) {
                    const includeHtmlAttribute = element.getAttribute("include-html");
                    let fileId = (paths[count] ? paths[count] : includeHtmlAttribute);
                    if (fileId) {
                        fileId = App.firstLetter(fileId);
                        const file = "src/View/" + fileId + ".html";
                        App.isFile(file, (r) => {
                            if (r) {
                                if (!arrayFiles[fileId] || arrayFiles[fileId].parent != element) {
                                    arrayFiles[fileId] = {
                                        file: file,
                                        parent: element
                                    };
                                    App.ajax(file, (r2, s) => {
                                        if (s == 200) {
                                            element.innerHTML += r2;
                                            searchIncludeHTML(elements[++count]);
                                        }
                                        else {
                                            arrayFiles[fileId] = {
                                                error: "File Read Error: " + s
                                            };
                                        }
                                    }, "GET", "text");
                                }
                            }
                            else {
                                arrayFiles[fileId] = {
                                    error: "File Not Found"
                                };
                            }
                            if (!App.empty(includeHtmlAttribute)) {
                                element.removeAttribute("include-html");
                            }
                        });
                    }
                    else {
                        searchIncludeHTML(elements[++count]);
                    }
                }
                else {
                    end(arrayFiles);
                }
            };
        searchIncludeHTML(elements[count]);
    }
    static import(className, end = (co) => { }) {
        const classes = className.split("/");
        const jsId = "js_" + classes.join("_").toLowerCase();
        const lastClass = classes[classes.length - 1];
        let scriptsTag = App.$("#" + jsId);
        if (!scriptsTag) {
            scriptsTag = App.addElement(document.body, App.createElement("script", { id: jsId }));
        }
        try {
            const classObject = eval(lastClass);
            end(classObject);
        }
        catch (e) {
            App.ajax("src/" + className + ".js", (r, s) => {
                scriptsTag.innerHTML += r;
                if (s == 200) {
                    end(eval(lastClass));
                }
                else {
                    end({ error: s });
                }
            }, "GET", "text");
        }
    }
    static invertObject(object = {}) {
        const newObject = {};
        Object.keys(object).forEach((k) => {
            if (App.empty(newObject[object[k]])) {
                newObject[object[k]] = k;
            }
            else {
                if (!Array.isArray(newObject[object[k]])) {
                    newObject[object[k]] = [newObject[object[k]]];
                }
                newObject[object[k]].push(k);
            }
        });
        return newObject;
    }
    static isFile(path, end = (s) => { }) {
        if (path.indexOf("://") == -1) {
            path = App.getAppPath + path;
        }
        window.resolveLocalFileSystemURL(path, () => {
            end(true);
        }, (e) => {
            App.ajax(path, (r, s) => {
                if (s == 200) {
                    end(true);
                }
                else {
                    end(false);
                }
            }, "GET", "text");
        });
    }
    static isNode(obj) {
        try {
            return obj instanceof HTMLElement;
        }
        catch (e) {
            return (typeof obj === "object") &&
                (obj.nodeType === 1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument === "object");
        }
    }
    static isPlatform(name) {
        if (device.platform.toLowerCase() == name.toLowerCase()) {
            return true;
        }
        return false;
    }
    static MD5(d) {
        function M(d) {
            for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
            return f
        }
        function X(d) {
            for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
            for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
            return _
        }
        function V(d) {
            for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
            return _
        }
        function Y(d, _) {
            d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
            for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
                var h = m,
                    t = f,
                    g = r,
                    e = i;
                f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
            }
            return Array(m, f, r, i)
        }
        function md5_cmn(d, _, m, f, r, i) {
            return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m)
        }
        function md5_ff(d, _, m, f, r, i, n) {
            return md5_cmn(_ & m | ~_ & f, d, _, r, i, n)
        }
        function md5_gg(d, _, m, f, r, i, n) {
            return md5_cmn(_ & f | m & ~f, d, _, r, i, n)
        }
        function md5_hh(d, _, m, f, r, i, n) {
            return md5_cmn(_ ^ m ^ f, d, _, r, i, n)
        }
        function md5_ii(d, _, m, f, r, i, n) {
            return md5_cmn(m ^ (_ | ~f), d, _, r, i, n)
        }
        function safe_add(d, _) {
            var m = (65535 & d) + (65535 & _);
            return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m
        }
        function bit_rol(d, _) {
            return d << _ | d >>> 32 - _
        }
        var result = M(V(Y(X(d), 8 * d.length)));
        return result.toLowerCase()
    }
    static openPage(page, args = [], end = (pc) => { }) {
        const self = this,
            pageId = page.charAt(0).toUpperCase() + page.slice(1);
        if (App.getThisPage.id != pageId) {
            const pageFiles = {
                controller: "src/Controller/" + pageId + ".js",
                view: "src/View/" + pageId + ".html"
            };
            App.isFile(pageFiles.controller, (r) => {
                if (r) {
                    App.isFile(pageFiles.view, (r2) => {
                        if (r2) {
                            App.import("Controller/" + pageId, (controllerClass) => {
                                let pageHistory = App.getPageHistory;
                                pageHistory.push({
                                    id: pageId,
                                    args: args
                                });
                                App.setPageHistory = pageHistory;
                                const pageClass = new controllerClass(pageId, args);
                                pageClass.loadPage((ac, vd, dc) => {
                                    pageClass.onPageReady(ac, vd, dc);
                                    end(pageClass, ac, dc);
                                });
                            });
                        }
                        else {
                            console.log("View " + pageId + " Not Found!");
                        }
                    })
                }
                else {
                    console.log("Controller " + pageId + " Not Found!");
                }
            });
        }
        else {
            end();
            console.log("This Page Is Already Open");
        }
    }
    static set(key, value = [], storageType = "local") {
        if (storageType == "global") {
            _global[key] = JSON.stringify(value);
        }
        else {
            window[storageType + "Storage"].setItem(key, JSON.stringify(value));
        }
        return value;
    }
}