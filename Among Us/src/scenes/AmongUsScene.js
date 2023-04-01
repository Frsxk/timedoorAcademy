import Phaser from 'phaser'
export default class AmongUsScene extends Phaser.Scene
{
    constructor()
    {
        super('among-us-scene')
    }
    preload()
    {
        this.load.image('maps', 'images/Maps.png')
        this.load.image('playerRed', 'images/Red.png')
        this.load.image('playerCyan', 'images/Cyan.png')
        this.load.image('playerGreen', 'images/Green.png')
        this.load.image('playerOrange', 'images/Orange.png')
        this.load.image('playerPink', 'images/Pink.png')
    }
    create()
    {
        this.add.image(960, 540, 'maps')
        this.add.image(1000, 400, 'playerRed')
        this.add.image(1750, 500, 'playerGreen')
        this.add.image(330, 290, 'playerPink')
        this.add.image(340, 760,'playerOrange')
        this.add.image(950, 770, 'playerCyan').setScale(0.5)
    }
}