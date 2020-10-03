import Player from '../sprites/player.js'
import Item from '../sprites/item.js'

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
  }

  preload() {
    this.data = {
      items: [
        {
          type: 'SHOOTER',
          direction: 3,
          x: 160,
          y: 320
        },
        {
          type: 'MIRROR',
          direction: 1,
          x: 640,
          y: 320
        },
        {
          type: 'STAR',
          x: 640,
          y: 96
        },
        {
          type: 'HOLE',
          x: 160,
          y: 96
        }
      ],
      totalStars: 1,
      ballOrigin: {
        x: 160,
        y: 320
      },
      texts: [
        {
          text: "Hello World",
          x: 160,
          y: 380
        }
      ]
    }

    this.starsCollected = 0;
    this.totalStars = this.data.items.filter((v) => v.type == 'STAR').length
    this.running = false;
    this.over = false;
  }

  create() {
    // this.music = this.sound.add('overworld');
    // this.music.play({
    //     loop: true
    // });

    this.ballGroup = this.add.group();
    this.pathGroup = this.add.group();
    this.toReset = this.add.group();

    this.addBalls();

    for (let i = 0; i < this.data.items.length; i++) {
      let it = new Item(this, this.data.items[i], this.ballGroup);
    }

    for (let i = 0; i < this.data.texts.length; i++) {
      let tt = this.data.texts[i]
      this.add.text(tt.x, tt.y, tt.text).setOrigin(0.5, 0.5)
    }

    this.setActionButtons();
  }

  update (time, delta) {
    if (!this.over)
      this.currentTime = time;

    if (this.running) {
      this.player.update(time)
    }

    this.updateScore(time)
  }

  addBall (state) {
    let bl = new Player(this, this.data.ballOrigin.x, this.data.ballOrigin.y, state);
    this.ballGroup.add(bl)

    return bl
  }

  addBalls () {
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (!this.running) {
          this.addBall(false)
        }
      },
      loop: true
    });
  }

  checkWin () {
    if (this.running && !this.over && this.starsCollected == this.totalStars) {
      this.over = true;

      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.addBall(true)
        },
        repeat: 3
      });

      this.time.addEvent({
        delay: 500,
        callback: () => {
          if (this.pathGroup) {
            this.pathGroup.children.each((fn) => {
              fn.scale *= 1.2;
            });
          }
        },
        repeat: 10
      });

      return true;
    }
    return false;
  }

  updateScore (time = 0) {
    if (this.score == null) {
      this.score = this.add.text(0, 0, "").setDepth(30);
    }
    this.score.setText(`
      Number of Stars Remaining: ${this.totalStars - this.starsCollected}
      Time: ${parseInt(this.currentTime / 1000)} s
    `)
  }


  setActionButtons () {
    this.run = this.add.text(384, 640, "Run", {
      fontSize: "72px",
      backgroundColor: "#f00",
      color: "#fff",
      padding: {x: 15, y: 15}
    }).setOrigin(0.5, 1).setInteractive();

    this.run.on('pointerup', () => {
      if (!this.running) {
        this.ballGroup.clear(true, true);
        this.player = this.addBall(true);
        this.running = true;
        this.run.setText("Stop");
      } else {
        this.ballGroup.clear(true, true);
        this.pathGroup.clear(true, true);
        this.running = false;
        this.over = false;
        this.toReset.children.each((fn) => {
          fn.visible = true;
        });
        this.run.setText("Run");
      }
    });
  }
}
export default GameScene;
