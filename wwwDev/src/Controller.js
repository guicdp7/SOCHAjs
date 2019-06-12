class Controller extends App {
    /*Eventos Iniciais */
    constructor(pageId, args, deleteLastPage = true, isFullPage = true, pageDependencies = []) {
        super();
        /*Variáveis */
        this.pageId = pageId;
        this.args = args;
        this.deleteLastPage = deleteLastPage;
        this.isFullPage = isFullPage;
        this.pageDependencies = pageDependencies;

        this.viewData = {};
    }
    /*Carregar nova página */
    loadPage(end = (ac, vd) => { }) {
        if (this.deleteLastPage) {
            this._deleteLastPage();
        }
        if (this.isFullPage) {
            this._includeNewPage(this.pageId, this.args, end);
        }
        else if (this.args._includeData) {
            this._executeIncludeAttributes(this.args, end);
        }
    }
    /*Funções Públicas */
    send(key, value) {
        this.viewData[key] = value;
    }

    /*Funções Privadas */
    _deleteLastPage() {
        app.divApp.style.visibility = "hidden";
        app.divApp.innerHTML = "";
    }
    _executeIncludeAttributes(args, end = (ac, vd) => { }) {
        const self = this;
        let parentElement = app.divApp;
        if (args._includeData) {
            parentElement = args._includeData.parent;
        }
        App.includeHTML((r2) => {
            for(let key in r2){
                if (r2[key]){
                    r2[key].parent.innerHTML = App.getValuesForPathKeys(r2[key].text);
                }
            }
            self._includePageControllers(r2, args, end);
        }, [], [], parentElement, false);
    }
    _getViewKeys(vd) {
        const returnValidKeys = (keys, prefix = "") => {
            const validTypes = [
                "string",
                "number",
                "bigint"
            ];
            let validKeys = [];
            for (let key in keys) {
                const _key = (!App.empty(prefix) ? prefix + "_" : "") + key;
                if (validTypes.indexOf(typeof keys[key]) > -1) {
                    validKeys[_key] = keys[key];
                }
                else if (typeof keys[key] == "boolean") {
                    if (keys[key]) {
                        validKeys[_key] = "yes";
                    }
                    else {
                        validKeys[_key] = "no";
                    }
                }
                else if (typeof keys[key] == "object") {
                    const returnKeys = returnValidKeys(keys[key], _key);
                    validKeys = App.arrayPush(validKeys, returnKeys, "object");
                }
            }
            return validKeys;
        };
        let viewKeys = {};
        for (let pageId in vd) {
            let pageKeys = vd[pageId];
            const validKeys = returnValidKeys(pageKeys);
            viewKeys = App.arrayPush(viewKeys, validKeys, "object");
        }
        return viewKeys;
    }
    _includeNewPage(pageId, args, end = (ac, vd) => { }) {
        const self = this;
        App.includeHTML((r) => {
            app.divApp.innerHTML = App.getValuesForPathKeys(r[pageId].text);
            self._executeIncludeAttributes(args, (ac, vd) => {
                vd[pageId] = self.viewData;
                const viewKeys = self._getViewKeys(vd);
                self._setValuesForViewKeys(viewKeys, ac, (pt) => {
                    self._includePageDependencies((dc) => {
                        app.divApp.innerHTML = pt;
                        app.divApp.style.visibility = "visible";
                        for (let className in ac) {
                            if (ac[className]) {
                                ac[className].onPageReady(ac, viewKeys, dc);
                            }
                        }
                        end(ac, viewKeys, dc);
                    });
                });
            });
        }, app.divApp, pageId, app.divApp, false);
    }
    _includePageControllers(pageIds, args, end = (ac) => { }) {
        let count = 0;
        const arrayIds = [],
            arrayClasses = {},
            arrayViewData = {},
            importPages = (pageId) => {
                if (count < arrayIds.length) {
                    App.import("Controller/" + pageId, (controllerClass) => {
                        const includeArgs = App.clone(args);
                        includeArgs._includeData = pageIds[pageId];
                        const pageClass = new controllerClass(pageId, includeArgs);
                        pageClass.loadPage((ac, vd) => {
                            for (let pid in ac) {
                                arrayClasses[pid] = ac[pid];
                                arrayViewData[pid] = vd[pid];
                            }
                            arrayClasses[pageId] = pageClass;
                            arrayViewData[pageId] = pageClass.viewData;
                            importPages(arrayIds[++count]);
                        });
                    });
                }
                else {
                    end(arrayClasses, arrayViewData);
                }
            };
        for (let pageId in pageIds) {
            if (!pageIds[pageId].error) {
                arrayIds.push(pageId);
            }
        }
        importPages(arrayIds[count]);
    }
    _includePageDependencies(end = (dc) => { }) {
        let count = 0;
        const arrayDepClasses = [];
        const addDepedencie = (dep) => {
            if (count < this.pageDependencies.length) {
                App.import(dep, (classObject) => {
                    if (!classObject.error) {
                        arrayDepClasses.push(classObject);
                    }
                    else {
                        console.log(classObject.error);
                    }
                    addDepedencie(this.pageDependencies[++count]);
                });
            }
            else {
                end(arrayDepClasses);
            }
        };
        addDepedencie(this.pageDependencies[count]);
    }
    _setValuesForViewKeys(viewKeys, ac, end = (pt) => { }) {
        let pageText = app.divApp.innerHTML;
        for (let key in viewKeys) {
            let rg = new RegExp("\\{\\{\\s*" + key + "\\s*\\}\\}", "gi");
            pageText = pageText.replace(rg, viewKeys[key]);
        }
        const lang = new Language(App.getAppLanguage, this.pageId);
        pageText = lang.setLanguageKeys(pageText, ac, (pr) => {
            pageText = pr;
            pageText = pageText.replace(/\{\{\s*[a-zA-Z0-9\_]*\s*\}\}/gi, "");
            end(pageText);
        });
    }
}