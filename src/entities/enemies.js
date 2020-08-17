import Enemy from "./enemy";

export default class Enemies extends Phaser.GameObjects.Group //Phaser.Physics.Arcade.Group
{
    constructor(scene)
    {
        super(scene);

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.enemiesNumber = 5;

        this.createEnemies();
    }

    createEnemies ()
    {
        let player = this.scene.player;
        let enemy;

        for (let i = 0; i < this.enemiesNumber; i++)
        {
            enemy = new Enemy(this.scene, 0, 0);
            
            enemy.x = Phaser.Math.Between(32, 128) * -1;
            enemy.y = Phaser.Math.Between(50, this.canvasSize.h);

            this.add(enemy);

            let randSpeedX = Phaser.Math.Between(60, 80);
            //this.scene.physics.moveTo(enemy, player.x, player.y,randSpeedX);
            enemy.body.setVelocity(randSpeedX, 0);   
        }

        this.scene.physics.add.collider(player, this, this.onPlayerImpact, null, this);
        this.scene.physics.add.collider(this, this);
        this.scene.physics.add.collider(this, player.bullets, this.onBulletImpact, null, this);
    }

    onPlayerImpact (player, bullet)
    {
        let self = this;
        
        this.scene.juice.flash(player.truckTrailer);
        
        this.scene.juice.shake(this.scene.cameras.main, {
            x:0.5,
            y:0.5,
            onComplete: function(tween, target) {
                self.scene.cameras.main.setPosition(0,0);
            }
        });

        player.doDamage(5);
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
        //this.scene.physics.world.wrap(this, 32);
    }

    scaleWhileActive ()
    {
        this.children.each(function(enemy) 
        {
            if (enemy.active) 
            {
                if (enemy.x > this.canvasSize.w + 32) {
                    enemy.x = -32;
                }

                if (enemy.y > this.canvasSize.h )
                    enemy.body.setVelocityY(0);
                else if (enemy.y < 90) {
                    enemy.body.setVelocityY(0);
                }

                /** Scaling */
                let enemyScale = this.calculateScale(enemy.y);
                enemy.setScale(enemyScale.x, enemyScale.y);
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