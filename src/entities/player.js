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

        this.baseTurret = new Phaser.GameObjects.Sprite(scene,0,-12,'truck_turret');
        this.truckCanon = new Phaser.GameObjects.Sprite(scene,0,-16,'truck_canon');

        this.add(shadow);
        this.add(this.base);
        this.add(this.truckTrailer);
        this.add(this.truckWheels);
        this.add(this.baseTurret);
        this.add(this.truckCanon);

        this.initPos = {x:this.truckTrailer.x, y:this.truckTrailer.y};

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
        this.defaultHealth = 100;
        this.health = 100;
        this.lives = 5;
        this.fireSpeed = 300;
        this.isDead = false;
        this.canMove = true;
        this.isJumping = false;

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

        /**  */
        this.explosionEmitter = scene.add.particles('explosion').createEmitter({
            x: -1000,
            y: -1000,
            scale: { start: 0.5, end: 4 },
            setVelocityX : 100,
            setVelocityY : 100,
            blendMode: 'SCREEN',
            lifespan: 100,
        });
        
        scene.input.on('pointermove', this.turretTrack, this);
        scene.input.on('pointerdown', this.fireWeapon, this);

        this.shootSound = scene.sound.add('sfxShoot', {volume:0.5});
        this.uiClickSound = scene.sound.add('sfxUIClick', {volume:0.5});
        this.explosionSound = scene.sound.add('sfxExplosion', {volume:0.8});
        this.gameOverSound = scene.sound.add('sfxGameOver', {delay:300});
        this.playerHitSound = scene.sound.add('sfxCarsHit', {volume:0.4});

        this.engineSound = scene.sound.add('sfxEngine', {volume:0.4, loop:true});
        this.engineSound.play();
    }

    doJumpAnimation ()
    {
        let self = this;
        this.canMove = false;
        this.body.setVelocityY(0);
        this.setActive(false);

        this.isJumping = true;

        this.scene.tweens.add({
            targets: [this.baseTurret, this.truckCanon],
            y:-40,
            duration:500,
            ease: 'Quad',
            repeat: 0,
            yoyo:true
        });

        this.scene.tweens.add({
            targets: [this.base, this.truckTrailer, this.truckWheels],
            y:-30,
            duration:500,
            ease: 'Quad',
            repeat: 0,
            yoyo:true,
            onComplete : function()
            {
                self.playerHitSound.play();

                self.canMove = true;
                self.setActive(true);

                self.base.y = self.truckTrailer.y = self.truckWheels.y = 0;
                self.baseTurret.y = -12;
                self.truckCanon.y = -16;

                this.isJumping = false;
            }
        });
    }

    update ()
    {
        if (this.isDead) return;

        if (this.canMove)
        {
            if (this.keyW.isDown)
            {
                this.body.setVelocityY(-this.vel.y);
            }else if (this.keyS.isDown){
                this.body.setVelocityY(this.vel.y);
            }
    
            if (this.keyA.isDown)
            {
                //this.body.setVelocityX(-this.vel.x * 3);
                this.body.setVelocityX(-this.vel.x);
                this.engineSound.setVolume(0.3);
            }else if (this.keyD.isDown){
                this.body.setVelocityX(this.vel.x);
                this.engineSound.setVolume(0.6);
            }
        }

        /** Scaling */
        let scaleMod = this.calculateScale(this.y);
        this.setScale(scaleMod.x,scaleMod.y);

        /** Particles following */
        this.dustParticles.x = this.x - 80;
        this.dustParticles.y = this.y - 50;

        this.depth = this.y + this.height * 0.5;

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
        if (this.isDead || !this.canMove) return;
        this.shootSound.play();

        let targetX = pointer.x, 
            targetY = pointer.y;

        let bullet = this.bullets.get(this.x+6, this.y-16);
        bullet.depth = 50;
        let self = this;
        
        this.scene.juice.shake(this.scene.cameras.main, {
            x:0.5,
            y:0.5,
            onComplete: function(tween, target) {
                self.scene.cameras.main.setPosition(0,0);
            }
        });
        
        if (bullet) 
        {
            this.scene.physics.world.enable(bullet);
            bullet.setActive(true);
            bullet.setVisible(true);
            //this.scene.juice.flash(bullet);
            
            let dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

            let variation = {x:Phaser.Math.Between(-8,8), y:Phaser.Math.Between(-4,4)};
            if (dist > 70) 
            {
                variation = {x:Phaser.Math.Between(-16,16), y:Phaser.Math.Between(-16,16)};
            }

            let angle = Phaser.Math.Angle.Between(this.x, this.y, targetX+variation.x, targetY+variation.y);
            bullet.rotation=angle;
            
            this.scene.physics.moveTo(bullet, targetX+variation.x, targetY+variation.y, this.fireSpeed);
        }   
    }

    doDamage ( amount )
    {
        if (this.isDead) return;

        this.scene.juice.flash(this.truckTrailer);

        this.health -= amount;

        let newLives = Math.ceil(this.health * 5 / this.defaultHealth);
        this.scene.gui.showHP(newLives);

        if (this.health <= 0)
            this.hasDied();
    }

    hasDied ()
    {
        console.log("Player is Dead!");
        this.engineSound.stop();
        this.explosionSound.play();
        this.gameOverSound.play();

        this.isDead = true;
        this.visible = false;

        this.dustParticles.active = false;
        
        this.explosionEmitter.setPosition(this.x, this.y);
        this.explosionEmitter.explode();

        let music = this.scene.music;
        let self = this;
        this.scene.tweens.add({ 
            targets: music, 
            volume: 0, 
            duration: 700,
            onComplete : function() {
                if (self.scene.music.isPlaying)
                    self.scene.music.stop();
            } 
        }); 
        
        this.scene.gui.showGameOver();
    }

    turretTrack (pointer)
    {
        if (this.isDead) return;
        
        let angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x+this.scene.cameras.main.scrollX, pointer.y+this.scene.cameras.main.scrollY);
        this.truckCanon.rotation=angle;
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