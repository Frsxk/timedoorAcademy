import Phaser from "phaser";
import MathFighterScene from "./scenes/MathFighterScene";
import GameOverScene from "./scenes/GameOverScene";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [MathFighterScene, GameOverScene],
};

export default new Phaser.Game(config);
