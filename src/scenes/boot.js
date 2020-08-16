export default class Boot extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'Boot' });

        this.path = 'src/assets/';
    }

    preload()
    {
        // Loading assets
        this.load.image('player', this.path + 'entities/truck_01.png');
        this.load.image('bullet', this.path + 'entities/bullet_72.png');

        this.load.image('ground', this.path + 'entities/ground_01.png');
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
