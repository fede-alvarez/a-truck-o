import Player from "../entities/player"
import MaxScalePoint from "../helpers/maxScalePoint";
import MinScalePoint from "../helpers/minScalePoint";
import Background from "../entities/background";
import Enemies from "../entities/enemies";
import phaserJuice from "../libs/phaserJuice";
import Gui from "../gui/gui";
import Obstacles from "../entities/obstacles";
import Dialog from "../gui/dialog";

export default class Game extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'Game' });
    }

    create ()
    {
        this.input.mouse.disableContextMenu();
        this.input.setDefaultCursor('url(src/assets/cursor.png), pointer');

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        this.juice = new phaserJuice(this);

        let canvasWidth = this.sys.canvas.width,
            canvasHeight = this.sys.canvas.height;

        this.anims.create({
            key: 'car', 
            frameRate:3, 
            repeat:-1, 
            frames: this.anims.generateFrameNumbers('car', { frames: [ 0,1 ] })
        });

        /** Music & Sounds */
        this.music = this.sound.add('mainMusic', {volume:0.8, loop:true});

        if (this.music.isPlaying)
            this.music.stop();

        this.music.play();

        /** Scale Points */
        let minScalePos = {x: canvasWidth*0.5, y:40};
        let maxScalePos = {x: minScalePos.x, y:canvasHeight-40};

        this.maxScalePoint = new MaxScalePoint(this,maxScalePos.x, maxScalePos.y, 4);
        this.minScalePoint = new MinScalePoint(this,minScalePos.x, minScalePos.y, 2);

        /** Background */
        this.bg = new Background(this);

        /** Player */
        this.player = new Player(this, 50, 80);

        /** Enemies */
        this.enemies = new Enemies(this);

        this.physics.add.collider(this.player, this.bg.limitsGroup);
        this.physics.add.collider(this.player, this.bg.playerLimits);
        this.physics.add.collider(this.enemies, this.bg.limitsGroup);

        /** Game Progression */
        this.goalDistance = 150;
        this.distance = 0;
        this.distanceTimer = 0;
        this.distanceAddTime = 120;

        this.winState = false;

        /** Intro */
        this.isIntro = true;

        if (this.isIntro)
        {
            this.player.canMove = false;
            this.dialog = new Dialog(this, 10, 10);
            this.dialog.show('found');
        }else{
            this.obstacles = new Obstacles(this);
        }
        
        this.gui = new Gui(this);
    }

    update ()
    {
        this.player.update();
        this.enemies.update();
        
        if (!this.isIntro)
            this.obstacles.update();

        if (this.winState) return;

        this.distanceTimer++;

        if (this.distanceTimer != 0 && this.distanceTimer % this.distanceAddTime == 0)
        {
            this.distanceTimer = 0;
            this.distance += 1;

            if (this.distance >= this.goalDistance)
            {
                this.distance = 0;
                this.winState = true;
                console.log("You Win!");
            }
        }
        
        this.gui.updateProgress();
    }

    getCanvasSize ()
    {
        return {w:this.sys.canvas.width, h:this.sys.canvas.height};
    }
}
