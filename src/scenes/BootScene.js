class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
    }
    preload() {
        const progress = this.add.graphics();
        this.add.text(32*7, 32*8, "Loading... Please Wait", {fontSize: "24px"});

        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0x000000, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
         //   progress.destroy();
           // this.scene.start('GameScene', { id: 0 });
        });

        this.load.image('ball', 'assets/ball.png');
        this.load.spritesheet('shooter', 'assets/shooter.png', {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet('star', 'assets/star.png', {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet('hole', 'assets/hole.png', {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.image('wall', 'assets/wall.png');

        this.load.audio('overworld', 'assets/music.mp3');
        this.load.audio('winsound', 'assets/winsound.mp3');

        for (let i = 0; i <= window.numLevels; i++) {
          this.load.text("lv" + i, `assets/levels/lv${i}.csv`);
        }
    }

    create () {

    }
}

export default BootScene;
