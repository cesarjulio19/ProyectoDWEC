class BootLoader extends Phaser.Scene {
    constructor(){
        super("BootLoader");         
    }


    preload() {
        
        this.load.image("road", "assets/road.png");
        this.load.image("mario", "assets/cm.png");
        this.load.image("luigi", "assets/cl.png");
        this.load.image("bowser", "assets/cb.png");
        this.load.image("peach", "assets/cp.png");
        this.load.image("road1", "assets/road1.png");
        this.load.image("banana", "assets/banana.png");
        /*this.load.spritesheet("mario","assets/mario.png",{
            frameWidth: 32,
            frameHeight: 34
        });
        this.load.spritesheet("luigi","assets/luigi.png",{
            frameWidth: 32,
            frameHeight: 35
        });
        this.load.spritesheet("peach","assets/peach.png",{
            frameWidth: 31,
            frameHeight: 36
        });
        this.load.spritesheet("bowser","assets/bowser.png",{
            frameWidth: 33,
            frameHeight: 37
        });*/
        
        //Load some new textures
        //for (let i=1;i<=5;i++) this.load.image('player'+i, 'assets/player'+ i + '.png');
        
    }

    create(){

        /*this.anims.create({
            key : "mario_move",
            frames: this.anims.generateFrameNumbers("mario"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key : "peach_move",
            frames: this.anims.generateFrameNumbers("peach"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key : "luigi_move",
            frames: this.anims.generateFrameNumbers("luigi"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key : "bowser_move",
            frames: this.anims.generateFrameNumbers("bowser"),
            frameRate: 20,
            repeat: -1
        });*/
        //CLIENT: Say to the Server that I am here. I will have a socket.id
        this.socket = io();
        //go to scene
        this.scene.start("Menu", {socket:this.socket, fromgame:false});
    }

}

export default BootLoader;