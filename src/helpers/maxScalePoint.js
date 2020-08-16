export default class MaxScalePoint extends Phaser.GameObjects.Sprite
{
    constructor( scene, x, y, maxScale )
    {
        super(scene, x, y, '');
        scene.add.existing(this);
        this.setOrigin(0.5,0.5);

        this.x = x;
        this.y = y;
        this.maxScale = maxScale;
        this.visible = false;
    }
}
