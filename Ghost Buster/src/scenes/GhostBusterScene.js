import Phaser from "phaser";
import Bomb from "../game/Bomb";
import Ghost from "../game/Ghost";
import ScoreLabel from "../game/ScoreLabel";
import GameOverSCene from "./GameOverScene";

export default class GhostBusterScene extends Phaser.Scene {
  constructor() {
    super("ghost-buster-scene");
  }

  init() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.player = undefined;
    this.ground = undefined;
    this.ghost = undefined;
    this.ghosts = undefined;
    this.bomb = undefined;
    this.lastFired = 0;
    this.scoreLabel = undefined;
  }

  preload() {
    this.load.image("background", "images/background.png")
    this.load.image("bomb", "images/bomb.png")
    this.load.image("ghost", "images/ghost.png")
    this.load.image("ground", "images/ground.png")
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 32, frameHeight: 32
    })
  }

  create() {
    this.add.image(256, 250, "background")
    this.ground = this.physics.add.staticGroup()
    this.ground.create(256, 485, "ground")

    this.player = this.physics.add.sprite(256, 460, "player")
    this.player.setCollideWorldBounds(true)
    this.player.setBounce(0.2)

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1
    })

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 6,
      //repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 6,
      //repeat: -1
    })

    this.physics.add.collider(this.player, this.ground)

    this.ghosts = this.physics.add.group({
      classType: Ghost,
      runChildUpdate: true
    })
    
    this.time.addEvent({
      delay: Phaser.Math.Between(850, 1750),
      callback: this.spawnGhost,
      callbackScope: this,
      loop: true
    })

    this.bomb = this.physics.add.group({
      classType: Bomb,
      maxSize: 10,
      runChildUpdate: true
    })

    this.physics.add.overlap(
      this.bomb, this.ghosts, this.hitGhost, undefined, this
    )

    this.physics.add.overlap(
      this.player, this.ghosts, this.gameOver, null, this
    )

    this.scoreLabel = this.createScoreLabel(16, 16, 0)
  }

  update(time) {
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-100)
      this.player.anims.play('left', true)
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(100)
      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      this.player.setVelocityY(0)
      this.player.anims.play('idle', true)
    }

    if (this.cursor.space.isDown && time > this.lastFired) {
      const bomb = this.bomb.get(0, 0, "bomb")
      if (bomb) {
        bomb.fire(this.player.x, this.player.y)
        this.lastFired = time + 500
      }
    }
  }

  spawnGhost() {
    const config = {
      speed: "3",
      rotation: 0
    }
    const ghost = this.ghosts.get(0, 0, 'ghost', config)
    const ghostWidth = ghost.displayWidth
    const positionX = Phaser.Math.Between(ghostWidth, this.scale.width - ghostWidth)
    if (ghost) {
      ghost.spawn(positionX)
    }
  }

  hitGhost(bomb, ghost) {
    bomb.erase()
    ghost.die()
    this.scoreLabel.add(1)
  }

  createScoreLabel(x, y, score) {
    const style = { fontsize: `30px`, fill: `#ffb8bf` }
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1)
    this.add.existing(label)
    return label
  }

  gameOver() {
    this.scene.start('game-over-scene', { score: this.scoreLabel.getScore()})
  }
}
