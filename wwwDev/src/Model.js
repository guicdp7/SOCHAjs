class Model extends App{
    /*Eventos Iniciais */
    constructor(){
        super();
        /*Variáveis */
    }
    /*Funções Privadas */
    _where(tabRes, where, is_check = false){
        let is_true = true;
        if (!Array.isArray(tabRes)){
            tabRes = [tabRes];
        }
        if (Object.keys(where).length > 0){
            let whereRes = [];
            for(let i = 0; i < tabRes.length; i++){
                let tabLine = tabRes[i];
                if (!is_check) { is_true = true };
                for(let key in where){
                    if (tabLine[key] != where[key]){
                        is_true = false;
                    }
                }
                if (is_true){
                    whereRes.push(tabLine);
                }
            }
            tabRes = whereRes;
        }
        return !is_check ? tabRes : is_true;
    }
    /*Funções Publicas */
    delete(table, where = {}){
        let tabData = App.get(table);
        for(let i = 0; i < tabData.length; i++){
            if (this._where(tabData[i], where, true)){
                tabData.splice(i, 1);
            }
        }
        return App.set(table, tabData);
    }
    insert(table, values = []){
        let tabData = App.get(table);
        if (!Array.isArray(values)){
            values = [values];
        }
        for (let key in values){
            tabData.push(values[key]);
        }
        return App.set(table, tabData);
    }
    select(table, items = [], where = {}){
        let tabData = this._where(App.get(table), where), tabRes = [];
        if (items.length > 0){
            for(let i = 0; i < tabData.length; i++){
                let line = tabData[i], lineRes = {};
                for(let key in line){
                    if (items.indexOf(key) > -1){
                        lineRes[key] = line[key];
                    }
                }
                tabRes.push(lineRes);
            }
        }
        else {
            tabRes = tabData;
        }
        return tabRes;
    }
    update(table, values = {}, where = {}){
        let tabData = App.get(table);
        for(let i = 0; i < tabData.length; i++){
            if (this._where(tabData[i], where, true)){
                for(let key in values){
                    tabData[i][key] = values[key];
                }
            }
        }
        return App.set(table, tabData);
    }
}