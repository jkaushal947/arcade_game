// Linted with standardJS - https://standardjs.com/

// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game({
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
});

// Declare shared variables at the top so all methods can access them
let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player

function preload () {
  // Load & Define our game assets
  this.load.image('sky', './assets/sky.png')
  this.load.image('ground', './assets/platform.png')
  this.load.image('diamond', './assets/diamond.png')
  //this.load.spritesheet('woof', './assets/woof.png', 32, 32)
}

function create () {
  //  A simple background for our game
  this.add.sprite(0, 0, 'sky')

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup()

  //  We will enable physics for any object that is created in this group
  //platforms.enableBody = true

  // Here we create the ground.
  const ground = platforms.create(0, this.physics.world.height - 64, 'ground')

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.setSize(800, 64)

  //  This stops it from falling away when you jump on it
  //ground.physics.immovable = true

  //  Now let's create two ledges
  let ledge = platforms.create(400, 450, 'ground')

  ledge = platforms.create(-75, 350, 'ground')

  // The player and its settings
  player = this.physics.add.sprite(32, this.physics.world.height - 150, 'woof')

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2
  player.body.gravity.y = 800
  player.body.collideWorldBounds = true

  //  Our two animations, walking left and right.
  this.anims.create({key: 'left', frames: [0, 1], framerate: 10, repeat: true})
  this.anims.create({key: 'right', frames: [2, 3], framerate: 10, repeat: true})

  //  Finally some diamonds to collect
  diamonds = this.physics.add.staticGroup()

  //  Enable physics for any object that is created in this group
  //diamonds.enableBody = true

  //  Create 12 diamonds evenly spaced apart
  for (var i = 0; i < 12; i++) {
    const diamond = diamonds.create(i * 70, 0, 'diamond')

    //  Drop em from the sky and bounce a bit
    diamond.body.gravity.y = 1000
    diamond.body.bounce.y = 0.3 + Math.random() * 0.2
  }

  //  Create the score text
  scoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })

  //  And bootstrap our controls
  cursors = this.input.keyboard.createCursorKeys()
}

function update () {
  //  We want the player to stop when not moving
  player.body.velocity.x = 0

  //  Setup collisions for the player, diamonds, and our platforms
  this.physics.collide(player, platforms)
  this.physics.collide(diamonds, platforms)

  //  Call callectionDiamond() if player overlaps with a diamond
  this.physics.overlap(player, diamonds, collectDiamond, null, this)

  // Configure the controls!
  if (cursors.left.isDown) {
    player.body.velocity.x = -150
    player.anims.play('left')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.anims.play('right')
  } else {
    // If no movement keys are pressed, stop the player
    player.anims.stop()
  }

  //  This allows the player to jump!
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -400
  }
  // Show an alert modal when score reaches 120
  if (score === 120) {
    alert('You win!')
    score = 0
  }
}

function collectDiamond (player, diamond) {
  // Removes the diamond from the screen
  diamond.destroy()

  //  And update the score
  score += 10
  scoreText.text = 'Score: ' + score
}