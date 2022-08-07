var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg


function preload(){

  // load the collided timage and tre trex animation 
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  collidedTrex = loadImage("trex_collided.png")

  // load the ground
  groundImage = loadImage("ground2.png");
  
  //load the clouds
  cloudImage = loadImage("cloud.png");
  
  // load all of the different obstacle types
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  // load the end state images
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  // create the canvas to be 600 by 200
  createCanvas(600, 200);
  
  //create the trex sprite
  trex = createSprite(50,180,20,50);
  // add the running animation and the collided animation to switch to when in the end state.
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", collidedTrex )
  // scale the trex down
  trex.scale = 0.5;
  
  // create the ground, add the image and make it infinte.
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  // create the game over sprite.
    gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  // create the restart sprite.
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  // scale the gameover and restart sprites dowbn to fit in the canvas
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  //make an invisible cround for the trex to collide with so that its feet are on the visible ground.
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create groups for the Obstacles and Clouds
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  // set the collider to a circle and make it smlller so that the trex and the obstacles are closer when the end state triggers
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  // make the score 0 at the start of the game
  score = 0;
}

function draw() {

  // make the background grey
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
    console.log("this is ",gameState)

  

  if(gameState === PLAY){
    // make the gameover and restrart sprites invisible when in the play state.
     gameOver.visible = false
    restart.visible = false
    
    //move the ground
    ground.velocityX = -4;
    
    //scoring
    score = score + Math.round(frameCount/60);
    
    // resets the grounds X pos so it becomes an infinite runner
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -13;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    // make the gamestate end when the trex touches any obstacle.
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
   else if (gameState === END) {
      // make the ground stop moving when in the end state.
    ground.velocityX = 0;

      // make the gameover sprite visible.
      gameOver.visible = true;

      // make the restart sprite visible.
      restart.visible = true;

      // make all the obstaxles stop moving when in the end state.
     obstaclesGroup.setVelocityXEach(0);
    
     // make all the clouds stop moving when in the end state.
     cloudsGroup.setVelocityXEach(0);
    
     // set the obstacles a negative lifetime so that it never reaches 0
     obstaclesGroup.setLifetimeEach(-1);
    
    //set the clouds a negative lifetime so that it never reaches 0
     cloudsGroup.setLifetimeEach(-1);

    // change the trex animation to the collided image when in the end state.  
     trex.changeAnimation("collided", collidedTrex)

     //make the trex stop moving when in the end state.
         trex.velocityY = 0
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  // make sure the sprites are seen
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

