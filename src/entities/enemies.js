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

            this.scene.tweens.add({
                targets: enemy,
                x: -64,
                duration: Phaser.Math.Between(3000, 6000),
                delay: Phaser.Math.Between(2000, 6000),
                ease: 'Sine.easeInOut',
                repeat: -1,
            });            
        }

        this.scene.physics.add.collider(this.scene.player, this);
    }

    update ()
    {
        this.scaleWhileActive();
    }

    scaleWhileActive ()
    {
        this.children.each(function(enemy) 
        {
            if (enemy.active) 
            {
                let enemyScale = this.calculateScale(enemy.y);
                enemy.setScale(enemyScale.x, enemyScale.y);

                let isBetweenBonds = Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, enemy.getBounds());
                if (!isBetweenBonds)
                    enemy.setActive(false);
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