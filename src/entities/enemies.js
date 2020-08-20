import Enemy from "./enemy";

export default class Enemies extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene);

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.enemiesNumber = 3;

        this.player = this.scene.player;

        /** Bullets */
        this.bullets = scene.physics.add.group({ defaultKey:'bullet', maxSize: 20 });
        this.fireTime = 0;
        this.fireRate = 50;
        this.canFire = true;

        this.createEnemies();
    }

    update ()
    {
        this.scaleWhileActive();
        this.followPlayer();

        /** Bullets */
        this.bullets.children.each(function(b) {
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

    createEnemies ()
    {
        let player = this.scene.player;

        for (let i = 0; i < this.enemiesNumber; i++)
        {
            let enemy = new Enemy(this.scene, 0, 0);
            
            enemy.x = Phaser.Math.Between(32, 128) * -1;
            enemy.y = Phaser.Math.Between(50, this.canvasSize.h - 20);

            this.add(enemy);

            //let randSpeedX = Phaser.Math.Between(20, 40);
            enemy.body.setVelocity(20, 0);   
        }

        this.scene.physics.add.collider(player, this); //, this.onPlayerImpact, null, this); <- Callback
        this.scene.physics.add.collider(this, this);
        this.scene.physics.add.collider(this, player.bullets, this.onBulletImpact, null, this);
        this.scene.physics.add.overlap(this.bullets, player, this.onPlayerBullet, null, this);
    }

    onPlayerBullet (player, bullet)
    {
        bullet.destroy();
        this.shakeIt();
        player.doDamage(10);
    }

    onBulletImpact (enemy, bullet)
    {
        this.scene.juice.flash(enemy.car);
        bullet.destroy();
        enemy.doDamage();
    }

    onPlayerImpact (player, bullet)
    {
        //this.scene.juice.flash(player.truckTrailer);   
    }

    fireAtPlayer ( enemy )
    {
        if (!this.canFire) return;

        let bullet = this.bullets.get(enemy.x, enemy.y);
        
        if (bullet) 
        {
            this.scene.physics.world.enable(bullet);
            bullet.setActive(true);
            bullet.setVisible(true);
            //this.scene.juice.flash(bullet);
            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            bullet.rotation=angle;

            let variation = {x:Phaser.Math.Between(0,16), y:Phaser.Math.Between(0,16)}

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

                if (playerDistance < 70) 
                {
                    this.scene.physics.moveTo(enemy, this.player.x + 16, this.player.y - 16, 20);
                    this.fireTime++;

                    if (this.fireTime != 0 && this.fireTime % this.fireRate == 0)
                    {
                        this.fireTime = 0;
                        this.fireAtPlayer(enemy);
                    }
                }

                if (enemy.x > this.canvasSize.w + 32) {
                    enemy.x = -32 - Phaser.Math.Between(256, 512);
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