export default class Gui extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.lives = 3;

        this.createHPBar();
        this.createCooldownBar();
    }

    createHPBar ()
    {
        this.hp = this.scene.add.image(0,8,'truck_hp');
        this.hp.setOrigin(0, 0.5);
        this.add(this.hp);

        for (let i = 0; i < this.lives; i++)
        {
            let box = this.scene.add.graphics();
            box.fillStyle(0xCFC6B9, 1);
            box.fillRect(2 + (i * 13), 2, 10, 12);
            this.add(box);
        }
    }

    createCooldownBar ()
    {
        let barBackground = this.scene.add.graphics();
        barBackground.fillStyle(0x131313, 1);
        barBackground.fillRect(1,16,64,10);
        this.add(barBackground);

        this.cooldownBar = this.scene.add.graphics();
        this.cooldownBar.fillStyle(0xFF0000, 1);
        this.cooldownBar.fillRect(2,17,31,8); // 62 Max Size
        this.add(this.cooldownBar);
    }
}