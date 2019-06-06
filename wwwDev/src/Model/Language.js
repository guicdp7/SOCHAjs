class Language extends Model {
    /*Eventos Iniciais */
    constructor(language = "pt-br", pageId) {
        super();
        /*Variáveis */
        this.language = language;
        this.pageId = App.firstLetter(pageId);
    }
    /*Funções Públicas */
    getLanguageKeys(end = (lk) => { }) {
        const self = this,
            langPath = "src/Language/";
        App.ajax(langPath + "_default.json", (r) => {
            if (!App.empty(r)) {
                if (!r.error) {
                    let langKeys = r[self.language];
                    App.ajax(langPath + self.pageId + ".json", (r2) => {
                        if (!App.empty(r2)) {
                            if (!r2.error) {
                                langKeys = App.arrayPush(langKeys, r2[self.language], "object");
                                end(langKeys);
                            }
                            else {
                                console.log("Error getting Language " + self.pageId + ".json file: " + r2.error);
                                end(langKeys);
                            }
                        }
                        else{
                            end(langKeys);
                        }
                    }, "GET", "json");
                }
                else {
                    console.log("Error getting Language _default.json file: " + r.error);
                    end({});
                }
            }
            else {
                console.log("Language _default.json file not found");
                end({});
            }
        }, "GET", "json");
    }
    setLanguageKeys(pageText = "", end = (pr) => {}){
        this.getLanguageKeys((lk) => {
            let pageResult = pageText;
            for(let key in lk){
                let rg = new RegExp("\\{\\{\\s*_"+key+"\\s*\\}\\}", "gi");
                pageResult = pageResult.replace(rg, App.firstLetter(lk[key], "lower"));
            }
            for(let key in lk){
                let rg = new RegExp("\\{\\{\\s*__"+key+"\\s*\\}\\}", "gi");
                pageResult = pageResult.replace(rg, App.firstLetter(lk[key]));
            }
            end(pageResult);
        });
    }
}