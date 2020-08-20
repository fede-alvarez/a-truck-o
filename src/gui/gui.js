export default class Gui extends Phaser.GameObjects.Group
{
    constructor(scene)
    {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();

        this.lives = this.scene.player.lives;

        this.distance = this.scene.distance;
        this.progressBarPoints = {
            start : {x:0,y:0},
            end   : {x:0,y:0}
        }
        this.progressBarActive = true;

        this.createHPBar();
        //this.createCooldownBar();
        this.createProgress();

        this.depth = 200;

        /**
         * Game Over 
         * Texts
         */
        let selfScene = this.scene;
        this.fontSettings = { fontFamily: 'kenny1bit_3', fontSize:8, color:'#CFC6B8' };

        this.goLabel = this.scene.add.text(this.canvasSize.w * 0.5, this.canvasSize.h * 0.5 - 30, 'game over', this.fontSettings);
        this.goLabel.setOrigin(.5);

        this.goMessage = this.scene.add.text(this.canvasSize.w * 0.5, this.canvasSize.h * 0.5 - 10, 'the humans are now doomed!', this.fontSettings);
        this.goMessage.setOrigin(.5);
        
        this.confirm = this.scene.add.text(this.goLabel.x - 70, this.goMessage.y + 30, 'try again!', this.fontSettings);
        this.confirm.setOrigin(.5);

        this.deny = this.scene.add.text(this.goLabel.x + 70, this.goMessage.y + 30, 'go menu', this.fontSettings);
        this.deny.setOrigin(.5);
        
        this.add(this.confirm);
        this.add(this.deny);
        this.add(this.goLabel);
        this.add(this.goMessage);

        this.goLabel.visible = this.goMessage.visible = this.confirm.visible = this.deny.visible = false;
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

        this.progressIndicator = this.scene.add.image(this.progressBar.x - this.progressBar.width * 0.5, this.progressBar.y, 'progress_indicator');
        this.progressIndicator.setOrigin(0.5);
        this.add(this.progressIndicator);
    }

    updateProgress ()
    {
        /** Progress Bar */
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

        this.hpBoxes = [];
        for (let i = 0; i < this.lives; i++)
        {
            let box = this.scene.add.graphics();
            box.fillStyle(0x38D973, 1);
            box.fillRect(2 + (i * 13), 2, 10, 12);
            this.hpBoxes.push(box);
        }
    }

    showHP ( amount ) 
    {
        for (let i = 0; i < 5; i++)
        {
            this.hpBoxes[i].visible = false;
        }

        for (let j = 0; j < amount; j++)
        {
            this.hpBoxes[j].visible = true;
        }
    }

    removeHP ()
    {
        let hp = this.hpBoxes.pop();
        if (hp)
            hp.destroy();
        /*for (let i = 0; i < this.lives; i++)
        {
            let box = this.scene.add.graphics();
            box.fillStyle(0x38D973, 1);
            box.fillRect(2 + (i * 13), 2, 10, 12);
            this.add(box);
            this.hpBoxes.push(box);
        }*/
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

    showGameOver ()
    {
        let self = this;
        this.progressBar.visible = false;
        this.progressIndicator.visible = false;
        this.hp.visible = false;

        this.goLabel.visible = this.goMessage.visible = this.confirm.visible = this.deny.visible = true;

        this.confirm.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            self.scene.scene.restart();
        });

        this.deny.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            console.log("Go Menu");
        });
    }
}