export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'player');
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scene = scene;
        this.speed = 50;

        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.bullets = scene.physics.add.group({ defaultKey:'bullet', maxSize: 10 });
        
        scene.input.on('pointerdown', this.fireWeapon, this);

        let graphics = new Phaser.GameObjects.Graphics(scene);
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.beginPath();
        graphics.moveTo(10, 10);
        graphics.lineTo(50, 50);
        graphics.closePath();
        graphics.strokePath();

    }

    update ()
    {
        if (this.keyW.isDown)
        {
            this.y -= (this.y - 8) / this.speed;
        }else if (this.keyS.isDown){
            this.y += (this.y + 8) / this.speed;
        }

        if (this.keyA.isDown)
        {
            this.x -= (this.x - 8) / this.speed;
        }else if (this.keyD.isDown){
            this.x += (this.x + 8) / this.speed;
        }

        /** Scaling */
        if (this.y > this.maxScalePoint.y) 
            this.y = this.maxScalePoint.y;
        if (this.y < this.minScalePoint.y)
            this.y = this.minScalePoint.y;

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

        let angle = Phaser.Math.Angle.Between(this.x, this.y, targetX+this.scene.cameras.main.scrollX, targetY+this.scene.cameras.main.scrollY);
        let bullet = this.bullets.get(this.x, this.y);
        if (bullet) 
        {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.rotation=angle;
            this.scene.physics.moveTo(bullet, targetX, targetY, 200);
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