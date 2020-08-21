import Ramp from "./ramp";

export default class Ramps extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene, [], {maxSize: 5});

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.player = this.scene.player;

        /** Props */
        this.rampsNumber = 1;

        this.createRamps();
    }

    createRamps ()
    {
        for (let i = 0; i < this.rampsNumber; i++)
        {
            let ramp = new Ramp(this.scene, 0, 0);
            
            ramp.x = this.canvasSize.w + Phaser.Math.Between(512,1024);
            ramp.y = Phaser.Math.Between(60,this.canvasSize.h - 32);

            this.add(ramp);

            ramp.body.setVelocity(-160, 0);   
        }

        this.scene.physics.add.overlap(this, this.player, this.playerOnRamp, null, this);
        this.scene.physics.add.overlap(this, this.scene.enemies, this.enemiesOnRamp, null, this);
    }

    playerOnRamp (ramp, player)
    {
        let self = this;
        player.doJumpAnimation();
    }

    enemiesOnRamp (ramp, enemy)
    {
        let self = this;
        enemy.doJumpAnimation();
    }

    update ()
    {
        this.scalePerspective();
        //this.physics.world.wrap(this, 32);
    }

    scalePerspective ()
    {
        /** Scaling */
        this.children.each(function(ramp) 
        {
            if (ramp.active) 
            {
                let rampScale = this.calculateScale(ramp.y);
                ramp.setScale(rampScale.x, rampScale.y);

                if (ramp.x < -32) {
                    ramp.x = this.canvasSize.w + (32 + Phaser.Math.Between(256,512));
                    ramp.y = Phaser.Math.Between(60,this.canvasSize.h - 32);
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