class Home extends Controller {
    /*Eventos Iniciais */
    constructor(pageId, args) {
        /*Definições da página */
        const deleteLastPage = true,
            isFullPage = true,
            pageDependencies = [
                /*Dependencias da Página */
            ];

        super(pageId, args, deleteLastPage, isFullPage, pageDependencies);

        Loader.show();
        
        /*Variáveis */
        this.btPt = null;
        this.btEn = null;
    }
    /*A Página Carregou */
    onPageReady(includeClasses, viewData, depedenciesClasses){
        /*Elementos */
        this.btPt = App.$("btPt");
        this.btEn = App.$("btEn");

        /*Adicionar Eventos */
        this.btPt.addEventListener("click", this.onBtPtClick);
        this.btEn.addEventListener("click", this.onBtEnClick);
        
        Loader.hide();
    }
    /*Eventos */
    onBtPtClick(){
        App.setAppLanguage = "pt-br";
        location.href = location.href;
    }
    onBtEnClick(){
        App.setAppLanguage = "en-us";
        location.href = location.href;
    }
}