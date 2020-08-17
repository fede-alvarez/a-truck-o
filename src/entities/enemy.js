export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'car');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.enableBody(false);

        this.anims.play('car');

        this.name = 'car';

        this.body.setSize(this.body.width, this.body.height*0.8);
        this.body.setOffset(0,3);
        this.body.setMaxVelocity(-100, 20);        
        
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
        this.destroy();
    }
}