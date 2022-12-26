import Phaser from "phaser";
var platforms
var player
var cursors
var stars
var score = 0
var scoreText
var bombs
var gameOver
export default class CollectingStarsScene extends
Phaser.Scene
{
    constructor()
    {
        super('collecting-stars-scene')
    }
    preload()
    {
        this.load.image('ground', 'images/platform.png')
        this.load.image('sky', 'images/sky.png')
        this.load.image('star', 'images/star.png')
        this.load.image('bomb', 'images/bomb.png')
        this.load.spritesheet('dude', 'images/dude.png', {
            frameWidth: 32, frameHeight: 48
        })
    }
    create()
    {
        this.add.image(400, 300, 'sky')
        platforms = this.physics.add.staticGroup()
        platforms.create(600, 400, 'ground')
        platforms.create(50, 250, 'ground')
        platforms.create(750, 220, 'ground')
        platforms.create(400, 568, 'ground').setScale(2).refreshBody()
        player = this.physics.add.sprite(100, 450, 'dude')
        player.setCollideWorldBounds(true)
        player.setBounce(0.2)
        //Animasi berjalan ke kiri
        this.anims.create({
            key: 'left', //nama animasi
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), //frame yang digunakan
            frameRate: 10,
            repeat: -1
        });
        //Animasi menghadap ke depan
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ], //satu frame saja
            frameRate: 20
        });
        //Animasi berjalan ke kanan
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.add.collider(player, platforms)
        cursors = this.input.keyboard.createCursorKeys()
        stars = this.physics.add.group({
            key: 'star', //game object name (from preload)
            repeat: 11, //mengulangi 11 kali
            // posisi bintang pertama, dan jarak dengan bintang selanjutnya
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        //loop semua bintang
        stars.children.iterate(function (child) {
            //memberikan efek memantul dengan nilai antara 0.4 - 0.8
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(stars, platforms)
        this.physics.add.overlap(
            player, // membuat overlap antara player
            stars, // dan stars
            this.collectStar, //memanggil method collectStar
            null, // proses callback yang tidak dibutuhkan
            this // memastikan overlap pada scene ini
        )
        scoreText = this.add.text(16, 16, 'Score : 0', {
            // @ts-ignore
            fontSize: '32px', fill: 'yellow'
        })
        // algoritma no 1
        bombs = this.physics.add.group()
        // algoritma no 5
        this.physics.add.collider(bombs, platforms)
        // algoritma no 6 saja
        this.physics.add.collider(
            player,
            bombs,
            this.hitBomb, // buat method baru
            null,
            this
        );
    }
    // method collectStar dengan parameter player dan star
    collectStar(player, star)
    {
        // menghilangkan fisik star/bintang
        star.disableBody(true, true)
        score += 10 // 1 bintang bernilai 10
        // menampilkan text dengan nilai score terbaru
        scoreText.setText('Score : ' + score)
        // algoritma no 2, posisi x diambil acak
        var x = (player.x < 400) ?
                Phaser.Math.Between(400, 800) :
                Phaser.Math.Between(0, 400)
        // algoritma no 2
        var bomb = bombs.create(x, 0, 'bomb')
        bomb.setBounce(1) // algoritma no 3, memantul
        // algoritma no 3, ketika menyentuh tepi game
        bomb.setCollideWorldBounds(true)
        // algoritma no 4
        bomb.setVelocity(
            Phaser.Math.Between(-200, 200), 20
        )
        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function(child){
            child.enableBody(
                true, //-> berisi true/false (reset)
                child.x, //-> posisi x
                0, //-> posisi y
                true, // berisi true/false (enableGameObject)
                true //-> berisi true/false (showGameObject)
            )}
            )

        }
    }
    hitBomb(player, bomb)
    {
        this.physics.pause() // algoritma no 6a
        player.setTint(0xff0000) // algoritma no 6b
        player.anims.play('turn') // algoritma no 6c
        gameOver = true // algoritma no 6d
    }
    update()
    {
        // jika keyboard left arrow ditekan
        if (cursors.left.isDown) {
            // kecepatan ke samping (berjalan)
            player.setVelocityX(-160)

            player.anims.play('left', true)
        } else if (cursors.right.isDown) { //kanan
            player.setVelocityX(160)

            // memanggil animasi 'turn'
            player.anims.play('right', true)
        } else {
            player.setVelocityX(0) //berhenti
            // memanggil animasi 'turn'
            player.anims.play('turn')
        }

        if (cursors.up.isDown) { //atas
            // kecepatan ke atas (lompat)
            player.setVelocityY(-230)
        } else if (cursors.down.isDown) { //bawah
            // kecepatan ke bawah
            player.setVelocityY(230)
        }
    }
}