import { Game, AUTO } from 'phaser'
import { RoomScene } from './Scene'

new Game({
  type: AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a1a',
  parent: 'app',
  scene: [RoomScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
})
