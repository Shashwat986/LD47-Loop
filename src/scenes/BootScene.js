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
            this.scene.start('TitleScene');
        });

        this.load.image('clouds', 'assets/images/blue-sky.png');
        this.load.audio('overworld', 'assets/music/BeepBox-Song.wav');
        this.load.image('player', 'assets/images/player.png');
    }

    create () {
      this.add.text(0, this.sys.game.config.height / 2, "Hello");

    }
}

export default BootScene;
