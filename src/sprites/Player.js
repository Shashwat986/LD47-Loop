export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setCollideWorldBounds(true)
          .setBounce(0.2);
        this.acceleration = 600;
        this.body.maxVelocity.x = 200;
        this.body.maxVelocity.y = 500;
        this.body.setFriction(1,0);
        this.body.setDrag(300,0);
    }

    update (keys) {
        let input = {
            left: keys.left.isDown,
            right: keys.right.isDown,
            down: keys.down.isDown,
            jump: keys.jump.isDown
        };

        if (input.left) {
          this.body.setAccelerationX(-this.acceleration);
        } else if (input.right) {
          this.body.setAccelerationX(this.acceleration);
        } else {
          this.body.setAccelerationX(0);
        }

        if (input.jump)
          console.log(this.body.touching)

        if (input.jump && this.body.touching.up) {
          console.log("Touching")
          this.body.setVelocityY(-this.acceleration);
        } else {
            this.body.setAccelerationY(0);
        }
    }

    run(vel) {
        this.body.setAccelerationX(vel);
    }

    jump() {
        if (!this.body.blocked.down && !this.jumping) {
            return;
        }

        if (!this.jumping) {
            if (this.animSuffix === '') {
                this.scene.sound.playAudioSprite('sfx', 'smb_jump-small');
            } else {
                this.scene.sound.playAudioSprite('sfx', 'smb_jump-super');
            }
        }
        if (this.body.velocity.y < 0 || this.body.blocked.down) {
            this.body.setVelocityY(-200);
        }
        if (!this.jumping) {
            this.jumpTimer = 300;
        }
        this.jumping = true;
    }

    die() {
        this.scene.music.pause();
        this.play('death');
        this.scene.sound.playAudioSprite('sfx', 'smb_mariodie');
        this.body.setAcceleration(0);
        this.body.setVelocity(0, -300);
        this.alive = false;
    }

}
