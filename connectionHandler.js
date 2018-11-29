
 /**
     * Create a new connection handler object
     * @param {String} socketURL - The event type of the message.
     * @param {MessageObserver} msgObs - The channel id.
     */

class ConnectionHandler{
    constructor(socketURL, msgObs){
        this.socketAdress = socketURL;
        this.socket;
        this.messageObserver = msgObs;
    }
    /**
     * Initialise la conection et attache les eventListener
     */
    init(){
        changeLoadingText("Connexion en cours...");
        this.getConnection();
        var connectionHand = this;

        this.socket.addEventListener("open",this.opened);
        this.socket.addEventListener("close",this.close);
        this.socket.addEventListener("message",this.messageReceived);
        
    }
    /**
     * assign la connection au socket objet 
     */
    getConnection(){
        this.socket = new WebSocket(this.socketAdress);
    }
    /**
     * envoie le message au serveur
     * @param {message} msg - le message preparer par l'application à envoyer
     */
    send(msg){
        this.socket.send(JSON.stringify(msg,
            function(i,j){if(j===undefined) {return null;}return j;}
            ));
    }
    /**
     * envoie au messageObserver le msg
     */
    messageReceived(event){
        var msg = JSON.parse(event.data);
        connectionHand.messageObserver.onReceived(msg);
    }
    /**
     * informer que la connection est fermer
     */
    closed(){
        changeLoadingText("Connexion perdue");
        alert("Connexion perdue! Veuillez rafraichir la page");
    }
    /**
     * changer le loadingText
     */
    opened(){
        changeLoadingText("Connexion établie");
    }
    /**
     * envoie au serveur pour sortir du channel avec un tel id
     * @param {string} id - le id du serveur qu'on veux sortir
     */
    requestOnGetChannel(id){
        let msg = new Message("onGetChannel",id,undefined,userName,new Date());
        this.send(msg);
    }

    /**
     * enlever les EventListener par rapport au connection au serveur 
     */
    removeAllEventListeners(){
        this.socket.removeEventListener("open",this.opened);
        this.socket.removeEventListener("close",this.close);
        this.socket.removeEventListener("message",this.messageReceived);
    }
    /**
     * changer le nom d'utilisateur (se reconnecter au serveur) et aller dans le General channel
     * @param {string} newUserName - le nouveau nom 
     */
    switchUsername(newUserName){
        this.socketAdress = baseURL + newUserName;
        this.removeAllEventListeners();
        this.init();
        goToGeneral();
    }
}