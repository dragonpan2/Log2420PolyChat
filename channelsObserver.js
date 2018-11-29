class ChannelObserver{

	/**
	*Constructeur du ChannelObserver
	*@constructor
	*@param {message} msg  - objet qui contient tous les informations du message 
	*/
    constructor(msg){
        this.updateChannels(msg);
    }

	/**
	* fonction pour realiser le mis a jours des différents channels
	*@param {message} mesg - objet avec lequel on va faire le mis a jour des informations des channel
	*/
    updateChannels(mesg){
        modelChannels = new Array(mesg.data.length);
       
        modelChannels = mesg.data.map(x=>x);

        modelChannels.forEach(element => {
            element.messages=new Array();
        });
        if(presentChannel == null || !presentChannel.joinStatus){
            presentChannel = modelChannels[0];
        }
        updateChannelsView();
        updatePresentChannelView();

    }
    
};