import Player from '../sprites/player.js'
import Item from '../sprites/item.js'

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
  }

  preload() {
    this.items = [
      {
        type: 'SHOOTER',
        direction: 1,
        x: 160,
        y: 320,
        starting: true
      },
      {
        type: 'MIRROR',
        direction: 2,
        x: 640,
        y: 320
      },
      {
        type: 'STAR',
        x: 640,
        y: 96
      }
    ]

    this.starsCollected = 0;
    this.totalStars = this.items.filter((v) => v.type == 'STAR').length
    this.running = false;
  }

  create() {
    // this.music = this.sound.add('overworld');
    // this.music.play({
    //     loop: true
    // });

    this.startingPoint = this.items.find((v) => v.starting)
    this.ballGroup = this.add.group()
    if (this.running) {
      this.player = new Player(this, this.startingPoint.x, this.startingPoint.y, true);
      this.ballGroup.add(this.player)
    } else {
      this.addBall();
    }

    for (let i = 0; i < this.items.length; i++) {
      let it = new Item(this, this.items[i], this.ballGroup);
    }
  }

  update (time, delta) {
    if (this.running) {
      this.player.update(time)
    }
  }

  addBall () {
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (!this.running) {
          let bl = new Player(this, this.startingPoint.x, this.startingPoint.y);
          this.ballGroup.add(bl)
        }
      },
      loop: true
    });
  }

  checkWin () {
    if (this.running && this.starsCollected == this.totalStars) {
      console.log("WIN!!");
      this.player.destroy();
      return true;
    }
    return false;
  }
}
export default GameScene;
