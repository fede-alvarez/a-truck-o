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

        this.avatar = this.scene.add.image(0,0, 'dialogAvatar');
        this.avatar.x = (this.base.x - this.base.width * 0.5) + 16;
        this.avatar.y = this.base.y;
        this.avatar.setOrigin(.5);

        this.text = this.scene.add.text(0,0, '', this.smallFont);
        //this.text = this.scene.add.bitmapText(0, 0, 'kenny1bit', 'hola...probando...1 2 3');
        this.text.x = (this.base.x - this.base.width * 0.5) + 32;
        this.text.y = (this.base.y - this.base.height * 0.5) + 8;
        this.text.setScale(0.5);

        this.mouse = this.scene.add.image(0,0, 'mouseStill');
        this.mouse.x = this.base.x + this.base.width * 0.5 - 2;
        this.mouse.y = this.base.y;
        
        this.add(this.base);
        this.add(this.avatar);
        this.add(this.text);
        this.add(this.mouse);

        scene.add.existing(this);

        this.desactivateAll();

        this.currentDialog = null;

        /** Music & Sounds */
        this.uiClickSound = scene.sound.add('sfxUIClick', {volume:0.7});

        scene.input.on('pointerdown', this.nextDialog, this);
    }

    show ( dialogId )
    {
        let dialog = this.getDialogById(dialogId);

        if (dialog)
        {
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
                this.currentDialog = dialog;
                this.activateAll();
                this.text.setText(dialog.text);
            }
        }else{
            this.desactivateAll();
            this.currentDialog = null;
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