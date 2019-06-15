class Language extends Model {
    /*Eventos Iniciais */
    constructor(language = "pt-br", pageId) {
        Language.setLanguage = language;
        Language.setPageId = pageId;
        super();
        /*Variáveis */
        this.language = language;
        this.pageId = App.firstLetter(pageId);
    }
    /*Funções Getter Setter Static */
    static get getLanguage(){
        return App.get("model_language_lang", "global");
    }
    static set setLanguage(value){
        App.set("model_language_lang", value, "global");
    }
    static get getPageId(){
        return App.get("model_language_pageId", "global");
    }
    static set setPageId(value){
        App.set("model_language_pageId", value, "global");
    }
    static get getPageKeys(){
        return App.get("model_language_pageKeys", "global");
    }
    static set setPageKeys(value){
        App.set("model_language_pageKeys", value, "global");
    }
    /*Funções Static Públicas */
    static getPageKey(key){
        const firstChar = key.charAt(0);
        if (firstChar == "_"){
            const secondChar = key.charAt(1);
            if (secondChar == "_"){
                return App.firstLetter(Language.getPageKeys[key.slice(2)]);
            }
            return App.firstLetter(Language.getPageKeys[key.slice(1)], "lower");
        }
        return Language.getPageKeys[key];
    }
    /*Funções Públicas */
    setLanguageKeys(pageText = "", ac, end = (pr) => { }) {
        this._getLanguageKeys(ac, (lk) => {
            let pageResult = pageText;
            for (let key in lk) {
                let rg = new RegExp("\\{\\{\\s*_" + key + "\\s*\\}\\}", "gi");
                pageResult = pageResult.replace(rg, App.firstLetter(lk[key], "lower"));
            }
            for (let key in lk) {
                let rg = new RegExp("\\{\\{\\s*__" + key + "\\s*\\}\\}", "gi");
                pageResult = pageResult.replace(rg, App.firstLetter(lk[key]));
            }
            end(pageResult);
        });
    }
    /*Funções Privadas */
    _getLanguageKeys(ac, end = (lk) => { }) {
        const self = this,
            langPath = "src/Language/";

        let count = 0,
            langKeys = {};

        const jsonFiles = ["_default", self.pageId];

        for (let key in ac) {
            jsonFiles.push(key);
        }

        const getJsonFile = (fileId) => {
            const filePath = langPath + fileId + ".json";
            if (count < jsonFiles.length) {
                App.isFile(filePath, (is_file) => {
                    if (is_file) {
                        App.ajax(App.getAppPath + filePath, (r) => {
                            if (!App.empty(r)) {
                                if (!r.error) {
                                    langKeys = App.arrayPush(langKeys, r[self.language], "object");
                                }
                                else {
                                    console.log("Error getting Language " + fileId + ".json file: " + r.error);
                                }
                                getJsonFile(jsonFiles[++count]);
                            }
                            else {
                                getJsonFile(jsonFiles[++count]);
                            }
                        }, "GET", "json");
                    }
                    else {
                        getJsonFile(jsonFiles[++count]);
                    }
                });
            }
            else {
                Language.setPageKeys = langKeys;
                end(langKeys);
            }
        };

        getJsonFile(jsonFiles[count]);
    }
}