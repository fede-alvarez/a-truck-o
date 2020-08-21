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
        this.canMove = true;

        this.hp = new HealthBar(scene, this.x, this.y - 16);
        this.hp.value = this.health;

        this.explosionSound = scene.sound.add('sfxExplosion', {volume:0.9});
        this.engineSound = scene.sound.add('sfxEnemyEngine', {volume:0.1, loop:true});
        this.engineSound.play();
    }

    doJumpAnimation ()
    {
        let self = this;

        this.canMove = false;
        this.body.setVelocityY(0);
        this.setActive(false);

        this.scene.tweens.add({
            targets: this.car,
            y:-40,
            duration:500,
            ease: 'Quad',
            repeat: 0,
            yoyo:true
        });

        /*
        this.scene.tweens.add({
            targets: [this.base, this.truckTrailer, this.truckWheels],
            y:-30,
            duration:500,
            ease: 'Quad',
            repeat: 0,
            yoyo:true,
            onComplete : function()
            {
                self.canMove = true;
                self.setActive(true);

                self.base.y = self.truckTrailer.y = self.truckWheels.y = 0;
                self.baseTurret.y = -12;
                self.truckCanon.y = -16;
            }
        });*/
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
        this.explosionSound.play();

        let explosion = this.scene.enemies.explosion;
        explosion.setPosition(this.x, this.y);
        explosion.explode();

        this.hp.destroy();
        this.destroy();
    }
}