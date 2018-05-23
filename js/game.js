/*global Phaser HealthBar*/
var game = new Phaser.Game(960, 600, Phaser.CANVAS, 'fun-game', { preload: preload, create: create, update: update, render: render });
//8:5 ratio // 960,600

//Vars
var debug = true;

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

////Settings\\\\
var moveSpeed = 1000;
var originalSpeed = moveSpeed;
var turnSpeed = 6;
var ballScale = 0.1;
var padRange = 20;
var boostSpeed = 3;

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
    /////Make BoostMeters\\\\
	boostMeter1 = new HealthBar(game, {width:100, x:100, y:50, animationDuration:1});
	boostMeter2 = new HealthBar(game, {width:100, x:860, y:50, animationDuration:1});
    
    ////Make Pads\\\\
    createPad(50,50);  //Top left
    createPad(50,550); //Bottom left
    createPad(910,50); //Top right
    createPad(910,550);//Bottom right
    createPad(480,50); //Mid top
    createPad(480,550);//Mid bottom

    //Add drift emitters
    game.physics.startSystem(Phaser.Physics.ARCADE);
    drift1 = game.add.emitter(0, 0, 100);
    makeEmitter(drift1);
    drift2 = game.add.emitter(0,0,100);
    makeEmitter(drift2);
    
    game.physics.startSystem(Phaser.Physics.P2JS);    
    
    ///Add Players\\\
    player = game.add.sprite(50,300,'green');
    addPhysics(player);
    player.body.angle = 90;
    player2 = game.add.sprite(910,300,'blue');
    addPhysics(player2);
    player2.body.angle = -90;
    
    //Add ball
    ball = game.add.sprite(480,300,'ball');
    ball.scale.setTo(ballScale)
    game.physics.p2.enable(ball,debug);
    ball.body.setCircle(245*ballScale);
    ball.body.damping = 0;
	
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
    if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER) && boost2 > 0 ){
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