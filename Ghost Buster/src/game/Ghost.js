import Phaser from 'phaser'

export default class Ghost extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, config) 
    {
        super(scene, x, y, texture)
        this.scene = scene
        this.speed = config.speed
        this.rotationVal = config.rotation
    }

    spawn(x)
    {
        this.setPosition(x, Phaser.Math.Between(-50, -70))
        this.setVisible(true)
        this.setActive(true)
    }

    die()
    {
        this.destroy()

    }

    update(time)
    {
        this.setVelocityY(this.speed)
        this.rotation += this.rotationVal
        const gameHeight = this.scene.scale.height

        if (this.y > gameHeight + 5) {
            this.die()
        }
    }
}