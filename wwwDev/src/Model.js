class Model extends App {
    /*Eventos Iniciais */
    constructor() {
        super();
        /*Variáveis */
    }
    /*Funções Static Privadas */
    static _items(table = "", items = []) {
        const arrayResult = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.indexOf(".") > -1) {
                const arrayItem = item.split(".");
                if (arrayItem.length == 2) {
                    arrayResult.push({ table: arrayItem[0], item: arrayItem[1] });
                }
                else {
                    console.log("Invalid Syntax for Item: " + item);
                    arrayResult.push({ table: table, item: item });
                }
            }
            else {
                arrayResult.push({ table: table, item: item });
            }
        }
        return arrayResult;
    }
    static _join(table = "", join = []) {
        if (!App.empty(table) && !App.empty(join)) {
            let result = Model.select(table);

            for (let i = 0; i < join.length; i++) {
                let joinData = join[i];
                let tableName = joinData.table,
                    conditions = joinData.conditions;

                for (let key in conditions) {
                    let oKey = Model._items(table, [key])[0],
                        oVal = Model._items(table, [conditions[key]])[0];

                    let dataRef =  result, 
                        useKey = oKey,
                        useVal = oVal;

                    if (tableName == oKey.table) {
                        useKey = oVal;
                        useVal = oKey;
                    }
                    for (let j = 0; j < dataRef.length; j++) {
                        let dataLine = dataRef[j],
                            whereTab = {},
                            tabValObject = {};

                        if (useKey.table == table){
                            whereTab[useVal.table + "." + useVal.item] = dataLine[useKey.item];
                            let tabVal = Model.select(tableName, [], whereTab);
                            tabValObject[tableName] = tabVal;
                        }
                        else{
                            let relTab = dataLine[useKey.table];
                            if (!App.empty(relTab)){
                                tabValObject[tableName] = [];
                                for (let k = 0; k < relTab.length; k++){
                                    let relLine = relTab[k];
                                    whereTab[useVal.table + "." + useVal.item] = relLine[useKey.item];
                                    let tabVal = Model.select(useVal.table, [], whereTab);
                                    tabValObject[tableName] = App.arrayPush(tabValObject[tableName], tabVal);
                                }
                            }
                        }
                        if (!App.empty(tabValObject[tableName])){
                            result[j] = App.arrayPush(dataLine, tabValObject, "object");
                        }
                    }
                }
            }
            return result;
        }
        return Model.select(table);
    }
    static _where(table = "", tabRes, where, is_check = false) {
        let is_true = true;
        if (!Array.isArray(tabRes)) {
            tabRes = [tabRes];
        }
        if (Object.keys(where).length > 0) {
            let whereRes = [];
            for (let i = 0; i < tabRes.length; i++) {
                let tabLine = tabRes[i];
                if (!is_check) { is_true = true };
                for (let key in where) {
                    let oKey = Model._items(table, [key])[0];

                    if (oKey.table == table){
                        if (tabLine[oKey.item] != where[key]) {
                            is_true = false;
                        }
                    }
                    else if (!App.empty(where[key])){
                        let relTab = tabLine[oKey.table];

                        if (!App.empty(relTab)){
                            let whereRel = [];
                            for(let j = 0; j < relTab.length; j++){
                                let relTabLine = relTab[j];
                                if (relTabLine[oKey.item] == where[key]){
                                    whereRel.push(relTabLine);
                                }
                            }
                            if (!App.empty(whereRel)){
                                tabLine[oKey.table] = whereRel;
                            }
                            else{
                                is_true = false;
                            }
                        }
                        else{
                            is_true = false;
                        }
                    }
                }
                if (is_true) {
                    whereRes.push(tabLine);
                }
            }
            tabRes = whereRes;
        }
        return !is_check ? tabRes : is_true;
    }
    /*Funções Static Publicas */
    static delete(table, where = {}) {
        let tabData = App.get(table), tabRes = [];
        for (let i = 0; i < tabData.length; i++) {
            let del = true, lineData = tabData[i];
            if (!App.empty(where)) {
                del = Model._where(table, lineData, where, true);
            }
            if (!del) {
                tabRes.push(lineData);
            }
        }
        return App.set(table, tabRes);
    }
    static insert(table, values = []) {
        let tabData = App.get(table);
        if (!Array.isArray(values)) {
            values = [values];
        }
        for (let key in values) {
            tabData.push(values[key]);
        }
        return App.set(table, tabData);
    }
    static select(table = "", items = [], where = {}, join = []) {
        let tabData = App.get(table),
            tabRes = [],
            dataItems = Model._items(table, items);

        let dataTables = App.getArrayByObjectKey(dataItems, "table");

        if (!App.empty(join)) {
            tabData = Model._join(table, join);
        }
        if (!App.empty(where)) {
            tabData = Model._where(table, tabData, where);
        }
        if (dataItems.length > 0) {
            for (let i = 0; i < tabData.length; i++) {
                let line = tabData[i], lineRes = {};
                for (let key in line) {
                    if (typeof line[key] == "object" && !App.empty(line[key])) {
                        let relRes = [],
                            relTab = line[key];
                        for (let j = 0; j < dataTables.length; j++) {
                            if (dataTables[j] == key) {
                                for (let k = 0; k < relTab.length; k++) {
                                    let relLine = relTab[k];
                                    for (let relKey in relLine) {
                                        let rLine = {};
                                        if (dataItems[j].item == relKey) {
                                            rLine[relKey] = relLine[relKey];
                                        }
                                        if (!App.empty(rLine)) {
                                            relRes.push(rLine);
                                        }
                                    }
                                }
                            }
                        }
                        if (!App.empty(relRes)) {
                            lineRes[key] = relRes;
                        }
                    }
                    else {
                        let keyIndexes = App.getArrayIndexes(App.getArrayByObjectKey(dataItems, "item"), key);
                        for (let keyIndex in keyIndexes) {
                            if (dataTables[keyIndex] == table) {
                                lineRes[key] = line[key];
                            }
                        }
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
    static update(table, values = {}, where = {}) {
        let tabData = App.get(table);
        for (let i = 0; i < tabData.length; i++) {
            if (Model._where(table, tabData[i], where, true)) {
                for (let key in values) {
                    tabData[i][key] = values[key];
                }
            }
        }
        return App.set(table, tabData);
    }
}