import Papa from 'papaparse';

export default class Item extends Phaser.GameObjects.Sprite {
  static CSVToItem (key, scene) {
    let csvData = Papa.parse(scene.cache.text.get(key)).data;
    let ballOrigin = null;
    let totalStars = 0;
    let texts = [];

    let itemData = [];

    let headerX = 20;
    let footerX = 20;
    let headerY = 80;
    let footerY = 200;

    for ( let i = 0; i < csvData.length; i++ ) {
      for ( let j = 0; j < csvData[i].length; j++ ) {
        let baseItemData = {
          x: j * 32 + headerX,
          y: i * 32 + headerY
        }

        if (scene.DEBUG) {
          let g = scene.add.graphics();
          g.fillStyle=(0xffffff);
          g.fillCircle(1,1,1);
          g.setPosition(baseItemData.x, baseItemData.y);
        }

        let itm = "" + csvData[i][j];
        if (itm == null || itm == "" || itm == "null") {
          // ignore
        } else if (itm.startsWith("H")) {
          itemData.push(Object.assign({}, baseItemData, {
            type: 'HOLE',
          }));
        } else if (itm == "SR") {
          itemData.push(Object.assign({}, baseItemData, {
            type: 'STAR',
          }));

          totalStars += 1

        } else if (itm.startsWith("S")) {
          itemData.push(Object.assign({}, baseItemData, {
            type: 'SHOOTER',
            direction: parseInt(itm[1]),
          }));
        } else if (itm.startsWith("O")) {
          itemData.push(Object.assign({}, baseItemData, {
            type: 'SHOOTER',
            direction: parseInt(itm[1]),
          }));

          ballOrigin = Object.assign({}, baseItemData)

        } else if (itm.startsWith("-")) {
          texts.push({
            text: itm.slice(1),
            x: baseItemData.x - 16,
            y: baseItemData.y
          });

        } else if (!isNaN(parseInt(itm))) {
          itemData.push(Object.assign({}, baseItemData, {
            type: 'WALL',
            direction: parseInt(itm),
          }));
        } else {
          // ignore
        }
      }
    }

    return {
      items: itemData,
      ballOrigin: ballOrigin,
      totalStars: totalStars,
      texts: texts
    };
  }
  constructor(scene, item, player) {
    super(scene, item.x, item.y, item.type.toLowerCase());
    scene.physics.world.enable(this);
    //this.body.setCircle(12, 16 - 12, 16 - 12);
    scene.add.existing(this);

    this.uuid = window.getUuid();
    this.scene = scene;
    this.type = item.type;
    this.direction = item.direction;

    this.updateImage();

    scene.physics.add.overlap(this, player, (p1, p2, evt) => {
      if (scene.DEBUG && !p2.interacting) {
        console.log(p1.type, p2)
      }

      this.processCollision(p2)
    });

    this.setInteractive().on('pointerup', (pointer, lx, ly, evt) => {
      evt.stopPropagation();
      if (!this.scene.running)
        this.rotateDirection();
    });
  }

  processCollision (player) {
    if (player.interacting == this.uuid)
      return;

    switch (this.type) {
      case 'SHOOTER':
        if (this.scene.checkWin())
          return;

        let deltaX = [ null,  6,  6,  0, -6, -6, -6,  0,  6 ][this.direction];
        let deltaY = [ null,  0, -6, -6, -6,  0,  6,  6,  6 ][this.direction];

        player.x = this.x + deltaX * 5
        player.y = this.y + deltaY * 5
        player.setDirection(deltaX, deltaY);

        break;
      case 'WALL':
        let p = new Phaser.Math.Vector2(1,0)
        p.setAngle(this.direction * Math.PI / 180)
        let newVelocity = new Phaser.Math.Vector2(player.body.velocity.mirror(p))

        player.body.setVelocity(0)
        player.x = this.x
        player.y = this.y

        player.setDirection(newVelocity.x, newVelocity.y)
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

    player.interacting = this.uuid;

  }

  rotateDirection () {

    switch (this.type) {
      case 'SHOOTER':
        this.direction += 1;
        if (this.direction > 8)
          this.direction = 1
        break;
      case 'WALL':
        this.direction += 45;
        if (this.direction > 360)
          this.direction -= 360;
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
      case 'WALL':
        if (this.direction) {
          this.angle = this.direction
        }

        break;
    }
  }
}
