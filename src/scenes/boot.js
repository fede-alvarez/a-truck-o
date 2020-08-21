export default class Boot extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'Boot' });

        this.path = 'src/assets/';
    }

    preload()
    {
        /** Truck */
        this.load.image('player', this.path + 'entities/truck_01.png');
        this.load.image('truck_base', this.path + 'entities/truck_base.png');
        this.load.image('truck_trailer', this.path + 'entities/truck_trailer.png');
        this.load.image('truck_wheels', this.path + 'entities/truck_wheels.png');

        this.load.image('truck_turret', this.path + 'entities/truck/turret_base.png');
        this.load.image('truck_canon', this.path + 'entities/truck/turret_canon.png');

        this.load.image('bg', this.path + 'bg/sky.png');
        this.load.image('clouds', this.path + 'bg/clouds.png');
        this.load.image('mountain', this.path + 'bg/mountain.png');

        this.load.image('barrer', this.path + 'obstacles/barreer.png');
        this.load.image('fire', this.path + 'obstacles/fire.png');
        this.load.image('tires', this.path + 'obstacles/tires.png');

        this.load.image('ramp', this.path + 'entities/ramp.png');

        /** GUI */
        this.load.image('truck_hp', this.path + 'ui/hp_bar.png');
        this.load.image('progress_bar', this.path + 'ui/progress_bar.png');
        this.load.image('progress_indicator', this.path + 'ui/progress_indicator.png');

        this.load.image('bullet', this.path + 'entities/bullet_72.png');

        this.load.image('ground', this.path + 'entities/ground_02.png');
        this.load.image('rocks',  this.path + 'entities/rocks.png');
        this.load.image('tree',   this.path + 'entities/tree_01.png');
        this.load.image('tree2',   this.path + 'bg/dead_tree.png');

        this.load.image('dialogContainer', this.path + 'ui/dialog.png');
        this.load.image('dialogAvatar', this.path + 'ui/avatar_woman.png');
        
        this.load.image('dust', this.path + 'particles/dust.png');

        this.load.image('mouseClick', this.path + 'ui/tuto_mouse_click.png');
        this.load.image('mouseStill', this.path + 'ui/tuto_mouse_move.png');

        this.load.image('explosion', this.path + 'particles/explosion.png');
        this.load.spritesheet('car', this.path + 'entities/car_14x13.png', {frameWidth:14, frameHeight:13} );
     
        /** Music & Sounds */
        this.load.audio('mainMusic', this.path + 'music/the_drive.mp3');

        this.load.audio('sfxLevitate', this.path + 'sounds/levitation.mp3');
        this.load.audio('sfxShoot', this.path + 'sounds/shoot.mp3');
        this.load.audio('sfxCarsHit', this.path + 'sounds/collision.mp3');
        this.load.audio('sfxEngine', this.path + 'sounds/engine.wav');
        this.load.audio('sfxEnemyEngine', this.path + 'sounds/enemy_engine.wav');
        this.load.audio('sfxExplosion', this.path + 'sounds/explosion.mp3');
        this.load.audio('sfxGameOver', this.path + 'sounds/game_over.mp3');
        this.load.audio('sfxObstacle', this.path + 'sounds/obstacle.mp3');

        this.load.audio('sfxRadio', this.path + 'sounds/radio-beep.mp3');
        this.load.audio('sfxVoice', this.path + 'sounds/voice.mp3');

        //this.load.bitmapFont('kenny1bit', this.path + 'font/font_export.png', this.path + 'font/font_export.xml');

        // UI
        this.load.audio('sfxUIClick', this.path + 'sounds/click.mp3');
        
        /** Displaying Progress */
        const progress = this.add.graphics();

        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.scene.start('Menu');
        });
    }
}
