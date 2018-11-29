var userName = "";
//var baseURL = "ws://log2420-nginx.info.polymtl.ca"+ "/chatservice?username=";
var baseURL = "ws://inter-host.ca:3000"+ "/chatservice?username=";
var connectionHand;
var msgObs;
var chnlObs;

var modelChannels;
var presentChannel;
var notifications = 0;

var currentLanguage = "fr";
var mbcCounter = 0;
var muteSound = false;

$(document).ready(function(){
	askUsername();
});

/**
 *  Initialise la page et cree MessageObserver et ConnectionHandler
 *  et attache les EventListener
 */
function initialisation(){
	var wsURL = baseURL + userName;
	console.log(wsURL);

	msgObs = new MessageObserver();
	connectionHand = new ConnectionHandler(wsURL,msgObs);
	connectionHand.init();

	document.getElementById("but").addEventListener("click",sendMessage);
	document.getElementById("plusChaine").addEventListener("click",toggleCreateNewChannel);
	document.getElementById("switchUsername").addEventListener("click",toggleSwitchUsername);
	document.getElementById("switchLanguage").addEventListener("click",toggleLanguages);
	document.getElementById("pouce").addEventListener("click",sendThumb);
	document.getElementById("mute").addEventListener("click",toggleMute);

	$('input').on('keypress', (event)=> {
		if(event.which === 13){
			 sendMessage();
		}
	});
}

/**
 * Faire la mise a jour des notifications dans la vue
 */
function updateNotifications(){
	if(notifications != 0){
		document.getElementById("notifs").innerHTML = notifications;
	}else{
		document.getElementById("notifs").innerHTML = '';
	}
}

/**
 *  Ajouter l'eventListener afin que le button pour 
 *  donner le nom à l'utilisateur marche correctement
 */
function askUsername(){
	document.getElementById("butU").addEventListener("click",createUsername);
}

/**
 * Fonction appele lorsqu'on rentre le username, sans un premier 
 * username l'application n'est pas en marche (quand le username est bien
 * valide on appelle la fonction initialisation())
 */
function createUsername(){
	let inputChaine = document.getElementById("inputUsernameContainer");
	let data = inputChaine.childNodes[1].value;
	if(data.length >= 3 && data.length <= 15){
		document.getElementById("inputUsernameContainer").childNodes[1].value='';
		inputChaine.style.visibility="hidden";
		userName=data;
		document.getElementById("usernameName").innerHTML=userName;
		document.getElementById("butU").removeEventListener("click",createUsername);
		initialisation();
	}
	else{
		alert("Le nom d'utilisateur doit être compris entre 3 et 15 caractères!");
	}
}
/**
 * Fonciton appelee lorsqu'on clique sur envoyer ou sur
 * Enter pour envoyer le texte à la WebSocket
 */
function sendMessage(){
	let data = document.getElementById("tex").value;
	if(data != ''){
		let msg = new Message("onMessage",presentChannel.id, data,userName,new Date());
		connectionHand.send(msg);
		document.getElementById("tex").value = '';
	}
}

/**
 * Fonction appelee pour envoyer des pouces lorsquon click le sur bouton
 */
function sendThumb(){
	let msg = new Message("onMessage",presentChannel.id, "👍",userName,new Date());
	connectionHand.send(msg);
}

/**
 * fonction appelee pour changer l'etat du son lorsque on click sur le bouton
 */
function toggleMute () {
	muteSound = !muteSound;
	if (muteSound) {
		responsiveVoice.cancel();
		if (currentLanguage == "en") {
		document.getElementById("notifsSon").innerHTML="Sound Off";
		}
		else {
		document.getElementById("notifsSon").innerHTML="Muet";
		}
	}
	else {
		if (currentLanguage == "en") {
		document.getElementById("notifsSon").innerHTML="Sound On";
		}
		else {
		document.getElementById("notifsSon").innerHTML="Avec Son";
		}
	}
	
}
/**
 * Fonction appeler pour changer de langue lorsqu'on click sur le bouton
 * Pour tous les boutton, texte et label du interface, de francais en anglais ou le contraire
 * sauf les messages des utilisateurs
 */
function toggleLanguages(){
	if (currentLanguage == "fr") {
		if (muteSound) {
			document.getElementById("notifsSon").innerHTML="Sound Off";
		}
		else {
			document.getElementById("notifsSon").innerHTML="Sound On";
		}
		document.getElementById("notifsLangue").innerHTML="English";
		currentLanguage = "en";
		document.getElementById("groupList").innerHTML ="Groups List     ";
		document.getElementById("groupDisp").innerHTML ="All Groups Available:      ";
		document.getElementById("groupActif").innerHTML ="Current Group:";
		document.getElementById("envoyer").innerHTML ="Send";
		document.getElementById("tex").placeholder ="Enter your message";
		//start
		for (i = 0; i < mbcCounter; i++) {
		var original = document.getElementById("mbc"+i).innerHTML;
		var staging = original[0]+original[1];
		var newDay;
		switch (staging) {
			case "Di":
				newDay = "Sunday";
				original = original.substr(8);
			break;
			case "Lu":
				newDay = "Monday";
				original = original.substr(5);
			break;
			case "Ma":
				newDay = "Tuesday";
				original = original.substr(5);
			break;
			case "Me":
				newDay = "Wednesday";
				original = original.substr(8);
			break;
			case "Je":
				newDay = "Thursday";
				original = original.substr(5);
			break;
			case "Ve":
				newDay = "Friday";
				original = original.substr(8);
			break;
			case "Sa":
				newDay = "Saturday";
				original = original.substr(6);
			break;
			
			
		}
		original = newDay + original;
		document.getElementById("mbc"+i).innerHTML = original;
	}
	//end
	}
	else {
		if (muteSound) {
			document.getElementById("notifsSon").innerHTML="Muet";
		}
		else {
			document.getElementById("notifsSon").innerHTML="Avec Son";
		}
		document.getElementById("notifsLangue").innerHTML="Français";
		currentLanguage = "fr";
		document.getElementById("groupList").innerHTML="Liste des groupes";
		document.getElementById("groupDisp").innerHTML ="Groupes disponibles:";
		document.getElementById("groupActif").innerHTML ="Groupe Actif:";
		document.getElementById("envoyer").innerHTML ="Envoyer";
		document.getElementById("tex").placeholder ="Entrez votre message";
		//start
		for (i = 0; i < mbcCounter; i++) {
		var original = document.getElementById("mbc"+i).innerHTML;
		var staging = original[0]+original[1];
		var newDay;
		switch (staging) {
			case "Su":
				newDay = "Dimanche";
				original = original.substr(6);
			break;
			case "Mo":
				newDay = "Lundi";
				original = original.substr(6);
			break;
			case "Tu":
				newDay = "Mardi";
				original = original.substr(7);
			break;
			case "We":
				newDay = "Mercredi";
				original = original.substr(9);
			break;
			case "Th":
				newDay = "Jeudi";
				original = original.substr(8);
			break;
			case "Fr":
				newDay = "Vendredi";
				original = original.substr(5);
			break;
			case "Sa":
				newDay = "Samedi";
				original = original.substr(8);
			break;
			
			
		}
		original = newDay + original;
		document.getElementById("mbc"+i).innerHTML = original;
	}
	//end
	}
	
	
}


/**
 * Fonction appelee pour faire apparaitre le champ de saisie et le bouton
 * permettant à l'utilisateur de créer une nouvelle chaîne
 * @param {event} event - 
 */
function toggleCreateNewChannel(event){

	let inputChaine = document.getElementById("inputChaineContainer");
	
	if(inputChaine.style.visibility!="visible"){
		inputChaine.style.visibility="visible";
		event.currentTarget.parentNode.style.transform="rotate(45deg)";
		document.getElementById("butC").addEventListener("click", createNewChannel);
	}
	else{
		inputChaine.style.visibility="hidden";
		event.currentTarget.parentNode.style.transform="rotate(0deg)";
		document.getElementById("butC").removeEventListener("click", createNewChannel);
	}
	
}

/**
 *  Fonction appelee pour faire apparaitre le champ de saisie et le bouton
 * permettant à l'utilisateur de créer se connecter sous un nouveau nom
 * d'utilisateur
 * @param {event} event - 
 */
function toggleSwitchUsername(event){
	let inputChaine = document.getElementById("inputUsernameContainer");
	
	if(inputChaine.style.visibility!="visible"){
		inputChaine.style.visibility="visible";
		event.currentTarget.parentNode.style.transform="rotate(45deg)";
		document.getElementById("butU").addEventListener("click", switchUsername);
	}
	else{
		inputChaine.style.visibility="hidden";
		event.currentTarget.parentNode.style.transform="rotate(0deg)";
		document.getElementById("butU").removeEventListener("click", switchUsername);
	}
	
}
/**
 *  fonction qui crée une nouvelle chaîne en envoyant le message approprié
 *  au WebSocket en se basant sur les entrées de l'utilisateur
 */
function createNewChannel(){
	let inputChaine = document.getElementById("inputChaineContainer");
	let data = inputChaine.childNodes[1].value;
	if(data != ''){
		let msg = new Message("onCreateChannel",undefined, data,userName,new Date());
		console.log(msg);
		connectionHand.send(msg);
		document.getElementById("inputChaineContainer").childNodes[1].value='';
		
		simulateClick(document.getElementById("plusChaine"));
	}
}
/**
 *  fonction qui modifie le nom d'utilisateur et permet une nouvelle connexion
 * au WebSocket
 */
function switchUsername(){
	let inputChaine = document.getElementById("inputUsernameContainer");
	let data = inputChaine.childNodes[1].value;
	if(data != ''){
		document.getElementById("inputUsernameContainer").childNodes[1].value='';
		userName=data;
		document.getElementById("usernameName").innerHTML=userName;
		connectionHand.switchUsername(userName);
		simulateClick(document.getElementById("switchUsername"));
	}
}
/**
 * fonction pour obtenir l'index (la positon) d'une chaîne dans le modèle
 * @param {String} idChaine 
 */
function getModelChannelIndex(idChaine){
	for(let i = 0 ; i < modelChannels.length ; i++){
		if(modelChannels[i].id == idChaine){
			return i;
		}
	}
	return -1;
}

/**
 * fonction pour changer de chaîne (passer d'un groupe de discussion à 
 * un autre)
 * @param {event} event - 
 */
function switchToChannel(event){
	let idChaine = event.currentTarget.parentNode.parentNode.id;
	let chaine;

	chaine = modelChannels[getModelChannelIndex(idChaine)];

	if(chaine.joinStatus && chaine != presentChannel){
		presentChannel = chaine;
		
		var boiteMessages = document.getElementById("msg-box-container");

		while(boiteMessages.firstChild){
			boiteMessages.removeChild(boiteMessages.firstChild);
		}
	
		notifications = 0;
		updateNotifications();

		connectionHand.requestOnGetChannel(idChaine);

	}
	else if (chaine == presentChannel){
		console.log("Déjà là!");
	}
	else{
		console.log("Ne peut pas encore aller vers cette chaine");
		alert("Vous devez rejoindre cette chaîne avant d'accéder à ses messages");
	}
}
/**
 * fonction pour changer le texte de chargement
 * @param {string} str - 
 */
function changeLoadingText(str){
	document.getElementById("loading").innerHTML=str;
}

/**
 * fonction appelée lorsque l'utilisateur veut faire partie d'une nouvelle
 * chaîne
 * @param {event} event - 
 */
function joinChannel(event){
	var idToJoin = event.currentTarget.parentNode.parentNode.id;
	let msg = new Message("onJoinChannel",idToJoin,undefined,userName,new Date());
	connectionHand.send(msg);
}
/**
 * fonction appelée lorsque l'utilisateur veut quitter une chaîne
 * @param {event} event - 
 */
function leaveChannel(event){
	var idToLeave = event.currentTarget.parentNode.parentNode.id;
	if(idToLeave == presentChannel.id){
		goToGeneral();
	}
	let msg = new Message("onLeaveChannel",idToLeave,undefined,userName,new Date());
	connectionHand.send(msg);
}

/**
 * faire la mise à jour de la vue contenant les messages de la chaîne dans laquelle
 * l'utilisateur se trouve
 */

function updatePresentChannelView(){
	document.getElementById("txtPresentChannel").innerHTML=presentChannel.name + " ("+presentChannel.numberOfUsers+")";
	presentChannel.messages.forEach(element => {
		msgObs.displayNewMessage(element);
	});
	presentChannel.messages=new Array();
}
/**
 * faire la mise à jour de la vue de la liste des chaînes
 */
function updateChannelsView(){
	var boiteGroupes = document.getElementById("groupes");
	var fonce = true;
	while(boiteGroupes.firstChild){
		boiteGroupes.removeChild(boiteGroupes.firstChild);
	}
	//Afficher les chaines dont on fait partie
	for(let i = 0 ; i < modelChannels.length ; i++){
		let chaine = modelChannels[i];
		if(chaine.joinStatus){
			boiteGroupes.appendChild(generateChannelView(chaine.id,chaine.name,chaine.joinStatus,chaine.numberOfUsers,fonce));
			fonce = !fonce;
		}
	}
	//Afficher les autres chaines
	for(let i = 0 ; i < modelChannels.length ; i++){
		let chaine = modelChannels[i];
		if(!chaine.joinStatus){
			boiteGroupes.appendChild(generateChannelView(chaine.id,chaine.name,chaine.joinStatus,chaine.numberOfUsers,fonce));
			fonce = !fonce;
		}
	}
}

/**
 * Génère un objet HTML correspondant à une chaîne dans la liste des chaînes
 * disponibles
 * 
 * @param {String} id - le id de la chaîne
 * @param {String} name - le nom de la chaîne
 * @param {Boolean} status - si l'utilisateur fait partie ou pas de la chaîne
 * @param {Int} nbrUsers - le nombre d'utilisateurs de la chaîne
 * @param {boolean} fonce - le fond de la chaîne (foncé ou clair)
 */

function generateChannelView(id,name,status,nbrUsers,fonce){
	let divChaine = document.createElement("div");
	divChaine.id=id;
	if(fonce){
		divChaine.className="chaine fonce";
	}else{
		divChaine.className="chaine pale";
	}

	let icone = document.createElement("div");
	let forme = document.createElement("i");
	let nom = document.createElement("div");
	let changer = document.createElement("input");
	let div = document.createElement("div");
	let join = document.createElement("input");

	nom.className="texteChaine";
	nom.innerHTML=name + " (" + nbrUsers + ")";

	join.type="button";
	join.id="inputJoinChannel";

	if(name == "Général"){
		icone.className="iconeChaine orange";
		forme.className="fas fa-star";
		join.addEventListener("click",switchToChannel);
	}else if(status){
		icone.className="iconeChaine orange";
		forme.className="fas fa-minus";
		join.addEventListener("click",leaveChannel);
	}else{
		icone.className="iconeChaine bleu";
		forme.className="fas fa-plus";
		join.addEventListener("click",joinChannel);
	}

	changer.type="button";
	changer.id="chaineSelectInput";

	changer.addEventListener("click",switchToChannel);

	div.style.position="relative";
	div.style.display="flex";

	div.appendChild(nom);
	div.appendChild(changer);

	icone.appendChild(join);
	icone.appendChild(forme);
	divChaine.appendChild(icone);
	divChaine.appendChild(div);
	return divChaine;
}

/**
 * Fait revenir la vue des messages la chaîne présente à celle de la 
 * chaîne générale
 */

function goToGeneral(){
	simulateClick(document.getElementById(modelChannels[0].id).childNodes[1].childNodes[1]);
}

/**
 * Permet de simuler le clique sur un élément de la vue
 * 
 * @param {Any} itemToClick - l'élément à cliquer
 */

function simulateClick(itemToClick) {
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,
	  0, 0, 0, 0, 0, false, false, false, false, 0, null);
	
	  let elm = itemToClick;
	  elm.dispatchEvent(evt);
 }