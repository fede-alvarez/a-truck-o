import Phaser from "phaser";

import Boot from "./scenes/boot"
import Menu from "./scenes/menu"
import Game from "./scenes/game"

const config = {
  type: Phaser.AUTO,
  parent: "truck-game",
  width: 320,
  height: 180,
  zoom: 2,
  pixelArt: true,
  scene: [Boot, Menu, Game],
  physics: {
    default: "arcade",
    arcade: {
        debug: true,
        gravity: { y: 0, x:0 },
        debugShowBody: true
    }
  },
  backgroundColor:'#472D3C',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false
};

const game = new Phaser.Game(config);