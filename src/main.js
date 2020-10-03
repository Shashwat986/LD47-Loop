import 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 32*24,
    height: 32*20
  },
  backgroundColor: '#ccf',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  scene: [
    BootScene,
    TitleScene,
    GameScene
  ]
};

const game = new Phaser.Game(config);
