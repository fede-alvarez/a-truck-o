import Player from "../entities/player"
import MaxScalePoint from "../helpers/maxScalePoint";
import MinScalePoint from "../helpers/minScalePoint";

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

        let minScalePos = {x: canvasWidth*0.5, y:40};
        let maxScalePos = {x: minScalePos.x, y:canvasHeight-40};

        this.maxScalePoint = new MaxScalePoint(this,maxScalePos.x, maxScalePos.y, 4);
        this.minScalePoint = new MinScalePoint(this,minScalePos.x, minScalePos.y, 2);

        this.player = new Player(this, 50, 50);
    }

    update ()
    {
        this.player.update();
    }
}
