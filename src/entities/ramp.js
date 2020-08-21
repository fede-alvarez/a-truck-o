export default class Ramp extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.x = x;
        this.y = y;

        let shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.15);
        shadow.fillEllipse(0, 5, 14, 8);

        this.base = new Phaser.GameObjects.Sprite(scene,0,0,'ramp');
        this.add(shadow);
        this.add(this.base);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.name = 'ramp';

        this.body.setSize(32, 16);
        this.body.setOffset(-16,0);

        this.depth = y;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();
    }
}