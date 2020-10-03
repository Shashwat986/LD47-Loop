import Player from '../sprites/player.js'

class NewGameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'NewGameScene'
        });
    }

    preload() {
    }

    create() {
        // Add and play the music
        this.add.image(0, 0, 'clouds').setOrigin(0, 0).setScale(1.2, 2.5);
        this.add.image(0, 300, 'clouds').setOrigin(0, 0).setScale(1.2, 2.5);
        this.music = this.sound.add('overworld');
        this.music.play({
            loop: true
        });

        this.enemyGroup = this.add.group();

        for (let i = 0; i < 2; i++) {
          let cur = this.add.graphics();
          cur.fillStyle(0xffffff);
          cur.fillCircle(30, 30, 30);
          cur.setPosition(50 + i * 70, 0);

          this.physics.world.enable(cur);
          cur.body
            //.setCircle(30, 0, 0)
            .setCollideWorldBounds(true)
            .setBounce(1 - i / 20)
            .setVelocity(40, 0);

          this.enemyGroup.add(cur);
        }

        this.player = new Player(this, 600, 500);

        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.physics.add.collider(this.player, this.enemyGroup, function () {
          console.log(arguments);
        });

        this.cameras.main.setZoom(2).startFollow(this.player);

        this.keys = {
          jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
          jump2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
          fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
          down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        };
    }

    update (time, delta) {
      this.player.update(this.keys);

    //  // Run the update method of all enemies
    //  this.enemyGroup.children.entries.forEach(
    //      (sprite) => {
    //          sprite.update(time, delta);
    //      }
    //  );

    //  // Run the update method of non-enemy sprites
    //  this.powerUps.children.entries.forEach(
    //      (sprite) => {
    //          sprite.update(time, delta);
    //      }
    //  );
    }
}
export default NewGameScene;
