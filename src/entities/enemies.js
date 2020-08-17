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

        this.enemiesNumber = 5;

        this.createEnemies();
    }

    createEnemies ()
    {
        for (let i = 0; i < this.enemiesNumber; i++)
        {
            let enemy = new Enemy(this.scene, 0, 0);

            enemy.x = this.canvasSize.w + 32;
            enemy.y = Phaser.Math.Between(50, this.canvasSize.h);

            this.add(enemy);

            enemy.body.setVelocityX(Phaser.Math.Between(-80, -140));    
        }

        let player = this.scene.player;

        this.scene.physics.add.collider(player, this);
        this.scene.physics.add.collider(this, this);
        this.scene.physics.add.collider(this, player.bullets, this.onBulletImpact, null, this);
    }

    onBulletImpact (enemy, bullet)
    {
        bullet.destroy();
        this.scene.juice.flash(enemy);

        enemy.health -= 10;
        if (enemy.health <= 0)
        {
            enemy.destroy();
            //enemy.visible = false;
        }
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