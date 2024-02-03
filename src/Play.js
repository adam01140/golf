class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }
    
    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

    // add cup
    this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
    this.cup.body.setCircle(this.cup.width / 4)
    this.cup.body.setOffset(this.cup.width / 4)
    this.cup.body.setImmovable(true)

    // add ball
    this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
    this.ball.body.setCircle(this.ball.width / 2)
    this.ball.body.setCollideWorldBounds(true)
    this.ball.body.setBounce(0.5)
    this.ball.body.setDamping(true).setDrag(0.5)


    this.movingWall = this.physics.add.sprite(width / 2, height / 3, 'wall');
    this.movingWall.body.setImmovable(true);
    this.movingWall.body.setVelocityX(this.SHOT_VELOCITY_X); // Start moving to the right
    this.movingWall.body.setCollideWorldBounds(true); // Make it collide with world bounds
    this.movingWall.body.setBounce(1, 0); // Make it bounce when it hits world bounds (perfectly elastic collision)
    


    // add walls
let wallA = this.physics.add.sprite(0, height / 4, 'wall');
wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2));
wallA.body.setImmovable(true);

let wallB = this.physics.add.sprite(0, height / 2, 'wall');
wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2));
wallB.body.setImmovable(true);

this.walls = this.add.group([wallA, wallB]);

// add one-way
this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway');
this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2));
this.oneWay.body.setImmovable(true);
this.oneWay.body.checkCollision.down = false;




this.input.on('pointerdown', (pointer) => {
    // Calculate the x and y shot direction based on pointer position
    let shotDirectionX = pointer.x - this.ball.x;
    let shotDirectionY = pointer.y <= this.ball.y ? -1 : 1; // Y direction as before

    // Normalize the shot direction for X
    let shotMagnitude = Math.sqrt(shotDirectionX * shotDirectionX);
    shotDirectionX /= shotMagnitude;

    // Use the shot direction for X to set the ball's velocity
    this.ball.body.setVelocityX(shotDirectionX * this.SHOT_VELOCITY_X);
    this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY);
})


// cup/ball collision
this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
    //ball.destroy()
    //alert("hey");
    this.resetBall(); 
})




this.physics.add.collider(this.ball, this.walls);

// ball/one-way collision
this.physics.add.collider(this.ball, this.oneWay);

this.physics.add.collider(this.ball, this.movingWall);

    }



    resetBall() {
        // Set the ball back to its initial position at the bottom
        this.ball.setPosition(width / 2, height - height / 10);
        // Optionally, you might want to reset the velocity of the ball as well
        this.ball.body.setVelocity(0, 0);
    }


    update() {

    }
}
