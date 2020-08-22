export default class HealthBar extends Phaser.GameObjects.Container
{
    constructor (scene, x, y, maxHealthValue)
    {
        super(scene);
        
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.magin_num = 26;
        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = this.magin_num / maxHealthValue; //50;

        this.draw();
        this.add(this.bar);

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    clearBar ()
    {
        this.bar.clear();
    }

    updateP ()
    {
        this.p = this.magin_num / this.value;
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 30, 8);

        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, this.magin_num, 6);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xE6482E);
        }
        else
        {
            this.bar.fillStyle(0x3BD973);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 6);
    }
}