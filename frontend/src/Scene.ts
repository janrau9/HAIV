import { Scene, GameObjects, Input } from 'phaser'
import type { Types } from 'phaser'


export class RoomScene extends Scene {
  tileSize = 32
  player!: GameObjects.Rectangle
  cursors!: Types.Input.Keyboard.CursorKeys
  goal!: { x: number; y: number }
  level: number = 1
  rows: number = 0
  cols: number = 0



  constructor() {
    super('RoomScene')
  }

  create() {
    this.add.text(400, 100, 'MUrder', { fontSize: '40px', color: '#ffffff' }).setDepth(1)
    // Add a button using text
    this.cursors = this.input.keyboard!.createCursorKeys()
    // Add player
    this.player = this.add.rectangle(0, 0, this.tileSize * 0.9, this.tileSize * 0.9, 0xff66aa)
    this.player.setOrigin(0)
    this.placePlayerAt(0, 0) // Start at entrance (1,1)

  }

  placePlayerAt(x: number, y: number) {
    this.player.setPosition(x * this.tileSize, y * this.tileSize)
    this.player.setData('tileX', x)
    this.player.setData('tileY', y)
  }

  update() {
    if (!this.input.keyboard) return
    const x = this.player.getData('tileX')
    const y = this.player.getData('tileY')

    let newX = x
    let newY = y

    if (Input.Keyboard.JustDown(this.cursors.left!)) newX--
    else if (Input.Keyboard.JustDown(this.cursors.right!)) newX++
    else if (Input.Keyboard.JustDown(this.cursors.up!)) newY--
    else if (Input.Keyboard.JustDown(this.cursors.down!)) newY++

  }
}
