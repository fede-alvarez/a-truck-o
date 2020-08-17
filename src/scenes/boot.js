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

        /** GUI */
        this.load.image('truck_hp', this.path + 'ui/hp_bar.png');

        this.load.image('bullet', this.path + 'entities/bullet_72.png');

        this.load.image('ground', this.path + 'entities/ground_02.png');
        this.load.image('rocks',  this.path + 'entities/rocks.png');
        this.load.image('tree',   this.path + 'entities/tree_01.png');
        this.load.image('person', this.path + 'entities/person.png');
        
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
