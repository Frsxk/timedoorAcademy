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
        this.load.image(`background`, `images/bg_layer1.png`);
        this.load.image(`gameover`, `images/gameover.png`);
        this.load.image(`replay`, `images/replay.png`);
    }

    create() {
        this.add.image(200, 320, `background`)
        this.add.image(200, 180, `gameover`)
        this.replayButton = this.add.image(200, 470, `replay`).setInteractive()
        this.replayButton.once(`pointerup`, () => {
            this.scene.start(`corona-buster-scene`)
        }, this)
        this.add.text(45, 300, `SCORE: `, { fontSize: `60px`, fill: `#000` })
        // menambahkan nilai score
        this.add.text(265, 300, this.score, { fontSize: `60px`, fill: `#000` })
    }
}