class Waiting extends Phaser.Scene {
    constructor(){
        super("Waiting");
    }

    init(data){
        //Receive the socket
        this.socket = data.socket;
        //Send to SERVER the information that I'm playing
        this.texture = data.texture;
        this.socket.emit('setPlayer', {
            player: data.player,
        texture: data.texture});
        //this.socket.emit('playerStartLevel1', data.texture);
        this.player=data.player;
    }

    create(){
        this.bgScene2 = this.add.tileSprite(0,0,900, 600,"road").setOrigin(0,0);
        this.startTXT = this.add.text(300, 300, "WAITING..." , {font:"80px Arial", fill:"red"}).setAlpha(1);
        let self=this;

        //SERVER --> CLIENT each time an user (include me) is connected or entered in the game
        this.socket.on('currentPlayersWaiting', function (players) {
            self.ActivePlayers(players,self);            
        });

        //SERVER --> CLIENT every time a client disconnect (not me)
        this.socket.on('disconnect', function (playerId) {            
            delete self.allPlayers[playerId];
            self.ActivePlayers(self.allPlayers,self);           
        });







    }

    ActivePlayers(players,self){
        let actives=0;
        //Loop players and ask who is active
    Object.keys(players).forEach(function (id) {      
        if (players[id].active){
            actives++;
            console.log(players[id].player);
            console.log(players[id].texture);
        } 
    });

      if(actives==2){
         self.scene.start("Level1",{
            socket:this.socket,
            player: this.player
         });

      }
      
    }

    
}
export default Waiting;