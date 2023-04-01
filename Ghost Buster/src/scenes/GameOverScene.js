import Phaser from "phaser";
var replayButton;

export default class GameOverSCene extends Phaser.Scene {
    constructor() {
        super(`game-over-scene`)
    }

    init(data) {
        this.score = data.score
    }

    preload() {
        this.load.image(`background`, `images/background.png`);
        this.load.image(`gameover`, `images/gameover.png`);
        this.load.image(`replay`, `images/replay.png`);
    }

    create() {
        this.add.image(256, 250, `background`)
        this.add.image(256, 150, `gameover`).setScale(0.8)
        this.replayButton = this.add.image(256, 350, `replay`).setScale(0.8).setInteractive()
        this.replayButton.once(`pointerup`, () => {
            this.scene.start(`ghost-buster-scene`)
        }, this)

        this.add.text(160, 240, `SCORE: `, { fontSize: `40px`, fill: `#ffb8bf` })
        this.add.text(315, 240, this.score, { fontSize: `40px`, fill: `#ffb8bf` })
    }
}