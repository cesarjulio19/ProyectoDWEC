class GameOver extends Phaser.Scene {

    constructor() {
        super("GameOver");
    }

    init(data){
        this.player=data.player;
        
       
        
    }

    create(){
        this.bgScene2 = this.add.tileSprite(0,0,900, 600,"road").setOrigin(0,0);
        this.startTXT = this.add.text(300, 300, "Player "+this.player+" Lose!" , {font:"80px Arial", fill:"red"}).setAlpha(1);
    }
}
export default GameOver;