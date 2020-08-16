export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'player');
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scene = scene;
        this.speed = 50;
        this.fireSpeed = 300;

        this.vel={x:20, y:15};

        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.bullets = scene.physics.add.group({ defaultKey:'bullet', maxSize: 15 });

        this.dustParticles = scene.add.particles('dust');
        let self = this;
        let emitter = this.dustParticles.createEmitter({
            scale : {start:1, end:0},
            speed: {
                onEmit: function (particle, key, t, value)
                {
                    return self.body.speed;
                }
            },
            lifespan: {
                
                onEmit: function (particle, key, t, value)
                {
                    return Phaser.Math.Percent(self.body.speed, 0, 300) * 20000;
                }
            },
            alpha: {
                onEmit: function (particle, key, t, value)
                {
                    return Phaser.Math.Percent(self.body.speed, 0, 300) * 1000;
                }
            },
            blendMode: 'ADD',
            frequency: 110,
            maxParticles: 10,
            x:this.x,
            y:this.y
        });

        emitter.startFollow(this);
        
        scene.input.on('pointerdown', this.fireWeapon, this);
    }

    update ()
    {
        if (this.y > this.maxScalePoint.y) 
            this.body.setVelocityY(0);
        if (this.y < this.minScalePoint.y)
            this.body.setVelocityY(0);
            
        if (this.keyW.isDown)
        {
            //this.y -= (this.y - 8) / this.speed;
            this.body.setVelocityY(-this.vel.y);
        }else if (this.keyS.isDown){
            //this.y += (this.y + 8) / this.speed;
            this.body.setVelocityY(this.vel.y);
        }

        if (this.keyA.isDown)
        {
            this.body.setVelocityX(-this.vel.x);
        }else if (this.keyD.isDown){
            this.body.setVelocityX(this.vel.x);
        }

        /** Scaling */
        

        let scaleMod = this.calculateScale(this.y);
        this.setScale(scaleMod.x,scaleMod.y);

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

    fireWeapon ( pointer )
    {
        let targetX = pointer.x, 
            targetY = pointer.y;

        let bullet = this.bullets.get(this.x, this.y);
        if (bullet) 
        {
            let angle = Phaser.Math.Angle.Between(this.x, this.y, targetX+this.scene.cameras.main.scrollX, targetY+this.scene.cameras.main.scrollY);

            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.rotation=angle;
            this.scene.physics.moveTo(bullet, targetX, targetY, this.fireSpeed);
        }
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