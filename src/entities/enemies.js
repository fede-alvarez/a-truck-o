import Enemy from "./enemy";

export default class Enemies extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene, [], { classType: Enemy, maxSize:10 });

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.enemiesNumber = 10;

        this.player = this.scene.player;

        /** Bullets */
        this.bullets = scene.add.group({ defaultKey:'bullet', maxSize: 30 });
        this.fireTime = 0;
        this.fireRate = 50;
        this.canFire = true;
        this.followRange = 80;

        /** Enemies Props */
        this.spawnTime = 900;
        this.spawnTimer = 0;
        this.isSpawning = false;

        this.explosion = scene.add.particles('explosion').createEmitter({
            x: -1000,
            y: -1000,
            scale: { start: 0.5, end: 4 },
            setVelocityX : 100,
            setVelocityY : 100,
            blendMode: 'SCREEN',
            lifespan: 100,
        });

        this.shootSound = scene.sound.add('sfxShoot', {volume:0.15});
        this.playerHitSound = scene.sound.add('sfxCarsHit', {volume:0.4});
        this.carHitSound = scene.sound.add('sfxCarsHit', {volume:0.2});

        this.scene.physics.add.collider(this.player, this, this.onPlayerImpact, null, this);
        this.scene.physics.add.collider(this, this, this.carOnCar, null, this);
        this.scene.physics.add.collider(this, this.player.bullets, this.onBulletImpact, null, this);
        this.scene.physics.add.overlap(this.bullets, this.player, this.onPlayerBullet, null, this);
    }

    update ()
    {
        this.scaleWhileActive();
        this.followPlayer();
        this.updateBullets();

        this.spawnTimer++;

        if (this.spawnTimer != 0 && this.spawnTimer % this.spawnTime == 0)
        {
            this.spawnTimer = 0;
            this.spawnMultiple(Phaser.Math.Between(2,3));
        }
    }

    spawnEnemy ()
    {
        let x = Phaser.Math.Between(32, 128) * -1;
        let y = Phaser.Math.Between(50, this.canvasSize.h - 20);

        let enemy = this.get(x, y);
        
        if (enemy) 
        {
            this.scene.physics.world.enable(enemy);
            enemy.resetAll();
        }
    }

    spawnMultiple ( amount )
    {
        for (let i = 0; i < amount; i++)
        {
            this.spawnEnemy();
        }
    }

    updateBullets ()
    {
        /** Bullets */
        this.bullets.children.each(function(b) 
        {
            if (b.active) 
            {
                let bulletScale = this.calculateScale(b.y);
                b.setScale(bulletScale.x, bulletScale.y);

                let isBetweenBonds = Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, b.getBounds());
                if (!isBetweenBonds)
                    b.setActive(false);
            }
        }.bind(this));
    }

    stopEngines ()
    {
        this.children.each(function(enemy) 
        {
            if (enemy.active) 
            {
                enemy.engineSound.stop();
            }
        }.bind(this));
    }

    onPlayerBullet (bullet, player)
    {
        if (player.isJumping) return;
        console.log("Impact!");
        
        bullet.body.setEnable(false);
        bullet.setActive(false);
        bullet.setVisible(false);

        this.shakeIt();
        player.doDamage(2);
        this.playerHitSound.play();
    }

    carOnCar ()
    {
        this.carHitSound.play();
    }

    onBulletImpact (enemy, bullet)
    {
        this.scene.juice.flash(enemy.car);
        bullet.destroy();
        enemy.doDamage();
        this.carHitSound.play();
    }

    onPlayerImpact (player, bullet)
    {
        this.carHitSound.play();
        //this.scene.juice.flash(player.truckTrailer);   
    }

    fireAtPlayer ( enemy )
    {
        if (!this.canFire) return;

        let bullet = this.bullets.get(enemy.x, enemy.y);
        
        if (bullet) 
        {
            this.shootSound.play();

            this.scene.physics.world.enable(bullet);
            bullet.setActive(true);
            bullet.setVisible(true);
            
            let variation = {x:Phaser.Math.Between(0,16), y:Phaser.Math.Between(0,16)};

            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x + variation.x, this.player.y + variation.y);
            bullet.rotation=angle;

            this.scene.physics.moveTo(bullet, this.player.x + variation.x, this.player.y + variation.y, 200);
        }
    }

    scaleWhileActive ()
    {
        this.children.each(function(enemy) 
        {
            if (enemy.active) 
            {
                /** Scaling */
                let enemyScale = this.calculateScale(enemy.y);
                enemy.setScale(enemyScale.x, enemyScale.y);

                enemy.hp.x = enemy.x - 16;
                enemy.hp.y = enemy.y - 18;
                enemy.hp.setScale(enemyScale.x, enemyScale.y);
                enemy.hp.draw();
                //enemy.update();
                //enemy.hp.visible = false;
            }
        }.bind(this));
    }

    followPlayer ()
    {
        if (this.player.isDead) return;

        this.children.each(function(enemy) 
        {
            if (enemy.active) 
            {
                let playerDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);

                if (playerDistance < this.followRange || enemy.shootOnce)
                {
                    // 20
                    this.scene.physics.moveTo(enemy, this.player.x + 16, this.player.y - 16, 12); 
                    this.fireTime++;

                    if (this.fireTime != 0 && this.fireTime % this.fireRate == 0)
                    {
                        this.fireTime = 0;
                        this.fireAtPlayer(enemy);
                    }
                }

                /** Pass right limit */
                if (enemy.x > this.canvasSize.w + 32) {
                    enemy.x = -32 - Phaser.Math.Between(128, 256);
                    enemy.y = Phaser.Math.Between(50, this.canvasSize.h - 20);
                }

                if (enemy.y > this.canvasSize.h + 32 ) {
                    enemy.deactivateEnemy();
                }
            }
        }.bind(this));
    }

    shakeIt ()
    {
        let self = this;
        this.scene.juice.shake(this.scene.cameras.main, {
            x:0.5,
            y:0.5,
            onComplete: function(tween, target) {
                self.scene.cameras.main.setPosition(0,0);
            }
        });
    }

    calculateScale ( positionY )
    {
        let maxScale = this.maxScalePoint.maxScale;
        let minScale = this.minScalePoint.minScale;

        let xScale = ((maxScale-minScale) / (this.maxScalePoint.y-this.minScalePoint.y)) * (positionY-this.minScalePoint.y);
        let yScale = 0;
        xScale = (xScale>maxScale) ? maxScale : xScale;
        yScale = (xScale < 0.1) ? 0.1 : xScale;
        
        return {x:xScale, y:yScale};
    }
}