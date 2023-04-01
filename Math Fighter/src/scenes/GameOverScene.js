import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super('game-over-scene')
    }

    init(data) {
        this.replayButton = undefined
        this.score = data.score
    }

    preload() {
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('game-over-text', 'images/gameover.png')
        this.load.image('replay-button', 'images/replay.png')
        this.load.image("fight-bg", "images/fight-bg.png")
        this.load.image("tile", "images/tile.png")
    }

    create() {
        this.add.image(240, 320, 'background')
        this.add.image(240, 130, 'game-over-text').setDepth(5)
        let fightbg = this.add.image(240, 160, "fight-bg")
        this.add.image(240, fightbg.height - 40, "tile")
        this.replayButton = this.add.image(240, 450, 'replay-button').setInteractive().setDepth(4)
        this.replayButton.once('pointerup', () => {
            this.scene.start('math-fighter-scene')
        }, this)

        this.add.text(150, 235, `SCORE: `, { fontSize: `40px`, color: `#282c34` }).setDepth(3)
        this.add.text(305, 235, this.score, { fontSize: `40px`, color: `#282c34` }).setDepth(3)
    }
}