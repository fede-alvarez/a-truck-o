import Background from "../entities/background";
import phaserJuice from "../libs/phaserJuice";
import MaxScalePoint from "../helpers/maxScalePoint";
import MinScalePoint from "../helpers/minScalePoint";
import Gui from "../gui/gui";
import Player from "../entities/player";

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

        /** Player */
        this.player = new Player(this, 34, 90);
        this.player.engineSound.setVolume(0.1);

        this.gui = new Gui(this, 'menu');

        this.levitationSound = this.sound.add('sfxLevitate', {volume:0.1, loop:true});
        this.levitationSound.play();

        this.uiClickSound = this.sound.add('sfxUIClick', {volume:0.5});
        

        let self = this;
        this.input.on('pointerdown', function(pointer, localX, localY, event) 
        {
            let music = this.scene.music;
            
            self.tweens.add({ 
                targets: music, 
                volume: 0, 
                duration: 700,
                onComplete : function() {
                    if (self.music.isPlaying)
                        self.music.stop();
                } 
            }); 

            self.uiClickSound.play();
            self.levitationSound.stop();
            //self.scene.start('Game');
            self.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game');
        })

        /** Music & Sounds */
        this.music = this.sound.add('mainMusic', {volume:0.1, loop:true});

        if (this.music.isPlaying)
            this.music.stop();

        this.music.play();
    }

    getCanvasSize ()
    {
        return {w:this.sys.canvas.width, h:this.sys.canvas.height};
    }
}
