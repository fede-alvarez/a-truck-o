import HealthBar from "../helpers/healthbar";

export default class Enemy extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        let shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.15);
        shadow.fillEllipse(0, 5, 14, 8);

        this.car = new Phaser.GameObjects.Sprite(scene,0,0,'car');
        this.add(shadow);
        this.add(this.car);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.car.anims.play('car');

        this.name = 'car';

        this.body.setSize(16, 10);
        this.body.setOffset(-8,-2);
        this.body.setMaxVelocity(300,50);  

        this.depth = this.y;
        
        this.health = 50;

        this.hp = new HealthBar(scene, this.x, this.y - 16);
        this.hp.value = this.health;
    }

    doDamage ()
    {
        this.health -= 10;
        this.hp.decrease(10);
        this.hp.draw();

        if (this.health <= 0)
            this.isDead();
    }

    isDead ()
    {
        console.log("You're dead!");
        let explosion = this.scene.enemies.explosion;
        explosion.setPosition(this.x, this.y);
        explosion.explode();

        this.hp.destroy();
        this.destroy();
    }
}