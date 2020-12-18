import BootLoader from './BootLoader.js';
import Menu from './Menu.js';
import Level1 from './Level1.js';
import Waiting from './Waiting.js';
import GameOver from './GameOver.js';


var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 900,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene:[BootLoader,Menu,Waiting,Level1,GameOver]
};

//Lastly, we passed our config object to Phaser when we created the new game instance.
var game = new Phaser.Game(config);


