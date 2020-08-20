import Obstacle from "./obstacle";

export default class Obstacles extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene, [], {maxSize: 15});

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.player = this.scene.player;

        /** Props */
        this.obstaclesNumber = 3;
        this.obstaclesList = ['barrer', 'tires'];

        this.createObstacles();

        this.obstacleSound = scene.sound.add('sfxObstacle', {volume:0.4});
    }

    createObstacles ()
    {
        for (let i = 0; i < this.obstaclesNumber; i++)
        {
            let obstacle = new Obstacle(this.scene, 0, 0, this.obstaclesList[Phaser.Math.Between(0,this.obstaclesList.length-1)]);
            
            obstacle.x = this.canvasSize.w + Phaser.Math.Between(512,1024);
            obstacle.y = Phaser.Math.Between(30,this.canvasSize.h - 20);

            this.add(obstacle);

            obstacle.body.setVelocity(-280, 0);   
        }

        this.scene.physics.add.collider(this, this.player, this.onPlayerImpact, null, this);
        //this.scene.physics.add.collider(this, this.player.bullets, this.onBulletImpact, null, this);
    }

    onPlayerImpact (obstacle, player)
    {
        let self = this;
        
        this.obstacleSound.play();

        this.scene.juice.flash(player.truckTrailer);
        player.body.setVelocityX(-200);
        
        this.scene.juice.shake(this.scene.cameras.main, {
            x:0.5,
            y:0.5,
            onComplete: function(tween, target) {
                self.scene.cameras.main.setPosition(0,0);
            }
        });

        player.doDamage(5);
        obstacle.destroy();
    }

    onBulletImpact (obstacle, bullet)
    {
        bullet.destroy();
        //obstacle.destroy();
    }

    update ()
    {
        this.scalePerspective();
    }

    scalePerspective ()
    {
        /** Scaling */
        this.children.each(function(obstacle) 
        {
            if (obstacle.active) 
            {
                let obstacleScale = this.calculateScale(obstacle.y);
                obstacle.setScale(obstacleScale.x, obstacleScale.y);

                if (obstacle.x < -32) {
                    obstacle.x = this.canvasSize.w + (32 + Phaser.Math.Between(256,512));
                }
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