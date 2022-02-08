/*global Phaser HealthBar*/
var game = new Phaser.Game(1010, 650, Phaser.CANVAS, 'fun-game', { preload: preload, create: create, update: update, render: render });
//8:5 ratio // 960 +50,600 + 50

//Vars
var debug = false;

var player;
var player2;
var drift1;
var drift2;
var boost1 = 100;
var boost2 = 100;
var boostMeter1;
var boostMeter2;
var ball;
var pads = [];
var goal1;
var goal2;
var scoreText1;
var scoreText2;
var score1 = 0;
var score2 = 0;
var wall;

////Settings\\\\
var moveSpeed = 1000;
var originalSpeed = moveSpeed;
var turnSpeed = 6;
var ballScale = 0.1;
var padRange = 20;
var boostSpeed = 2;

function preload(){
    game.stage.backgroundColor = "#FFFFFF";
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    game.load.image('red','assets/red.png');
    game.load.image('green','assets/green.png');
    game.load.image('blue','assets/blue.png');
    game.load.image('gray','assets/gray.png');
    game.load.image('black','assets/black.png');
    game.load.image('ball','assets/ball.png');
}
function create(){
    
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.startSystem(Phaser.Physics.ARCADE);//Arcade is only for the emitters which i am to lazy to make myself
    
    
    //Goals
	goal1 = game.add.sprite(5,350,'black');
	goal1.name = 'goal1';
	goal1.scale.setTo(1,15);
	game.physics.p2.enable(goal1,debug);
	goal1.body.static = true;
	
	goal2 = game.add.sprite(1005,350,'black');
	goal2.name = 'goal2';
	goal2.scale.setTo(1,15);
	game.physics.p2.enable(goal2,debug);
	goal2.body.static = true;
	
    //Make Wall  (x,y,width,height)
    makeWall(360,25,480,5);//Top
    //Left
    makeWall(12.5,137.5,2.5,27.5);
    makeWall(12.5,537.5,2.5,22.5);
    //Right
    makeWall(997.5,137.5,2.5,27.5);
    makeWall(997.5,537.5,2.5,22.5);
	
	////Add Text\\\\
	scoreText1 = game.add.text(130,10,'Player1: '+ score1);
	scoreText2 = game.add.text(750,10,'Player2: '+ score2);
	
    /////Make BoostMeters\\\\
	boostMeter1 = new HealthBar(game, {width:100, height:50, x:75, y:25, animationDuration:1, bar:{color:'#29B463'},bg:{color:'#ABB2BA'}});
	boostMeter2 = new HealthBar(game, {width:100, height:50, x:935, y:25, animationDuration:1, bar:{color:'#1E618C'}, bg:{color:'#ABB2BA'}, flipped:true});

    ////Make Pads\\\\
    createPad(75,100);  //Top left
    createPad(75,600); //Bottom left
    createPad(935,100); //Top right
    createPad(935,600);//Bottom right
    createPad(505,100); //Mid top
    createPad(505,600);//Mid bottom
    
    //Add drift emitters
    drift1 = game.add.emitter(0, 0, 100);
    makeEmitter(drift1);
    drift2 = game.add.emitter(0,0,100);
    makeEmitter(drift2);
    
    ///Add Players\\\
    player = game.add.sprite(75,350,'green');
    player.name = 'player1';
    addPhysics(player);
    player.body.angle = 90;
    player2 = game.add.sprite(935,350,'blue');
    player2.name = 'player2';
    addPhysics(player2);
    player2.body.angle = -90;
    
    
    //Add ball
    ball = game.add.sprite(505,350,'ball');
    ball.name = 'ball';
    ball.scale.setTo(ballScale)
    game.physics.p2.enable(ball,debug);
    ball.body.setCircle(245*ballScale);
    // ball.body.damping = 0;
    // ball.body.restitution = 0.9;

    /////Add collisons\\\\\
    ball.body.onBeginContact.add(hitGoal, this);
    
    ////Make Materials\\\\
    // var ballMat = game.physics.p2.createMaterial('ballMat',ball.body);
    // var carMat = game.physics.p2.createMaterial('carMat',[player.body,player2.body]);
    // var worldMat = game.physics.p2.createMaterial('worldMat');
    // game.physics.p2.setWorldMaterial(worldMat, true, true, true, true);
    // var ballWorldContactMat = game.physics.p2.createContactMaterial(ballMat,worldMat);
    // var carContactMat = game.physics.p2.createContactMaterial(ballMat,carMat);
    // carContactMat.restitution = 1.0;
}
function update(){
    
    ////////REMEMBER TO CHANGE BOTH PLAYERS\\\\\\\\
    
    //Player 1
    player.body.angularVelocity = 0;
    if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) && boost1 > 0){
        moveSpeed = originalSpeed * boostSpeed;
        drift1.x = player.x;
        drift1.y = player.y;
        drift1.on = true;
        
        boost1 -= 1;
        boostMeter1.setPercent(boost1);
    }else{
        moveSpeed = originalSpeed;
        drift1.on = false;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
    	player.body.angularVelocity = -turnSpeed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
    	player.body.angularVelocity = turnSpeed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
    	player.body.thrust(moveSpeed);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
    	player.body.thrust(-moveSpeed);
    }
    
    //Player 2
    player2.body.angularVelocity = 0;
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACE) && boost2 > 0 ){
        moveSpeed = originalSpeed * boostSpeed;
        drift2.x = player2.x;
        drift2.y = player2.y;
        drift2.on = true;
        
        boost2 -= 1;
        boostMeter2.setPercent(boost2);
    }else{
        moveSpeed = originalSpeed;
        drift2.on = false;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
    	player2.body.angularVelocity = -turnSpeed;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
    	player2.body.angularVelocity = turnSpeed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
    	player2.body.thrust(moveSpeed);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
    	player2.body.thrust(-moveSpeed);
    }
    
    /////Check Pads\\\\\
    for(var i=0;i<pads.length;i++){
        if(pads[i].x > player.x-padRange && pads[i].x < player.x+padRange && pads[i].y > player.y-padRange && pads[i].y < player.y+padRange){
            // alert(player.x);
            boost1 = 100;
            boostMeter1.setPercent(boost1);
        }
        if(pads[i].x > player2.x-padRange && pads[i].x < player2.x+padRange && pads[i].y > player2.y-padRange && pads[i].y < player2.y+padRange){
            // alert(player.x);
            boost2 = 100;
            boostMeter2.setPercent(boost2);
        }
    }
}
function render(){

}
//Other functions
function addPhysics(sprite){
    sprite.scale.setTo(2, 3.5);
    
    //Physics
    game.physics.p2.enable([sprite],debug);
    sprite.body.damping = 0.99;
    sprite.body.DYNAMIC = 0;
}
function makeEmitter(emit){
    emit.makeParticles('red');
    emit.gravity = 0;
    emit.start(false, 200, 1, 0);
    emit.on = false;
}
function createPad(x,y){
    var pad = game.add.sprite(x,y,'black');
	pad.anchor.setTo(0.5);
	pad.scale.setTo(2);
	pads.push(pad);
}
function makeWall(x,y,width,height){
    wall = game.add.sprite(x,y,'gray');
	wall.scale.setTo(width,height);
	game.physics.p2.enable(wall,debug);
	wall.body.static = true;
	return wall;
}
function hitGoal(bodyA, bodyB, shapeA, shapeB, equation){
    if(bodyA){
        if(bodyA.sprite.name === goal1.name){
            score2++;
            scoreText2.setText('Player2: '+score2);
        }
        if(bodyA.sprite.name === goal2.name){
            score1++;
            scoreText1.setText('Player1: '+score1);
        }
    }
}
