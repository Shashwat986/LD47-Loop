export default class Item extends Phaser.GameObjects.Sprite {
  constructor(scene, item, player) {
    super(scene, item.x, item.y, item.type.toLowerCase());
    scene.physics.world.enable(this);
    this.body.setCircle(5, 11, 11);
    scene.add.existing(this);

    this.scene = scene;
    this.type = item.type;
    this.direction = item.direction;

    this.updateImage();

    scene.physics.add.overlap(this, player, (p1, p2, evt) => {
      this.processCollision(p2)
    });

    this.setInteractive().on('pointerup', (pointer, lx, ly, evt) => {
      evt.stopPropagation();
      if (!this.scene.running)
        this.rotateDirection();
    });
  }

  processCollision (player) {
    switch (this.type) {
      case 'SHOOTER':
        if (this.scene.checkWin())
          return;

        let deltaX = [ null,  6,  6,  0, -6, -6, -6,  0,  6 ][this.direction];
        let deltaY = [ null,  0, -6, -6, -6,  0,  6,  6,  6 ][this.direction];

        player.x = this.x + deltaX;
        player.y = this.y + deltaY;
        player.setDirection(deltaX, deltaY);

        break;
      case 'MIRROR':
        if (this.direction == 1) {
          // Pointing L>D, R>U
          player.body.velocity = player.body.velocity.mirror(new Phaser.Math.Vector2(-1, -1))
        } else {
          // Pointing L>U, R>D
          player.body.velocity = player.body.velocity.mirror(new Phaser.Math.Vector2(-1, 1))
        }
        break;
      case 'STAR':
        if (player.running && this.visible) {
          this.scene.starsCollected += 1;
          this.visible = false;
          this.scene.toReset.add(this);
        }
        break;
      case 'HOLE':
        player.destroy();
        break
    }
  }

  rotateDirection () {
    this.direction += 1;

    switch (this.type) {
      case 'SHOOTER':
        if (this.direction > 8)
          this.direction = 1
        break;
      case 'MIRROR':
        if (this.direction > 2)
          this.direction = 1
        break;
    }

    this.updateImage()
  }

  updateImage () {
    switch (this.type) {
      case 'SHOOTER':
        this.setFlipX([4, 5, 6].includes(this.direction))
        this.setFlipY([6, 7, 8].includes(this.direction))
        this.setFrame([ null, 2, 0, 1, 0, 2, 0, 1, 0 ][this.direction])

        break;
      case 'MIRROR':
        this.setFlipX(this.direction == 1)

        break;
    }
  }
}
