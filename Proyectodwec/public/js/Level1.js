class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    //Every time you enter in Level1
    init(data){
        //Receive the socket
        this.socket = data.socket;
        this.player=data.player;
        
        this.socket.emit('StartLevel1');
        //player 1 emit the socket.emit
        if(this.player==1){
            this.socket.emit('BananaLocation');
        }
        
       
        
    }

    create() {
         
        //TileSprite Background
        this.bgScene2 = this.add.tileSprite(0,0,900, 600,"road1").setOrigin(0,0);
        
        this.mycar;
        this.othercar;
        this.banana3;
        this.banana2;
        this.banana1;
        

        

        
        

        this.startTXT = this.add.text(10, 20, "Quit" , {font:"25px Arial", fill:"yellow"}).setAlpha(1).setDepth(9)
        .setInteractive().on("pointerdown",() => {            
            this.scene.start("Menu",{socket:this.socket, fromgame:true});
        });

        this.startTXT = this.add.text(750, 30, "Player "+this.player , {font:"30px Arial", fill:"blue"}).setAlpha(1);
        
        var self = this;
        
        this.otherCars = this.physics.add.group();
        
       
        

        //send to the server that I am active 
        //send to server playerStartLevel1
        //at server player.active = true
        //server send to all clients "CurrentActivePlayers"
        

        //from server
        this.socket.on('currentPlayersPlaying', function (players) {
            Object.keys(players).forEach(function (id) { 
                if (players[id].active){
                    if (players[id].playerId === self.socket.id) {
                        self.addMyCar(self, players[id]);
                    } else {
                        self.addOtherCar(self, players[id]);
                    }
                }
            });
        });

        


        this.socket.on('disconnectFromGame', function (playerId) {
            self.otherCars.getChildren().forEach(function (othercar) {
                if (playerId === othercar.playerId) {
                    othercar.destroy();
                }
            });
        });

        this.socket.on('disconnect', function (playerId) {
            self.otherCars.getChildren().forEach(function (othercar) {
                if (playerId === othercar.playerId) {
                    othercar.destroy();
                }
            });
        });
        this.cursors = this.input.keyboard.createCursorKeys();


        this.socket.on('playerMoved', function (playerInfo) {
            self.otherCars.getChildren().forEach(function (othercar) {
                if (playerInfo.playerId === othercar.playerId) {
                    othercar.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        


        //create a banana
        this.socket.on('BananaAppear', function (bananaLocation) {
            
            self.banana1 = self.physics.add.image(bananaLocation.x1, 12, 'banana').setOrigin(0, 0);
            //self.banana2 = self.physics.add.image(bananaLocation.x2, 12, 'banana').setOrigin(0, 0);
            //self.banana3 = self.physics.add.image(bananaLocation.x3, 12, 'banana').setOrigin(0, 0);
            //collisions
            self.physics.add.overlap(self.banana1, self.mycar, function () {
                console.log('lose');
                this.socket.emit('end',this.player);
            }, null, self);

            /*self.physics.add.overlap(self.banana2, self.mycar, function () {
                console.log('lose');
                this.socket.emit('end',this.player);
            }, null, self);

            self.physics.add.overlap(self.banana3, self.mycar, function () {
                console.log('lose');
                this.socket.emit('end',this.player);
            }, null, self);*/

            
             
        });
        //end Level1 and go to game over scene
        this.socket.on('endLevel1', function (data) {
            
            self.scene.start("GameOver",{player: data});
            
             
        });

        



      


         




        


    }//CREATE
    //create my player
    addMyCar(self, playerInfo) {
        console.log("add my CAr");
        console.log(playerInfo);
        self.mycar = self.physics.add.image(playerInfo.x, playerInfo.y, playerInfo.texture).setOrigin(0, 0);


        


    }


    //create the other player
    addOtherCar(self, playerInfo) {
        if (playerInfo.active){
            console.log("add other CAr");
            console.log(playerInfo);

            const othercar = self.add.image(playerInfo.x, playerInfo.y, playerInfo.texture).setOrigin(0, 0);
            
            othercar.playerId = playerInfo.playerId;
            self.otherCars.add(othercar);
        }
    }


    

    
    




    


    /****************************************************************************
    *  UPDATE                                                                 ***
    *****************************************************************************/
    update() {
         

        let keyA= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        let keyS= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        let keyD= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        let keyW= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        
        //move my player and send to the server the position of my player
        if (this.mycar) {
        this.mycar.setVelocityX(0);
        this.mycar.setVelocityY(0);
            

            if (keyA.isDown){
                if(this.mycar.x > 190){
                    this.mycar.setVelocityX(-150);
                }
                
            }else if (keyD.isDown){
                if(this.mycar.x < 650){
                    this.mycar.setVelocityX(150);
                }
                
            }
    
            if (keyW.isDown){
                if(this.mycar.y > 10){
                    this.mycar.setVelocityY(-150);
                }
                
            }else if (keyS.isDown){
                if(this.mycar.y < 540){
                    this.mycar.setVelocityY(150);
                }
                
            }

            var x = this.mycar.x;
            var y = this.mycar.y;


            if (this.mycar.oldPosition && (x !== this.mycar.oldPosition.x || y !== this.mycar.oldPosition.y )) {
                this.socket.emit('playerMovement', { x: this.mycar.x, y: this.mycar.y });
            }

            this.mycar.oldPosition = {
                x: this.mycar.x,
                y: this.mycar.y,
                
            };




        }

          //move the bananas
          if(this.banana1){

            this.banana1.setVelocityY(350);

          }

         /* if(this.banana2){

            this.banana2.setVelocityY(450);

          }*/

          if(this.banana1){
            
            //this.banana3.setVelocityY(500);
            
             //change bananas positions
            if(this.banana1.y > 550){
               /*this.banana3.x=240;
               this.banana3.y=12;
               this.banana2.x=350;
               this.banana2.y=12;
               this.banana1.x=600;
               this.banana1.y=12;*/

               if(this.player==1){
                this.socket.emit('BananaLocation');
               }

               


               
                

                
            }

          }


        

          
          
          
        


    }//update

   

}//class

export default Level1;