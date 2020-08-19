import Player from "../entities/player"
import MaxScalePoint from "../helpers/maxScalePoint";
import MinScalePoint from "../helpers/minScalePoint";
import Background from "../entities/background";
import Enemies from "../entities/enemies";
import phaserJuice from "../libs/phaserJuice";
import Gui from "../gui/gui";
import Obstacles from "../entities/obstacles";

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

        this.juice = new phaserJuice(this);

        let canvasWidth = this.sys.canvas.width,
            canvasHeight = this.sys.canvas.height;

        this.anims.create({
            key: 'car', 
            frameRate:3, 
            repeat:-1, 
            frames: this.anims.generateFrameNumbers('car', { frames: [ 0,1 ] })
        });

        /** Scale Points */
        let minScalePos = {x: canvasWidth*0.5, y:40};
        let maxScalePos = {x: minScalePos.x, y:canvasHeight-40};

        this.maxScalePoint = new MaxScalePoint(this,maxScalePos.x, maxScalePos.y, 4);
        this.minScalePoint = new MinScalePoint(this,minScalePos.x, minScalePos.y, 2);

        /** Background */
        this.bg = new Background(this);

        /** Player */
        this.player = new Player(this, 50, 60);

        /** Enemies */
        this.enemies = new Enemies(this);

        this.physics.add.collider(this.player, this.bg.limitsGroup);
        this.physics.add.collider(this.player, this.bg.playerLimits);
        this.physics.add.collider(this.enemies, this.bg.limitsGroup);

        this.obstacles = new Obstacles(this);

        /** Game Progression */
        this.goalDistance = 300;
        this.distance = 0;
        this.distanceTimer = 0;
        this.distanceAddTime = 120;

        this.winState = false;

        this.gui = new Gui(this);
    }

    update ()
    {
        this.player.update();
        this.enemies.update();
        this.obstacles.update();
        this.gui.updateProgress();

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
    }

    getCanvasSize ()
    {
        return {w:this.sys.canvas.width, h:this.sys.canvas.height};
    }
}
