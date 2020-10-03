import 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import NewGameScene from './scenes/NewGameScene';

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  backgroundColor: '#ccf',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 800
      }
    }
  },
  scene: [
    BootScene,
    TitleScene,
    NewGameScene
  ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
