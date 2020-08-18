export default class Obstacle extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.name = 'obstacle';

        this.body.setSize(this.body.width, this.body.height*0.8);
        this.body.setOffset(0,3);

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.health = 1;
    }

    doDamage ( amount )
    {
        this.health -= amount;
        if (this.health <= 0)
            this.isDead();
    }

    isDead ()
    {
        console.log("Obstacle dead!");
    }
}