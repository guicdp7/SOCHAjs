class Message extends Model{
    /*Eventos Iniciais */
    constructor(text = "Message", title = "Title", type = "alert", buttons = ["ok"]){
        super();
        /*Variáveis */
        this._text = text;
        this._title = title;
        /*Types: alert | prompt | confirm */
        this._type = type;
        this._buttons = buttons;

    }
    /*Funções Públicas */
    show(end = (selectedIndex) => {}){
        navigator.notification[this._type](this._text, end, this._title, this._buttons);
    }
    /*Funções getter e setter Públicas */
    set setType(value = "alert"){
        this._type = value;
    }
    set setText(value = "Message"){
        this._text = value;
    }
    set setTitle(value = "Title"){
        this._title = value;
    }
    set setButtons(value = []){
        this._buttons = value;
    }

}