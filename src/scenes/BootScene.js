class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
    }
    preload() {
        const progress = this.add.graphics();

        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0x000000, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
            progress.destroy();
            this.scene.start('GameScene');
        });

        this.load.image('ball', 'assets/ball.png');
        this.load.spritesheet('shooter', 'assets/shooter.png', { frameWidth: 32, frameHeight: 32});
        this.load.image('mirror', 'assets/mirror.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('hole', 'assets/hole.png');
        // this.load.audio('overworld', 'assets/music/BeepBox-Song.wav');
        // this.load.image('player', 'assets/images/player.png');
    }

    create () {
      this.add.text(0, this.sys.game.config.height / 2, "Hello");

    }
}

export default BootScene;
