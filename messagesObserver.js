/**
 * fonction appeler pour faire les affichages de date toujours en deux chiffres
 * soit 06:03 au lieu de 6:3
 */
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

class MessageObserver{
	/**
	* Constructeur de Message Observer
	* @Constructor
	*/
    constructor(){
    }

	/**
	 * Appelé lorsqu'on recoit des msg, a le responsabilité de déterminer son type et faire alors les appels 
	 * approprié
	 * @param {message} msg - le message recu du serveur qu'on doit traité
	 */	
    onReceived(msg){
        switch(msg.eventType) {
            case "onMessage":
                if(msg.channelId == presentChannel.id){
                    this.displayNewMessage(msg);
                }
                else if(msg.sender != "Admin"){
                    notifications++;
                    updateNotifications();
                }
                break;

            case "updateChannelsList":
                chnlObs = new ChannelObserver(msg);
            break;

            case "onGetChannel":
                presentChannel.messages = msg.data.messages;
                updateChannelsView();
                updatePresentChannelView();
            break;

            case "onError":
                alert(msg.data);
            break;
            default:
            
             break;
        }
    }
	
	/**
	 *  affiche le nouveau message dans l'interface avec le format approprié
	 * soit, l'autheur, le message et le temps de l'envoie
	 * @param {message} msg - message qu'on doit afficher
	 */
    displayNewMessage(msg){
        
        if (msg.sender == "Admin") {
            var adminMsg = document.createElement("div");
            adminMsg.className ="admin-msg";
            var textNodeAdminMsg = document.createTextNode(msg.data);
            adminMsg.appendChild(textNodeAdminMsg);
            document.getElementById("msg-box-container").appendChild(adminMsg);
			if (muteSound == false) {
				responsiveVoice.speak(msg.data,"French Male");
			}
        }
        else {

            var d = new Date();
            var weekday;
			if (currentLanguage == "fr") {
                weekday = ["Dimanche", "Lundi", "Mardi", "Mercredi","Jeudi", "Vendredi","Samedi"];
			}
			else {
                weekday = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday","Saturday"];
			}

            var weekDay = weekday[d.getDay()];
            var monthDay = d.getDate();
            var h = addZero(d.getHours());
            var m = addZero(d.getMinutes());

            var stagingTime = weekDay + " " + monthDay + " " + h + ":" + m;

            document.getElementById("msg-box-container").appendChild(this.generateMessageView(stagingTime,msg));
            var boxContainerClearer = document.createElement("div"); //using inline-block display, this is needed
            document.getElementById("msg-box-container").appendChild(boxContainerClearer);
            document.getElementById("msg-box-container").scrollTop=100000;
            
			if (muteSound == false) {
				responsiveVoice.cancel();
				responsiveVoice.speak(msg.sender + " dit, " + msg.data, "French Female");
			}
        }
    }

    /**
	 *  Génère la vue d'un message onMessage
     * @param {String} stagingTime - Date et heure du message à afficher
	 * @param {Message} msg - message qu'on doit afficher
	 */

    generateMessageView(stagingTime, msg){
        var boxContainerMaster = document.createElement("div");
        var boxContainerAuthor = document.createElement("div");
        var boxContainerTimestamp = document.createElement("div");
        var boxContainer = document.createElement("span");
        var boxContainerPlaceholder = document.createElement("div");
        var boxContainerMasterFlexs = document.createElement("div");

        boxContainer.className = "msg-box";
        boxContainerMaster.className = "msg-box-master";
        boxContainerAuthor.className = "msg-box-author";
        boxContainerTimestamp.className = "msg-box-timestamp";
        boxContainerPlaceholder.className = "msg-box-spaceholder";
        boxContainerMasterFlexs.className = "msg-box-master-flex";

        var textNodeAuthor = document.createTextNode(msg.sender);
        var textNodeContainer = document.createTextNode(msg.data);
        var textNodeTimestamp = document.createTextNode(stagingTime);

        boxContainerAuthor.appendChild(textNodeAuthor);
        boxContainer.appendChild(textNodeContainer);
        boxContainerTimestamp.appendChild(textNodeTimestamp);

        if (msg.sender != userName) {
            boxContainerMaster.appendChild(boxContainerAuthor);
        }
        boxContainerMaster.appendChild(boxContainer);
        boxContainerMaster.appendChild(boxContainerTimestamp);

        if (msg.sender == userName) {
            boxContainer.className = "msg-box-self";
            boxContainerMasterFlexs.appendChild(boxContainerMaster);
            return boxContainerMasterFlexs;                
        }
        else {
            boxContainerTimestamp.id = "mbc"+mbcCounter;
            mbcCounter++;
            return boxContainerMaster;
        }
    }



};