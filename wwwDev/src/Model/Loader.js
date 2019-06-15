class Loader extends Model{
    /*Eventos Iniciais */
    constructor() {
        super();
        /*Variáveis */
    }
    /*Variáveis Getter e Setter Static Privadas */
    static get _imgLoader(){
        /*Criar Img Loader */
        let imgLoader = App.createElement("img", { id: "imgLoader" });
        return imgLoader;
    }
    static get _divLoader(){
        let divLoader = App.$("#divLoader"),
            imgLoader = App.$("#imgLoader");
        /*Criar Div Loader */
        if (!divLoader){
            divLoader = App.createElement("div", { id: "divLoader" });
            document.body.appendChild(divLoader);
        }
        if (!imgLoader){
            imgLoader = Loader._imgLoader;
            divLoader.appendChild(imgLoader);
        }
        imgLoader.src = Loader.getLoaderImage;
        return divLoader;
    }

    /*Variáveis Getter e Setter Static */
    static get getFullLoaderStatus(){
        return !App.class("has", Loader._divLoader, Loader.getLoadedClass);
    }
    static get getLoaderImage(){
        const loaderImg = App.get("model_loader_image", "global");
        return !App.empty(loaderImg) ? loaderImg : App.f("/img/loader.gif");
    }
    static set setLoaderImage(value){
        App.set("model_loader_image", value, "global");
    }
    static get getLoaders(){
        return App.get("model_loader_loaders", "global");
    }
    static set setLoaders(value){
        App.set("model_loader_loaders", value, "global");
    }
    static get getLoadingClass(){
        const loadingclass = App.get("model_loading_class", "global");
        return !App.empty(loadingclass) ? loadingclass : "is-loading";
    }
    static set setLoadingClass(value){
        App.set("model_loading_class", value, "global");
    }
    static get getLoadedClass(){
        const loadedClass = App.get("model_loaded_class", "global");
        return !App.empty(loadedClass) ? loadedClass : "is-loaded";
    }
    static set setLoadedClass(value){
        App.set("model_loaded_class", value, "global");
    }

    /*Funções Static */
    static add(object){
        if (typeof object == "string"){
            object = App.$(object);
        }
        let loaders = Loader.getLoaders;
        loaders = Array.isArray(loaders) ? {} : loaders;
        if (!loaders[object.id]){
            loaders[object.id] = object.innerHTML;
            App.class("add", object, Loader.getLoadingClass);
            object.innerHTML = "<img src='" + Loader.getLoaderImage + "'/>";
            object.disabled = true;
            Loader.setLoaders = loaders;
            return true;
        }
        return false;
    }
    static hide(){
        const lastPull = App.get("last_pull_to_do", "global");
        if (!App.empty(lastPull)){
            lastPull.add();
        }
        App.class("add", Loader._divLoader, Loader.getLoadedClass);
    }
    static remove(object){
        let loaders = Loader.getLoaders;
        loaders = Array.isArray(loaders) ? {} : loaders;
        if (loaders[object.id] || loaders[object.id] === ""){
            object.innerHTML = loaders[object.id];
            App.class("remove", object, Loader.getLoadingClass);
            object.disabled = false;
            delete loaders[object.id];
            Loader.setLoaders = loaders;
            return true;
        }
        return false;
    }
    static show(){
        const lastPull = App.get("last_pull_to_do", "global");
        if (!App.empty(lastPull)){
            lastPull.remove(false);
        }
        App.class("remove", Loader._divLoader, Loader.getLoadedClass);
    }
}