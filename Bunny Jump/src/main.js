import Phaser from 'phaser'

import BunnyJumpScene from './scenes/BunnyJumpScene'
import GameOverScene from './scenes/GameOverScene'

const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [BunnyJumpScene, GameOverScene]
}

export default new Phaser.Game(config)
