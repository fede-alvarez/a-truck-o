import Player from "../entities/player"
import MaxScalePoint from "../helpers/maxScalePoint";
import MinScalePoint from "../helpers/minScalePoint";
import Background from "../entities/background";
import Enemies from "../entities/enemies";

export default class Game extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'Game' });
    }

    create ()
    {
        this.input.mouse.disableContextMenu();

        let canvasWidth = this.sys.canvas.width,
            canvasHeight = this.sys.canvas.height;

        /** Scale Points */
        let minScalePos = {x: canvasWidth*0.5, y:40};
        let maxScalePos = {x: minScalePos.x, y:canvasHeight-40};

        this.maxScalePoint = new MaxScalePoint(this,maxScalePos.x, maxScalePos.y, 4);
        this.minScalePoint = new MinScalePoint(this,minScalePos.x, minScalePos.y, 2);

        /** Background */
        this.bg = new Background(this);

        /** Player */
        this.player = new Player(this, 50, 50);

        /** Enemies */
        this.enemies = new Enemies(this);
    }

    update ()
    {
        this.player.update();
        this.enemies.update();
    }

    getCanvasSize ()
    {
        return {w:this.sys.canvas.width, h:this.sys.canvas.height};
    }
}
