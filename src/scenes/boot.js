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

        /** GUI */
        this.load.image('truck_hp', this.path + 'ui/hp_bar.png');
        this.load.image('progress_bar', this.path + 'ui/progress_bar.png');
        this.load.image('progress_indicator', this.path + 'ui/progress_indicator.png');

        this.load.image('bullet', this.path + 'entities/bullet_72.png');

        this.load.image('ground', this.path + 'entities/ground_02.png');
        this.load.image('rocks',  this.path + 'entities/rocks.png');
        this.load.image('tree',   this.path + 'entities/tree_01.png');
        
        this.load.image('dust', this.path + 'particles/dust.png');

        this.load.spritesheet('car', this.path + 'entities/car_14x13.png', {frameWidth:14, frameHeight:13} );
     
        // Displaying Progress
        const progress = this.add.graphics();

        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.scene.start('Game');
        });
    }
}
