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
    if (window.music) {
      if (window.music.isPlaying) {
      } else {
        window.music.play({ loop: true })
      }
    } else {
      window.music = this.sound.add('overworld');
      window.music.play({
          loop: true
      });
    }

    this.winSound = this.sound.add('winsound');

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
        this.add.text(tt.x, tt.y, tt.text).setOrigin(tt.originX, 0)
      }
    }

    this.setActionButtons();
    this.currentTime = 0;
  }

  update (time, delta) {
    if (!this.over)
      this.currentTime += delta;

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

      if (window.solvedState && window.solvedState > this.levelID) {
      } else {
        window.localStorage.setItem('loopState', this.levelID);
        window.solvedState = this.levelID;
      }

      if (this.levelID > 0) {
        window.music.pause();
        this.winSound.play();
      }


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
        if (this.levelID == 0) {
          this.add.rectangle(0, 0, 32*48, 32*40, 0x000000, 0.6)
            .setDepth(40)
            .setInteractive()
            .once('pointerup', () => this.nextLevel());
        }
        this.completedText = this.add.text(32*12, 32*10, (this.levelID == 0 ? "        Looper        " : "Loop Completed!"), {
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

    if (this.levelID > 0) {
      this.add.text(16, 16, "#" + this.levelID, {
        fontSize: "24px"
      });

      for (let i = 1; i <= window.numLevels; i++) {
        let solved = (window.solvedState != null && i <= window.solvedState);
        let available = solved || (window.solvedState != null && i - 1 == window.solvedState);
        let t = this.add.text(32 * 24, 16 + 32 * (i-1), '#' + i, {
          fontSize: '24px',
          color: ( solved ? "#0a0" : ( available ? "#fff" : "#888" ) )
        }).setOrigin(1, 0)

        if (available || this.DEBUG) {
          t.setInteractive()
           .once('pointerup', () => {
            this.nextLevel(i);
          });
        }
      }
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
        this.starsCollected = 0;
        this.toReset.children.each((fn) => {
          fn.visible = true;
        });
        this.run.setText("Loop!");
      }
    });
  }

  nextLevel (i) {
    let levelID = null;
    if (i != null) {
      levelID = i;
    } else if (this.levelID == 0 && window.solvedState) {
      levelID = window.solvedState + 1;
    } else {
      levelID = this.levelID + 1;
    }

    if (levelID > window.numLevels) {
      this.scene.start('TitleScene')
    } else {
      this.scene.start('GameScene', { id: levelID })
    }
  }
}
export default GameScene;
