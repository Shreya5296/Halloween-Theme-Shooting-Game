var PLAY = 1;
var END  = 0;

var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var witch, witchImg;
var dracula, draculaImg;
var bullet,bulletImg;
var restart, restartImg;
var heart1, heart1Img, heart2,heart2Img, heart3,heart3Img;

var zombieGroup, witchGroup, draculaGroup, bulletGroup;
var score = 0;
var life = 3;
var bullets = 50;

var gameState = "PLAY";
var bgSound,loseSound, winSound, shootSound, gameLose;


function preload(){
  bgImg = loadImage("assets/bg.jpg");

  zombieImg = loadImage("assets/zombie.png");
  witchImg = loadImage("assets/witch.png");
  draculaImg = loadImage("assets/dracula.png");
  bulletImg = loadImage("assets/bullet.png");

  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

  loseSound = loadSound("assets/lose.mp3");
  winSound = loadSound("assets/win.mp3");
  shootSound = loadSound("assets/shoot.mp3");
  bgSound = loadSound("assets/halloween_horror.mp3");
  gameLose = loadSound("assets/gameLose.mp3");
}

function setup() {

  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(width/2,height/2,20,20)
  bg.addImage(bgImg);
  bg.scale = 1.5;
  
  //creating the player sprite
  player = createSprite(100, height/2, 50, 50);
  player.addImage(shooterImg);
  player.scale = 0.3;
  player.setCollider("rectangle",0,0,300,300);
  player.debug = false;
  
  //creating sprites to depict lives remaining
  heart1 = createSprite(width-240,40,20,20);
  heart1.visible = false;
  heart1.addImage("heart1",heart1Img);
  heart1.scale = 0.4;

  heart2 = createSprite(width-200,40,20,20);
  heart2.visible = false;
  heart2.addImage("heart2",heart2Img);
  heart2.scale = 0.4;

  heart3 = createSprite(width-150,40,20,20);
  heart3.addImage("heart3",heart3Img);
  heart2.visible = false;
  heart3.scale = 0.4;
  
  //creating groups for zombies and bullets
  bulletGroup = new Group();
  zombieGroup = new Group();
  witchGroup = new Group();
  draculaGroup = new Group();
}

function draw() {
  background(0); 
  if(gameState === "PLAY"){

    if(!bgSound.isPlaying()){
      bgSound.play();
      //bgSound.setVolume(0.5);
    }

    //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30;
    }
    if(keyDown("DOWN_ARROW")||touches.length>0){
      player.y = player.y+30;
    }

    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      bullet = createSprite(displayWidth-1150,player.y-30,20,10);
      bullet.velocityX = 20;
      bullet.addImage(bulletImg);
      bullet.scale=0.1;
      bulletGroup.add(bullet);
      player.depth = bullet.depth;
      player.depth = player.depth+2;
      player.addImage(shooter_shooting);
      bullets = bullets-1;
      shootSound.play();
    }
    
    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg);
    }
    
    //displaying the appropriate image according to lives reamining
    if(life===3){
      heart3.visible = true;
      heart1.visible = false;
      heart2.visible = false;
    }
    else if(life===2){
      heart2.visible = true;
      heart1.visible = false;
      heart3.visible = false;
    }
    else if(life===1){
      heart1.visible = true;
      heart3.visible = false;
      heart2.visible = false;
    }
    else{
      heart1.visible = false;
      heart2.visible = false;
      heart3.visible = false;
    }

    //destroy the zombie when bullet touches it and increase score
    if(zombieGroup.isTouching(bulletGroup)){
      for(var i=0;i<zombieGroup.length;i++){     
        if(zombieGroup[i].isTouching(bulletGroup)){
          zombieGroup[i].destroy();
          bulletGroup.destroyEach();
          loseSound.play();
          score = score+2;
        } 
      }
    }

    if(witchGroup.isTouching(bulletGroup)){
      for(var i=0;i<witchGroup.length;i++){     
        if(witchGroup[i].isTouching(bulletGroup)){
          witchGroup[i].destroy();
          bulletGroup.destroyEach();
          loseSound.play();
          score = score+3;
        } 
      }
    }

    if(draculaGroup.isTouching(bulletGroup)){
      for(var i=0;i<draculaGroup.length;i++){     
        if(draculaGroup[i].isTouching(bulletGroup)){
          draculaGroup[i].destroy();
          bulletGroup.destroyEach();
          loseSound.play();
          score = score+5;
        } 
      }
    }

    //reduce life and destroy zombie when player touches it
    if(zombieGroup.isTouching(player)){
      loseSound.play();
      for(var i=0;i<zombieGroup.length;i++){
        if(zombieGroup[i].isTouching(player)){
          zombieGroup[i].destroy();
          life=life-1;
        } 
      }
    }

    if(witchGroup.isTouching(player)){
      loseSound.play();
      for(var i=0;i<witchGroup.length;i++){
        if(witchGroup[i].isTouching(player)){
          witchGroup[i].destroy();
          life=life-1;
        } 
      }
    }

    if(draculaGroup.isTouching(player)){
      loseSound.play();
      for(var i=0;i<draculaGroup.length;i++){
        if(draculaGroup[i].isTouching(player)){
          draculaGroup[i].destroy();
          life=life-1;
        } 
      }
    }

    //go to gameState "lost" when 0 lives are remaining
    if(life===0){
      gameLose.play();
      gameState = "END";
    }
  
    //go to gameState "won" if score is 100
    if(score>=100){
      winSound.play();
      gameState = "END";
    }
  
    //go to gameState "bullet" when player runs out of bullets
    if(bullets==0){
      gameLose.play();
      gameState = "END"  
    }

    //calling the function to spawn enemies
    spawnZombie();
    spawnWitch();
    spawnDracula();
  }

  drawSprites();

  //displaying the score and remaining lives and bullets
  textSize(20);
  stroke("red");
  strokeWeight(2);
  fill("white");
  text("Bullets : " + bullets,width-250,displayHeight/2-280);
  text("Score : " + score,width-250,displayHeight/2-250);

  //destroy zombie and player and display a message in gameState "end"
  if(gameState == "END"){

    zombieGroup.setLifetimeEach(-1);
    witchGroup.setLifetimeEach(-1);
    draculaGroup.setLifetimeEach(-1);

    if(life ==  0){
      textSize(120);
      stroke("red");
      strokeWeight(5);
      fill("black");
      text("You Lost ",width/2-210,250);
      textSize(60);
      stroke("red");
      strokeWeight(2);
      text("Press 'r' to restart", width/2-200, 350);
      zombieGroup.destroyEach();
      witchGroup.destroyEach();
      draculaGroup.destroyEach();
      player.visible = false;
    }

    //destroy zombie and player and display a message in gameState "won"
    else if(score >= 100){
      textSize(120);
      stroke("red");
      strokeWeight(5);
      fill("black");
      text("You Won ",width/2-200,250);
      textSize(60);
      stroke("red");
      strokeWeight(2);
      text("Press 'r' to restart", width/2-200, 350);
      zombieGroup.destroyEach();
      draculaGroup.destroyEach();
      witchGroup.destroyEach();
      player.visible = false;
    }

    //destroy zombie, player and bullets and display a message in gameState "bullet"
    else if(bullets == 0){
      textSize(70);
      stroke("red");
      strokeWeight(5);
      fill("black");
      text("You ran out of bullets!!!",350,height/2-20);
      textSize(60);
      stroke("red");
      strokeWeight(2);
      text("Press 'r' to restart", width/2-200, height/2+50);
      zombieGroup.destroyEach();
      witchGroup.destroyEach();
      draculaGroup.destroyEach();
      player.visible = false;
    }
  }
}


//creating function to spawn zombies
function spawnZombie(){
  if(frameCount%100===0){
    x = random(700,width-100);
    y = random(height-200,height-80);
    zombie = createSprite(x,y,40,40);
    zombie.addImage(zombieImg);
    zombie.scale = 0.15;
    zombie.velocityX = -6;
    zombie.setCollider("rectangle",30,0,400,950);
    zombie.debug= false;
    zombie.lifetime = 400;
   zombieGroup.add(zombie);
  }
}

//creating function to spawn witch
function spawnWitch(){
  if(frameCount%150===0){
    var x = random(width/2+80,width-100);
    var y = random(70,height/2-50);
    witch = createSprite(x,y,40,40);
    witch.addImage(witchImg);
    witch.scale = 0.5;
    witch.velocityX = -8;
    witch.setCollider("rectangle",30,0,400,500);
    witch.debug= false;
    witch.lifetime = 400;
    witchGroup.add(witch);
  }
}

//creating function to spawn dracula
function spawnDracula(){
  if(frameCount%200===0){
    var x = random(width/2,width-100);
    var y = random(150,height/2+50);
    dracula = createSprite(x,y,40,40);
    dracula.addImage(draculaImg);
    dracula.scale = 0.5;
    dracula.velocityX = -10;
    dracula.setCollider("rectangle",0,0,400,400);
    dracula.debug = false;
    dracula.lifetime = 400;
    draculaGroup.add(dracula);
  }
}

function keyPressed()
{
  if (keyCode == 82)
  {
    gameState= "PLAY";
    player.visible = true;
    zombieGroup.destroyEach(); 
    witchGroup.destroyEach();
    draculaGroup.destroyEach(); 
    score = 0;
    life = 3; 
    bullets = 50;
  }
}