class Database extends Model{
    /*Eventos Iniciais */
    constructor() {
        super();
        /*Variáveis */
    }
    /*Funções Publicas */
    select(table, items = [], where = {}, end = (r) => {}, forceOnline = false){
        const self = this, totalBase = super.select(table);
        let localData = super.select(table, items, where);
        if (App.empty(totalBase) || forceOnline){
            const apiTable = new Api("update/tables?table=" + table, { retorno: "json" });
            apiTable.send((r) => {
                if (!App.empty(r)){
                    if (!r.error){
                        self.delete(tab);
                        self.insert(tab, r);
                        localData = super.select(table, items, where);
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
    updateTables(tables = [], end = () => {}){
        const self = this;
        if (!App.empty(tables)) {
            let count = 0;
            const getTab = (tab) => {
                if (count < tables.length) {
                    const apiTable = new Api("update/tables?table=" + tab, { retorno: "json" });
                    apiTable.send((r) => {
                        if (!App.empty(r)){
                            if (!r.error){
                                self.delete(tab);
                                self.insert(tab, r);
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