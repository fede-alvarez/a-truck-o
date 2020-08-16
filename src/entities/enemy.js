export default class Enemy extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'car');
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.body.setImmovable();

        /*this.body.immovable = true;
        this.body.moves = false;*/
        
        this.health = 50;
    }
}