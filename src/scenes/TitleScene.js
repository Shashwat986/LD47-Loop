class TitleScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'TitleScene'
        });
    }

    preload() {
    }

    create() {
        this.add.image(0, 0, 'clouds').setOrigin(0, 0).setScale(1.2, 2.5);
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
        this.scene.start('NewGameScene');
    }
}

export default TitleScene;
