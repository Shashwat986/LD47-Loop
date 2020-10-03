export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, running = false) {
    super(scene, x, y, 'ball');
    this.scene = scene;
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    scene.add.existing(this);
    this.body.setBounce(1);
    this.body.setCircle(1, 15, 15);
    this.setDepth(20);

    this.running = running;

    if (!this.running) {
      this.setScale(0.2);
      scene.time.delayedCall(6000, () => {
        this.destroy();
      });
    }

    this.baseVelocity = 300;
    this.baseTime = 6000
  }

  update (time) {
    if (this.scene && this.scene.running && !this.scene.over) {
      let cur = this.scene.add.graphics();
      cur.fillStyle(0xffffff);
      cur.fillCircle(1, 1, 1);
      cur.setPosition(this.x, this.y);

      this.scene.pathGroup.add(cur);
    }
  }

  setDirection (x, y) {
    this.body.setVelocityX(this.baseVelocity * x / Math.sqrt(x*x + y*y))
    this.body.setVelocityY(this.baseVelocity * y / Math.sqrt(x*x + y*y))
  }
}
