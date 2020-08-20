import Background from "../entities/background";
import phaserJuice from "../libs/phaserJuice";
import MaxScalePoint from "../helpers/maxScalePoint";
import MinScalePoint from "../helpers/minScalePoint";
import Gui from "../gui/gui";

export default class Menu extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'Menu' });
    }

    create ()
    {
        this.input.mouse.disableContextMenu();
        this.input.setDefaultCursor('url(src/assets/cursor.png), pointer');
        
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.juice = new phaserJuice(this);

        let canvasWidth = this.sys.canvas.width,
            canvasHeight = this.sys.canvas.height;

        /** Scale Points */
        let minScalePos = {x: canvasWidth*0.5, y:40};
        let maxScalePos = {x: minScalePos.x, y:canvasHeight-40};

        this.maxScalePoint = new MaxScalePoint(this,maxScalePos.x, maxScalePos.y, 4);
        this.minScalePoint = new MinScalePoint(this,minScalePos.x, minScalePos.y, 2);

        /** Background */
        this.bg = new Background(this);

        this.gui = new Gui(this, 'menu');

        let self = this;
        this.input.on('pointerdown', function(pointer, localX, localY, event) 
        {
            //self.scene.start('Game');
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game');
        })
    }

    getCanvasSize ()
    {
        return {w:this.sys.canvas.width, h:this.sys.canvas.height};
    }
}
