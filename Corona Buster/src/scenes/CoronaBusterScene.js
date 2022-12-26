import Phaser from "phaser";
import FallingObject from "../ui/FallingObject.js";
import Laser from "../ui/Laser.js";
import ScoreLabel from "../ui/ScoreLabel.js";
import LifeLabel from "../ui/LifeLabel.js";

export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster-scene");
  }

  init() {
    this.clouds = undefined;
    this.nav_left = false;
    this.nav_right = false;
    this.nav_up = false;
    this.nav_down = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 100;
    this.cursor = this.input.keyboard.createCursorKeys();
    this.enemies = undefined;
    this.enemySpeed = 60;
    this.lasers = undefined;
    this.lastFired = 0;
    this.key = this.input.keyboard.addKeys('W, A, S, D');
    this.scoreLabel = undefined;
    this.lifeLabel = undefined;
    this.handsanitizer = undefined;
    this.backsound = undefined;
  }

  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("cloud", "images/cloud.png");
    this.load.image("left-btn", "images/left-btn.png");
    this.load.image("right-btn", "images/right-btn.png");
    this.load.image("shoot-btn", "images/shoot-btn.png");
    this.load.spritesheet("player", "images/ship.png", 
    { frameWidth:66, frameHeight:66 });
    this.load.image("enemy", "images/enemy.png");
    this.load.spritesheet("laser", "images/laser-bolts.png",
    { frameWidth: 16, frameHeight: 16, startFrame: 16, endFrame: 16 });
    this.load.image("handsanitizer", "images/handsanitizer.png");
    this.load.audio("laserSound", "sfx/sfx_laser.ogg");
    this.load.audio("destroySound", "sfx/destroy.mp3");
    this.load.audio("handsanitizerSound", "sfx/handsanitizer.mp3");
    this.load.audio("backsound", "sfx/SkyFire.ogg");
    this.load.audio("gameOverSound", "sfx/gameover.wav");
  }

  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");

    this.backsound = this.sound.add("backsound")
    this.backsound.play(soundConfig)
    var soundConfig = {
      loop: true
    }

    this.clouds = this.physics.add.group({
      key: "cloud",
      //ulangi tampilkan awan
      repeat: 20,
    });

    Phaser.Actions.RandomRectangle(
      this.clouds.getChildren(),
      this.physics.world.bounds
    );

    this.createButton();

    this.player = this.createPlayer()

    this.enemies = this.physics.add.group({
      classType: FallingObject,
      // banyaknya enemy dalam satu kali grup
      maxSize: 10,
      runChildUpdate: true
    })

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 3000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    })

    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true
    })

    this.physics.add.overlap(
      this.lasers, this.enemies, this.hitEnemy, undefined, this
    );

    this.scoreLabel = this.createScoreLabel(16, 16, 0)
    this.lifeLabel = this.createLifeLabel(16, 40, 3)

    this.physics.add.overlap(this.player, this.enemies, this.decreaseLife, null, this)

    this.handsanitizer = this.physics.add.group({
      classType: FallingObject,
      runChildUpdate: true
    })

    this.time.addEvent({
      delay: 10000,
      callback: this.spawnHandsanitizer,
      callbackScope: this,
      loop: true
    })

    this.physics.add.overlap(this.player, this.handsanitizer, this.increaseLife, null, this)
  }

  update(time) {
    this.clouds.children.iterate((child) => {
      //arah gerak awan ke bawah
      child.setVelocityY(20);
      if (child.y > this.scale.height) {
        child.x = Phaser.Math.Between(10, 400);
        child.y = child.displayHeight * -1;
      }
    });

    this.moveplayer(this.player, time)
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 350, "player")
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
    })

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10
    })
    
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10
    })
    
    return player
  }

  createButton() {
    this.input.addPointer(3);

    let shoot = this.add
      .image(320, 500, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    let nav_left = this.add
      .image(59, 495, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.8);

    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 69, nav_left.y, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.8);

    let nav_down = this.add
      .image(126, 570, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.8)
      .setAngle(-90);

    let nav_up = this.add
      .image(nav_down.x, nav_down.y - 145, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.8)
      .setAngle(-90);

    nav_left.on(
      "pointerdown",
      () => {
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        this.nav_right = false;
      },
      this
    );
    nav_up.on(
      "pointerdown",
      () => {
        this.nav_up = true;
      },
      this
    );
    nav_up.on(
      "pointerout",
      () => {
        this.nav_up = false;
      },
      this
    );
    nav_down.on(
      "pointerdown",
      () => {
        this.nav_down = true;
      },
      this
    );
    nav_down.on(
      "pointerout",
      () => {
        this.nav_down = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        this.shoot = false;
      },
      this
    );
  }

  moveplayer(player, time) {
    this.input.keyboard.addKeys('W, S, A, D');
    if (this.nav_left || this.cursor.left.isDown || this.key.A.isDown) {
      this.player.setVelocityX(this.speed * -1)
      this.player.anims.play("left", true)
      this.player.setFlipX(false)
    } else if (this.nav_right || this.cursor.right.isDown || this.key.D.isDown) {
      this.player.setVelocityX(this.speed)
      this.player.anims.play("right", true)
      this.player.setFlipX(true)
    } else if (this.cursor.up.isDown || this.nav_up || this.key.W.isDown) {
      this.player.setVelocityY(this.speed *-1)
      this.player.anims.play("turn", true)
      this.player.setFlipY(false)
    } else if (this.cursor.down.isDown || this.nav_down || this.key.S.isDown) {
      this.player.setVelocityY(this.speed)
      this.player.anims.play("turn", true)
      this.player.setFlipY(false)
    } else {
      this.player.setVelocityY(0)
      this.player.setVelocityX(0)
      this.player.anims.play("turn", true)
    }

    if ((this.shoot || this.cursor.space.isDown) && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser")
      if (laser) {
        laser.fire(this.player.x, this.player.y)
        this.lastFired = time + 150
        this.sound.play("laserSound")
      }
    }
  }

  spawnEnemy() {
    const config = {
      speed: this.enemySpeed,
      rotation: 0.06
    }

    const enemy = this.enemies.get(0, 0, 'enemy', config)

    const enemyWidth = enemy.displayWidth

    const positionX = Phaser.Math.Between(enemyWidth, this.scale.width - enemyWidth)

    if (enemy) {
      enemy.spawn(positionX)
    }
  }

  spawnHandsanitizer() {
    const config = {
      speed: 60,
      rotation: 0
    }

    const handsanitizer = this.handsanitizer.get(0, 0, 'handsanitizer', config)
    const handsanitizerWidth = handsanitizer.displayWidth
    const positionX = Phaser.Math.Between(handsanitizerWidth, this.scale.width - handsanitizerWidth)
    if (handsanitizer) {
      handsanitizer.spawn(positionX)
    }
  }

  hitEnemy(laser, enemy) {
    laser.erase() // destroy laser yang bersentuhan
    enemy.die() // destroy enemy yang bersentuhan
    this.sound.play("destroySound")

    this.scoreLabel.add(10)
    if (this.scoreLabel.getScore() % 100 == 0) {
      this.enemySpeed += 30
    }
  }

  createScoreLabel(x, y, score) {
    const sytle = { fontsize: `32px`, fill: `#000` }
    const label = new ScoreLabel(this, x, y, score, sytle).setDepth(1)

    this.add.existing(label)

    return label
  }

  createLifeLabel(x, y, life) {
    const sytle = { fontsize: `32px`, fill: `#000` }
    const label = new LifeLabel(this, x, y, life, sytle).setDepth(1)

    this.add.existing(label)

    return label
  }

  decreaseLife(player, enemy) {
    enemy.die()
    this.lifeLabel.subtract(1)

    if (this.lifeLabel.getLife() == 2) {
      player.setTint(0xff0000)
    } else if (this.lifeLabel.getLife() == 1) {
      player.setTint(0xff0000).setAlpha(0.2)
    } else if (this.lifeLabel.getLife() == 0) {
      this.scene.start(`game-over-scene`, { score: this.scoreLabel.getScore() })
      this.sound.stopAll()
      this.sound.play("gameOverSound")
    }
  }

  increaseLife(player, handsanitizer) {
    handsanitizer.die()
    this.lifeLabel.add(1)
    this.sound.play("handsanitizerSound")

    if (this.lifeLabel.getLife() >= 3) {
      player.clearTint().setAlpha(2)
    } else if (this.lifeLabel.getLife() >= 2) {
      player.setTint(0xff0000).setAlpha(1)
    }
  }
}
