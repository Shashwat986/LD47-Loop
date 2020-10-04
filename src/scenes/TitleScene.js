class TitleScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'TitleScene'
        });
    }

    preload() {
    }

    create() {
        this.add.text(32*12, 32*10, 'Congrats! You have completed all the puzzles!').setOrigin(0.5, 0.5);
        this.add.text(32*12, 32*11, 'Stay Tuned for more, and if you enjoyed this, please vote for me!').setOrigin(0.5, 0.5);

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
        this.scene.start('GameScene', { id: 0 });
    }
}

export default TitleScene;
