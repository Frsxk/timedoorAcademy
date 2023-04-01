import Phaser from 'phaser'

import AmongUsScene from './scenes/AmongUsScene'

const config = {
	type: Phaser.AUTO,
	width: 1920,
	height: 1080,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [AmongUsScene]
}

export default new Phaser.Game(config)
