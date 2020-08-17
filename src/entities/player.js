export default class Player extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        let shadow = scene.add.graphics();
        shadow.fillStyle(0x000000, 0.1);
        shadow.fillRect(-30, 7, 60, 10);
        
        this.base = new Phaser.GameObjects.Sprite(scene,0,0,'truck_base');
        this.truckTrailer = new Phaser.GameObjects.Sprite(scene,0,0,'truck_trailer');
        this.truckWheels = new Phaser.GameObjects.Sprite(scene,0,0,'truck_wheels');
        this.add(shadow);
        this.add(this.base);
        this.add(this.truckTrailer);
        this.add(this.truckWheels);

        scene.tweens.add({
            targets: this.truckWheels,
            y:-1,
            duration:100,
            ease: 'Linear',
            repeat: -1,
            yoyo:true
        });
        scene.tweens.add({
            targets: this.truckTrailer,
            y:-1,
            duration:100,
            ease: 'Linear',
            repeat: -1,
            yoyo:true
        });

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scene = scene;
        this.speed = 50;
        this.fireSpeed = 300;

        this.body.setSize(this.body.width, this.body.height*0.3);
        this.body.setOffset(-30,-4);

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
        this.dustEmitter = this.dustParticles.createEmitter({
            accelerationX: -300,
            scale : {start:0.4, end:0},
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
            frequency: 110,
            x:this.x,
            y:this.y
        });

        /*this.dustEmitter.startFollow(this.body);*/
        
        scene.input.on('pointerdown', this.fireWeapon, this);
    }

    update ()
    {
        if (this.y > this.maxScalePoint.y) 
            this.body.stop();
        if (this.y < this.minScalePoint.y)
            this.body.stop();

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

        /** Particles following */
        this.dustParticles.x = this.x - 80;
        this.dustParticles.y = this.y - 50;

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
            this.scene.physics.world.enable(bullet);

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