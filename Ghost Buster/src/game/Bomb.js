import Phaser from 'phaser'

export default class Bomb extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        this.setScale(0.7)
        this.speed = 200

    }

    fire(x,y)
    {
        this.setPosition(x, y-50)
        this.setActive(true)
        this.setVisible(true)
    }

    erase()
    {
        this.destroy()
    }

    update(time) 
    {
        this.setVelocityY(this.speed * -1)
        if(this.y < -10) {
           this.erase()
        }
    }

}