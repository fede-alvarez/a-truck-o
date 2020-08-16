export default class MinScalePoint extends Phaser.GameObjects.Sprite
{
    constructor( scene, x, y, minScale )
    {
        super(scene, x, y, '');
        scene.add.existing(this);
        this.setOrigin(0.5,0.5);

        this.x = x;
        this.y = y;
        this.minScale = minScale;
        this.visible = false;
    }
}
