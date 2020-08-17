import Enemy from "./enemy";

export default class Enemies extends Phaser.Physics.Arcade.Group
{
    constructor(scene)
    {
        super(scene);

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.enemiesNumber = 2;

        this.createEnemies();
    }

    createEnemies ()
    {
        let enemy;

        for (let i = 0; i < this.enemiesNumber; i++)
        {
            enemy = new Enemy(this.scene, 0, 0);
            
            enemy.x = this.canvasSize.w + 32;
            enemy.y = Phaser.Math.Between(50, this.canvasSize.h);

            this.add(enemy);

            //enemy.body.setVelocityX(Phaser.Math.Between(-80, -140)); 
            let randSpeedX = Phaser.Math.Between(-80, -100);
            enemy.body.setVelocity(randSpeedX, 0);   
        }

        let player = this.scene.player;

        this.scene.physics.add.collider(player, this, this.onPlayerImpact, null, this);
        this.scene.physics.add.collider(this, this);
        this.scene.physics.add.collider(this, player.bullets, this.onBulletImpact, null, this);
    }

    onPlayerImpact (player, bullet)
    {
        this.scene.juice.flash(player.truckTrailer);
        let self = this;
        this.scene.juice.shake(this.scene.cameras.main, {
            x:0.5,
            y:0.5,
            onComplete: function(tween, target) {
                self.scene.cameras.main.setPosition(0,0);
            }
        });
    }

    onBulletImpact (enemy, bullet)
    {
        bullet.destroy();
        enemy.doDamage();
        this.scene.juice.flash(enemy);
    }

    update ()
    {
        this.scaleWhileActive();
        this.scene.physics.world.wrap(this, 32);
    }

    scaleWhileActive ()
    {
        this.children.each(function(enemy) 
        {
            if (enemy.active) 
            {
                let enemyScale = this.calculateScale(enemy.y);
                enemy.setScale(enemyScale.x, enemyScale.y);

                /** Scaling */
                if (this.y > this.maxScalePoint.y) 
                    this.y = this.maxScalePoint.y;
                if (this.y < this.minScalePoint.y)
                    this.y = this.minScalePoint.y;

                /*let isBetweenBonds = Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, enemy.getBounds());
                if (!isBetweenBonds)
                    enemy.setActive(false);*/
            }
        }.bind(this));
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