export default class Background extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene);

        this.maxScalePoint = scene.maxScalePoint;
        this.minScalePoint = scene.minScalePoint;

        this.player = null;

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        let bgSky = this.scene.add.image(0,0,'bg');
        bgSky.setOrigin(0);
        this.add(bgSky);

        let bgClouds = this.scene.add.image(this.canvasSize.w + 20,-10,'clouds');
        bgClouds.setOrigin(0);
        this.add(bgClouds);
        
        let bgMountain = this.scene.add.image(this.canvasSize.w,0,'mountain');
        bgMountain.setOrigin(0);
        this.add(bgMountain);

        this.cloudsTween = this.scene.tweens.add({
            targets: bgClouds,
            x: bgSky.x - 640,
            duration:10000,
            ease: 'Linear',
            repeat: -1,
        });

        this.mountainsTween = this.scene.tweens.add({
            targets: bgMountain,
            x: -320,
            duration:20000,
            ease: 'Linear',
            repeat: -1,
        });
        
        this.createTrees();
        this.createSpeedLines();
        this.createGroundTiles();
        this.createRocks();

        this.createLevelLimits();
    }

    createTrees ()
    {
        /** Trees */
        for (let i = 0; i < 10; i++)
        {
            let randomTree = (i%2 == 0) ? 'tree2' : 'tree';
            let tree = this.scene.add.image(i*200, 32, randomTree);
            
            let scalePos = this.calculateScale(tree.y);
            tree.setScale(scalePos.x,scalePos.y);
            this.add(tree);
            tree.depth=99;

            this.scene.tweens.add({
                targets: tree,
                x: tree.x - 200,
                duration:1000,
                ease: 'Linear',
                repeat: -1,
            });
        }
    }

    createGroundTiles ()
    {
        /** Ground Tiles */
        for (let i = 0; i < 10; i++)
        {
            let groundTile = this.scene.add.image(this.canvasSize.w + 32, 0, 'ground');
            groundTile.alpha=0.7;
            let yPos = Phaser.Math.Between(40,this.canvasSize.h - 10);
            let scalePos = this.calculateScale(yPos);
            groundTile.setScale(scalePos.x,scalePos.y);
            this.add(groundTile);

            groundTile.y = yPos;

            this.scene.tweens.add({
                targets: groundTile,
                x: -32,
                alpha:0,
                delay:Phaser.Math.Between(500,2000),
                duration:2000,
                ease: 'Linear',
                repeat: -1,
            });
        }
    }

    createRocks ()
    {
        /** Ground Rocks */
        for (let i = 0; i < 5; i++)
        {
            let groundTile = this.scene.add.image(this.canvasSize.w + 32, 0, 'rocks');
            let yPos = Phaser.Math.Between(50,this.canvasSize.h - 10);
            let scalePos = this.calculateScale(yPos);
            groundTile.setScale(scalePos.x,scalePos.y);
            this.add(groundTile);

            groundTile.y = yPos;

            this.scene.tweens.add({
                targets: groundTile,
                x: -32,
                delay:Phaser.Math.Between(500,2000),
                duration:2000,
                ease: 'Linear',
                repeat: -1,
            });
        }
    }

    createSpeedLines ()
    {
        for (let i=0; i<10; i++)
        {
            let lineGraph = this.scene.add.graphics();
            lineGraph.fillStyle(0xCFC6B9, Phaser.Math.Between(0.1,1));
            lineGraph.fillRect(0, 18*i, Phaser.Math.Between(50, 100), 1);
            lineGraph.x = this.canvasSize.w + 100;
            lineGraph.y = 10;
            
            this.add(lineGraph);

            this.scene.tweens.add({
                targets: lineGraph,
                x: -150,
                duration:2000,
                delay: Phaser.Math.Between(600, 6000),
                ease: 'Sine.easeInOut',
                repeat: -1,
            });
        }
    }

    createLevelLimits ()
    {
        this.limitsGroup = this.scene.add.group();
        this.playerLimits = this.scene.add.group();

        let topLimit = new Phaser.GameObjects.Sprite(this.scene,0,30,'');
        let bottomLimit = new Phaser.GameObjects.Sprite(this.scene,0,this.canvasSize.h - 5,'');
        let leftLimit = new Phaser.GameObjects.Sprite(this.scene, -50,0, '');
        let rightLimit = new Phaser.GameObjects.Sprite(this.scene, this.canvasSize.w - 5,0, '');

        topLimit.visible = bottomLimit.visible = leftLimit.visible = rightLimit.visible = false;

        this.scene.physics.world.enable(topLimit);
        this.scene.physics.world.enable(bottomLimit);
        this.scene.physics.world.enable(leftLimit);
        this.scene.physics.world.enable(rightLimit);

        leftLimit.body.setSize(20,360);
        rightLimit.body.setSize(20,360);
        topLimit.body.setSize(640,30);
        bottomLimit.body.setSize(640,30);
        topLimit.body.setImmovable();
        bottomLimit.body.setImmovable();
        leftLimit.body.setImmovable();
        rightLimit.body.setImmovable();

        this.limitsGroup.add(topLimit);
        this.limitsGroup.add(bottomLimit);

        this.playerLimits.add(leftLimit);
        this.playerLimits.add(rightLimit);

        this.scene.add.existing(this.limitsGroup);
        this.scene.add.existing(this.playerLimits);
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