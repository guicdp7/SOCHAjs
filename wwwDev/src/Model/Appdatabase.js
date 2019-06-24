class Appdatabase extends Model{
    /*Eventos Iniciais */
    constructor() {
        super();
        /*Variáveis */
    }
    /*Funções Static Publicas */
    static select(table, items = [], where = {}, end = (r) => {}, join = [], forceOnline = false){
        const totalBase = Model.select(table);
        let localData = Model.select(table, items, where, join);
        if (App.empty(totalBase) || forceOnline){
            const apiTable = new Api("update/tables?table=" + table, { retorno: "json" });
            apiTable.send((r) => {
                if (!App.empty(r)){
                    if (!r.error){
                        Model.delete(table);
                        Model.insert(table, r);
                        localData = Model.select(table, items, where, join);
                    }
                    else{
                        console.log(r.error);
                    }
                }
                end(localData);
            });
        }
        else{
            end(localData);
        }
    }
    static updateTables(tables = [], end = () => {}){
        if (!App.empty(tables)) {
            let count = 0;
            const getTab = (tab) => {
                if (count < tables.length) {
                    const apiTable = new Api("update/tables?table=" + tab, { retorno: "json" });
                    apiTable.send((r) => {
                        if (!App.empty(r)){
                            if (!r.error){
                                Model.delete(tab);
                                Model.insert(tab, r);
                                getTab(tables[++count]);
                            }
                            else{
                                console.log(r.error);
                                getTab(tables[++count]);
                            }
                        }
                        else{
                            getTab(tables[++count]);
                        }
                    });
                }
                else {
                    end();
                }
            };
            getTab(tables[count]);
        }
        else {
            end();
        }
    }
}