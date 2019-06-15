class PullToDo extends Model {
    /*Eventos Iniciais */
    constructor(element) {
        super();
        if (typeof element == "string") {
            element = App.$(element);
        }

        /*Variáveis */
        this._element = element;
        this._onPulled = () => {};
        this._pullObject = null;
    }
    /*Funções Privadas */
    _init(onPulled = () => {}) {
        const self = this;
        App.set("last_pull_to_do", this, "global");
        return PullToRefresh.init({
            mainElement: '#' + self._element.id,
            onRefresh: onPulled.bind(self),
            distThreshold: 50,
            classPrefix: "-pull-to-do-",
            instructionsPullToRefresh: App.l("pull_to_refresh"),
            instructionsReleaseToRefresh: App.l("release_to_refresh"),
            instructionsRefreshing: App.l("refreshing")
        });
    }
    /*Funções Públicas*/
    add(onPulled){
        if (typeof onPulled != "function"){
            onPulled = this._onPulled;
        }
        this._onPulled = onPulled;
        if (App.empty(this._pullObject)){
            this._pullObject = this._init(onPulled);
        }
    }
    remove(is_fully = true){
        if (is_fully === true){
            App.set("last_pull_to_do", null, "global");
            PullToDo.removeAll();
        }
        if (!App.empty(this._pullObject)){
            this._pullObject.destroy();
        }
        this._pullObject = null;
    }
    /*Funções Static Públicas */
    static removeAll(){
        PullToRefresh.destroyAll();
    }
    /*Funções Static getter e setter */
    static get getStatus(){
        const element = App.$(".-pull-to-do-ptr.-pull-to-do-release, .-pull-to-do-ptr.-pull-to-do-refresh");
        return element !== false;
    }
}