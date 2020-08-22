import HealthBar from "../helpers/healthbar";

export default class Enemy extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.scene = scene;

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
        
        this.health = Phaser.Math.Between(50,80);//50;
        //this.fireRate = Phaser.Math.Between(40,50);
        this.canMove = true;
        this.isJumping = false;

        this.hp = new HealthBar(scene, this.x, this.y - 16, this.health);
        this.hp.value = this.health;
        this.hp.visible = false;

        this.shootOnce = false;

        this.showHPCounter = 0;
        this.showHPTime = 100;
        
        this.jumpSound = scene.sound.add('sfxCarsHit', {volume:0.2});
        this.explosionSound = scene.sound.add('sfxExplosion', {volume:0.9});
        this.engineSound = scene.sound.add('sfxEnemyEngine', {volume:0.1, loop:true});
        //this.engineSound.play();
    }

    doJumpAnimation ()
    {
        let self = this;

        this.canMove = false;
        this.body.setVelocityY(0);
        this.setActive(false);

        this.isJumping = true;

        this.scene.tweens.add({
            targets: this.car,
            y:-40,
            duration:500,
            ease: 'Quad',
            repeat: 0,
            yoyo:true,
            onComplete: function() {
                self.jumpSound.play();
                self.car.y = 0;
                self.canMove = false;
                self.setActive(true);
                self.isJumping = false;
            }
        });
    }

    update ()
    {
        if (!this.hp.visible) return;

        this.showHPCounter++;

        if (this.showHPCounter != 0 && this.showHPCounter % this.showHPTime == 0)
        {
            this.showHPCounter = 0;
            this.hp.visible = false;
            this.hp.clearBar();
        }
    }

    doDamage ()
    {
        if (!this.shootOnce)
            this.shootOnce = true;
        
        this.health -= 8;
        this.hp.decrease(8);
        this.hp.draw();
        //this.hp.visible = true;

        if (this.health <= 0)
            this.isDead();
    }

    isDead ()
    {
        //console.log("You're dead!");
        this.explosionSound.play();
        this.engineSound.stop();

        this.shootOnce = false;

        let explosion = this.scene.enemies.explosion;
        explosion.setPosition(this.x, this.y);
        explosion.explode();

        this.body.setEnable(false);
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        this.hp.clearBar();
        this.setActive(false);
        this.setVisible(false);

        this.x = -1000;
        this.y = -1000;
    }

    deactivateEnemy ()
    {
        this.body.setEnable(false);
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        this.hp.clearBar();
        this.setActive(false);
        this.setVisible(false);

        this.x = -1000;
        this.y = -1000;
    }

    resetAll ()
    {
        this.engineSound.play();
        this.health = Phaser.Math.Between(50,80);
        this.hp.value = this.health;
        this.hp.updateP();

        this.body.setEnable(true);
        this.setActive(true);
        this.setVisible(true);

        this.body.setVelocity(20, 0); 
    }
}