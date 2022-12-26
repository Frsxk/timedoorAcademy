import Phaser from 'phaser'

import CollectingStarsScene from './scenes/CollectingStarsScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [CollectingStarsScene]
}

export default new Phaser.Game(config)
