export default class Dialog extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene);
        

        this.scene = scene;
        this.canvasSize = this.scene.getCanvasSize();
        
        this.bigFont = { fontFamily: 'kenny1bit_3', fontSize:16, color:'#CFC6B8' };
        this.smallFont = { fontFamily: 'kenny1bit_3', fontSize:8, color:'#CFC6B8', lineSpacing:5, wordWrap: { width:250, useAdvanceWrap:true } };

        this.dialogs = [
            { id:'found',  index:0, text:'hey, #74216! they have located you.\nyou need to get here fast!', oneTime: false },
            { id:'found2', index:1, text:'that supplies will last until the next summer... we hope!', oneTime: false },
            { id:'found3', index:2, text:'our fate is in your hands... we trust you!', oneTime: true }
        ];

        if (this.scene.player)
            this.player = this.scene.player;
        
        // new Phaser.GameObjects.Sprite(scene,0,0,'truck_base');
        this.base = this.scene.add.image(0, 0, 'dialogContainer');
        this.base.x = (this.canvasSize.w) - this.canvasSize.w * 0.5;
        this.base.y = (this.canvasSize.h - 4) - this.base.height * 0.5;
        this.base.setOrigin(.5);
        this.base.setScale(1,0);

        this.avatar = this.scene.add.image(0,0, 'dialogAvatar');
        this.avatar.x = (this.base.x - this.base.width * 0.5) + 16;
        this.avatar.y = this.base.y;
        this.avatar.setOrigin(.5);

        this.text = this.scene.add.text(0,0, '', this.smallFont);
        //this.text = this.scene.add.bitmapText(0, 0, '');
        this.text.x = (this.base.x - this.base.width * 0.5) + 32;
        this.text.y = (this.base.y - this.base.height * 0.5) + 8;
        this.text.setScale(0.5);

        this.mouse = this.scene.add.image(0,0, 'mouseClick');
        this.mouse.x = this.base.x + this.base.width * 0.5 - 2;
        this.mouse.y = this.base.y;

        this.avatar.alpha = this.text.alpha = this.mouse.alpha = 0;
        
        this.add(this.base);
        this.add(this.avatar);
        this.add(this.text);
        this.add(this.mouse);

        scene.add.existing(this);

        this.desactivateAll();

        this.currentDialog = null;

        /** Music & Sounds */
        this.uiClickSound = scene.sound.add('sfxUIClick', {volume:0.7});
        this.radioSound = scene.sound.add('sfxRadio', {volume:0.4});
        this.voiceSound = scene.sound.add('sfxVoice', {volume:0.1, delay:2000});

        scene.input.on('pointerdown', this.nextDialog, this);
    }

    show ( dialogId )
    {
        this.radioSound.play();
        let self = this;
        this.radioSound.once('complete', function() 
        {
            self.voiceSound.play();
            self.showDialogId(dialogId);
        });
    }

    showDialogId (dialogId)
    {
        let dialog = this.getDialogById(dialogId);

        if (dialog)
        {
            this.scene.tweens.add({
                targets: [this.avatar, this.text, this.mouse],
                alpha:1,
                duration:400
            });

            this.scene.tweens.add({
                targets: this.base,
                scaleY:1,
                duration:1000,
                ease: 'Bounce'
            });
            this.currentDialog = dialog;
            this.activateAll();
            this.text.setText(dialog.text);
        }
    }

    nextDialog ()
    {
        if (!this.currentDialog) return;

        if (!this.currentDialog.oneTime)
        {
            let dialog = this.getDialogByIndex(this.currentDialog.index + 1);
            if (dialog)
            {
                this.voiceSound.play();

                this.currentDialog = dialog;
                this.activateAll();
                this.text.setText(dialog.text);
            }
        }else{
            let self = this;

            this.currentDialog = null;

            this.scene.tweens.add({
                targets: [this.avatar, this.text, this.mouse],
                alpha:0,
                duration:400
            });

            this.scene.tweens.add({
                targets: this.base,
                scaleY:0,
                duration:1000,
                ease: 'Bounce',
                onComplete : function()
                {
                    self.desactivateAll();
                    self.avatar.alpha = self.text.alpha = self.mouse.alpha = 1;
                }
            });
            
            this.voiceSound.once('complete', function() {
                self.radioSound.play();

                self.scene.introFinalized();
            });
        }
    }

    getDialogById ( dialogId )
    {
        for (let i = 0; i < this.dialogs.length; i++)
        {
            if (dialogId == this.dialogs[i].id)
            {
                return this.dialogs[i];
            }
        }

        return null;
    }

    getDialogByIndex ( dialogIndex )
    {
        for (let i = 0; i < this.dialogs.length; i++)
        {
            if (dialogIndex == this.dialogs[i].index)
            {
                return this.dialogs[i];
            }
        }

        return null;
    }

    desactivateAll ()
    {
        this.visible = false;
    }

    activateAll ()
    {
        this.visible = true;
    }

}