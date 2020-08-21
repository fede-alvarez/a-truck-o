export default class Obstacle extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y);

        let shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.15);
        shadow.fillEllipse(0, 5, 14, 8);

        this.base = new Phaser.GameObjects.Sprite(scene,0,0,key);
        this.add(shadow);
        this.add(this.base);

        this.sign = new Phaser.GameObjects.Sprite(scene,0,-16,'warningSign');
        this.sign.alpha = 0.5;
        this.add(this.sign);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.name = 'obstacle';

        this.body.setSize(16, 8);
        this.body.setOffset(-8,0);

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.health = 1;
    }

    kill ()
    {
        let explosion = this.scene.enemies.explosion;
        explosion.setPosition(this.x, this.y);
        explosion.explode();

        this.destroy();
    }
}