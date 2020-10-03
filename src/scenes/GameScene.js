import Player from '../sprites/player.js'
import Item from '../sprites/item.js'

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
  }

  init (data) {
    this.levelID = 0;
    if (data && data.id && this.cache.text.get("lv" + data.id)) {
      this.levelID = data.id;
    }
  }

  preload (data) {
    this.DEBUG = window.DEBUG;

    this.data = Item.CSVToItem("lv" + this.levelID, this);

    this.starsCollected = 0;
    this.totalStars = this.data.totalStars;
    this.running = false;
    this.over = false;
  }

  create() {
    this.music = this.sound.add('overworld');
    this.music.play({
        loop: true
    });

    this.ballGroup = this.add.group({runChildUpdate: true});
    this.pathGroup = this.add.group();
    this.toReset = this.add.group();

    this.addBalls();

    if (this.data.items) {
      for (let i = 0; i < this.data.items.length; i++) {
        let it = new Item(this, this.data.items[i], this.ballGroup);
      }
    }

    if (this.data.texts) {
      for (let i = 0; i < this.data.texts.length; i++) {
        let tt = this.data.texts[i]
        this.add.text(tt.x, tt.y, tt.text).setOrigin(0, 0)
      }
    }

    this.setActionButtons();
  }

  update (time, delta) {
    if (!this.over)
      this.currentTime = time;

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
      loop: !this.DEBUG,
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
        delay: 300,
        callback: () => {
          if (this.pathGroup) {
            this.pathGroup.children.each((fn) => {
              fn.scale *= 1.2;
            });
          }
        },
        repeat: 10
      });

      this.time.delayedCall((this.levelID == 0 ? 3000 : 0), () => {
        this.add.text(32*24, 32*20, (this.levelID == 0 ? "Start" : "Next"), {
          fontSize: "36px",
          backgroundColor: "#090",
          color: "#fff",
          padding: {x: 15, y: 15}
        }).setOrigin(1, 1)
          .setDepth(50)
          .setInteractive()
          .once('pointerup', () => {
            this.nextLevel();
        });
      });

      this.time.delayedCall(3000, () => {
        this.completedText = this.add.text(32*12, 32*10, (this.levelID == 0 ? "Looper" : "Loop Completed!"), {
          fontSize: "72px",
          backgroundColor: "#000",
          color: "#fff",
          padding: {x: 15, y: 15}
        }).setOrigin(0.5, 0.5)
          .setDepth(50)
          .setInteractive()
          .once('pointerup', () => {
            this.nextLevel();
        });

      });

      return true;
    }
    return false;
  }

  updateScore (time = 0) {
    if (this.levelID == 0) {
    } else {
      this.score.setText(`
        Number of Stars Remaining: ${this.totalStars - this.starsCollected}
        Time: ${parseInt(this.currentTime / 1000)} s
      `)
    }
  }

  setActionButtons () {
    this.score = this.add.text(0, 0, "").setDepth(30);

    if (this.levelID == 0) {

    }

    this.run = this.add.text(384, 640, "Loop!", {
      fontSize: "36px",
      backgroundColor: "#c30",
      color: "#fff",
      padding: {x: 15, y: 15}
    }).setOrigin(0.5, 1).setInteractive();

    this.run.on('pointerup', () => {
      if (this.DEBUG) {
        this.addBalls();
        return;
      }
      if (!this.running) {
        this.ballGroup.clear(true, true);
        this.player = this.addBall(true);
        this.running = true;
        this.run.setText("Stop");
      } else {
        this.ballGroup.clear(true, true);
        this.pathGroup.clear(true, true);
        if (this.completedText)
          this.completedText.destroy();
        this.running = false;
        this.over = false;
        this.toReset.children.each((fn) => {
          fn.visible = true;
        });
        this.run.setText("Loop!");
      }
    });
  }

  nextLevel () {
    if (this.levelID == window.numLevels) {
      this.scene.start('TitleScene')
    } else {
      this.scene.start('GameScene', {id: this.levelID + 1})
    }
  }
}
export default GameScene;
