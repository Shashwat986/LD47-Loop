class TitleScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'TitleScene'
        });
    }

    preload() {
    }

    create() {
        this.add.text(400, 300, 'PRESS X TO START').setOrigin(0.5, 0.5);

        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.input.on('pointerdown', () => {
            this.startGame();
        });
    }

    update(time, delta) {
        if (this.startKey.isDown) {
            this.startGame();
        }
    }

    startGame() {
        this.scene.start('GameScene');
    }
}

export default TitleScene;
