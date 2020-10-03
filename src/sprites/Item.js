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
        switch (this.direction) {
          case 1:
            // Pointing L>D
            player.body.velocity = player.body.velocity.mirror(new Phaser.Math.Vector2(-1, -1))
            break;
          case 2:
            // Pointing L>U
            player.body.velocity = player.body.velocity.mirror(new Phaser.Math.Vector2(-1, 1))
            break;
        }
        break;
      case 'STAR':
        if (player.running) {
          this.scene.starsCollected += 1;
          this.destroy();
        }
        break;
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
        this.setFlipX(false);
        this.setFlipY(false);
        switch (this.direction) {
          case 1:
            this.setFrame(2);
            break;
          case 2:
            this.setFrame(0);
            break;
          case 3:
            this.setFrame(1);
            break;
          case 4:
            this.setFrame(0);
            this.setFlipX(true)
            break;
          case 5:
            this.setFrame(2);
            this.setFlipX(true);
            break;
          case 6:
            this.setFrame(0);
            this.setFlipX(true);
            this.setFlipY(true);
            break;
          case 7:
            this.setFrame(1);
            this.setFlipY(true);
            break;
          case 8:
            this.setFrame(0);
            this.setFlipY(true);
        }
        break;
      case 'MIRROR':
        switch (this.direction) {
          case 1:
            this.setFlipX(true);
            break;
          case 2:
            this.setFlipX(false);
            break;
        }
        break;
      case 'STAR':
        break;
    }
  }
}
