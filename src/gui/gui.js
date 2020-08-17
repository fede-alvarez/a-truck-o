export default class Gui extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();
    }

    create ()
    {
        this.hp = this.base = new Phaser.GameObjects.Sprite(this.scene,0,0,'truck_hp');
        this.hp.x = 50;
        this.hp.y = 50;
        this.add(this.hp);
    }
}