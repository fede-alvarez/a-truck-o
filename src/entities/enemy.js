export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'car');

        scene.anims.create({
            key: 'car', 
            frameRate:3, 
            repeat:-1, 
            frames: scene.anims.generateFrameNumbers('car', { frames: [ 0,1 ] })
        });
        
        this.anims.play('car');
        //scene.physics.world.enable(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(this.body.width, this.body.height*0.8);
        this.body.setOffset(0,3);

        this.body.setMaxVelocity(-100, 20);

        //this.body.setImmovable();

        /*this.body.immovable = true;
        this.body.moves = false;*/
        
        this.health = 50;
    }

    doDamage ()
    {
        this.health -= 10;
        if (this.health <= 0)
            this.isDead();
    }

    isDead ()
    {
        console.log("You're dead!");
    }
}