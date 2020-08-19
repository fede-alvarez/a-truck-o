export default class Gui extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.lives = 3;

        this.distance = this.scene.distance;
        this.progressBarPoints = {
            start : {x:0,y:0},
            end   : {x:0,y:0}
        }
        this.progressBarActive = true;

        this.createHPBar();
        this.createCooldownBar();
        this.createProgress();

        /*this.scene.add.text(60, 60, 'text', {
            fontFamily: 'kenny1bit_3',
            fontSize:8,
            color:''
        });*/
    }

    createProgress()
    {
        this.progressBar = this.scene.add.image(this.canvasSize.w * 0.5,10,'progress_bar');
        this.progressBar.setOrigin(0.5);
        this.add(this.progressBar);

        this.progressBarPoints.start.x = this.progressBar.x - this.progressBar.width * 0.5;
        this.progressBarPoints.start.y = this.progressBar.y;
        this.progressBarPoints.end.x = this.progressBar.x + this.progressBar.width * 0.5;
        this.progressBarPoints.end.y = this.progressBar.y;
        console.log(this.progressBarPoints);

        this.progressIndicator = this.scene.add.image(this.progressBar.x - this.progressBar.width * 0.5, this.progressBar.y, 'progress_indicator');
        this.progressIndicator.setOrigin(0.5);
        this.add(this.progressIndicator);
    }

    updateProgress ()
    {
        if (!this.progressBarActive) return;

        //console.log(this.scene.distance);
        let dist = this.scene.distance;
        let goal = this.scene.goalDistance;

        let movePercent = ((dist * 100) / goal);
        
        this.progressIndicator.x = this.progressBarPoints.start.x + movePercent;

        if (dist >= goal)
            this.progressBarActive = false;
    }

    createHPBar ()
    {
        this.hp = this.scene.add.image(0,8,'truck_hp');
        this.hp.setOrigin(0, 0.5);
        this.add(this.hp);

        for (let i = 0; i < this.lives; i++)
        {
            let box = this.scene.add.graphics();
            box.fillStyle(0xCFC6B9, 1);
            box.fillRect(2 + (i * 13), 2, 10, 12);
            this.add(box);
        }
    }

    createCooldownBar ()
    {
        let barBackground = this.scene.add.graphics();
        barBackground.fillStyle(0x131313, 1);
        barBackground.fillRect(1,16,64,10);
        this.add(barBackground);

        this.cooldownBar = this.scene.add.graphics();
        this.cooldownBar.fillStyle(0xFF0000, 1);
        this.cooldownBar.fillRect(2,17,31,8); // 62 Max Size
        this.add(this.cooldownBar);
    }
}