
function flame(flame, x, y) {

  // this.power = power;
  // this.x = x;
  // this.y = y;
  this.time = 0;
  var finished = 1;

  this.update = function(){
    if (this.time < 40){
      this.time += 1;
    } else {
      flames.shift();
    }
  }
  

  this.draw = function() {

    ctx.drawImage(flameImg,125, 205, 15, 15, x, y, 50, 50);

    for (var i = 1; i < flame.right; i++) {ctx.drawImage(flameImg,143, 223, 15, 15, x + (50*i), y, 50, 50)};
    for (var i = 1; i < flame.left; i++) {ctx.drawImage(flameImg,143, 223, 15, 15, x - (50*i), y, 50, 50)};
    for (var i = 1; i < flame.up; i++) {ctx.drawImage(flameImg,107, 223, 15, 15, x, y + (50*i), 50, 50)};
    for (var i = 1; i < flame.down; i++) {ctx.drawImage(flameImg,107, 223, 15, 15, x, y - (50*i), 50, 50)};
      
    ctx.drawImage(flameImg,141, 205, 15, 15, x + (50*finished), y, 50, 50);
    ctx.drawImage(flameImg,109, 205, 15, 15, x - (50*finished), y, 50, 50);
    ctx.drawImage(flameImg,125, 221, 15, 15, x, y + (50*finished), 50, 50);
    ctx.drawImage(flameImg,125, 189, 15, 15, x, y - (50*finished), 50, 50);
  
  
}



//Bomb constructor
function bomb(x, y, power, laidBy) {
  this.x = x;
  this.y = y;
  this.time = 0;
  this.scaleMod = 1;
  this.power = power;
  this.laidBy = laidBy;

  this.explode = function() {
    var coord = [this.x/50, this.y/50];
    var flame = {right : 0, left : 0, up : 0, down : 0};
    //if on an even x or y grid, explode accordingly
    if (coord[0] % 2 === 0){
      var up = false, down = false, left = true, right = true;
    } else if (coord[1] % 2 === 0){
      var up = true, down = true, left = false, right = false;
    } else {
      var up = true, down = true, left = true, right = true;
    }
    var caught = [];
    var otherBombs = [];
    
    //check bomb square to see if player is standing on bomb
    for(var i = 0; i < players.length; i++){
      if (players[i].playerLoc[0] === coord[0] && players[i].playerLoc[1] === coord[1]) players[i].die();
    }
    //check flamePath for bricks and players
    for (var i = 1; i <= this.power; i++) {
      for(var j = 0; j < players.length; j++){
        if (players[j].playerLoc[0] === coord[0] + i && players[j].playerLoc[1] === coord[1] && right) players[j].die();
        if (players[j].playerLoc[0] === coord[0] - i && players[j].playerLoc[1] === coord[1] && left) players[j].die();
        if (players[j].playerLoc[0] === coord[0] && players[j].playerLoc[1] === coord[1] + i && down) players[j].die();
        if (players[j].playerLoc[0] === coord[0] && players[j].playerLoc[1] === coord[1] - i && up) players[j].die();
      }
      
      //checks for bricks out 1 at a time when the explosion happens looking for collision
      bricks.forEach(function(brick, ind){
        if (brick.coord[0] === coord[0] + i && brick.coord[1] === coord[1] && right) {
          right = false;
          caught.push(ind);
        } else flame.right++;
        if (brick.coord[0] === coord[0] - i && brick.coord[1] === coord[1] && left) {
          caught.push(ind);
          left = false;
        } else flame.left++;
        if (brick.coord[0] === coord[0] && brick.coord[1] === coord[1] + i && down) {
          caught.push(ind);
          down = false;
        } else flame.down++;
        if (brick.coord[0] === coord[0] && brick.coord[1] === coord[1] - i && up) {
          caught.push(ind);
          up = false;
        } else flame.up++;
      })
      //check if powerups get exploded
      powerUps.forEach(function(power, ind){
        if ((power.x / 50)  === coord[0] + i && (power.y / 50) === coord[1] && right) {
          powerUps.splice(ind , 1);
        }
        if ((power.x / 50) === coord[0] - i && (power.y / 50) === coord[1] && left) {
          powerUps.splice(ind , 1);
        }
        if ((power.x / 50) === coord[0] && (power.y / 50) === coord[1] + i && down) {
          powerUps.splice(ind , 1);
        }
        if ((power.x / 50) === coord[0] && (power.y / 50) === coord[1] - i && up) {
          powerUps.splice(ind , 1);
        }
      })

        bombs.forEach(function(bomb, ind){
        if ((bomb.x / 50)  === coord[0] + i && (bomb.y / 50) === coord[1] && right) {
          bomb.time = 800;
        }
        if ((bomb.x / 50) === coord[0] - i && (bomb.y / 50) === coord[1] && left) {
          bomb.time = 800;
        }
        if ((bomb.x / 50) === coord[0] && (bomb.y / 50) === coord[1] + i && down) {
          bomb.time = 800;
        }
        if ((bomb.x / 50) === coord[0] && (bomb.y / 50) === coord[1] - i && up) {
          bomb.time = 800;
        }
      })
    }
    var i = 0;
    
    if (caught.length > 0)  {
      do {
        if (getRandom ('hasItem')){
          powerUps.push(new powerUp(caught[i]));
        }
        bricks.splice(caught[i] - i , 1);
        i++;
      } while (i < caught.length)
    }
    i = 0;
    
  }
  this.update = function() {
    if (this.time < 800){
      this.time += 10;
      if (this.time % 40 === 0){
        this.scaleMod += (Math.sin(this.time*.75)/25);
      }
    } else {
      flames.push (new flame(this.flame,this.x, this.y));
      bombs.shift();
      this.explode();
      players[this.laidBy-1].bombInventory++;
    }
  };
  this.draw = function() {
    ctx.drawImage(bombImg,0, 0, 240, 288, this.x + 3, this.y, 45*this.scaleMod, 45*this.scaleMod);
  };
}

function brick(x, y) {
  this.x = x;
  this.y = y;
  this.coord = [this.x / 50, this.y / 50];

  this.update = function() {

  };
  this.draw = function() {
    ctx.drawImage(breakableImg,0, 0, 59, 57, this.x, this.y, 50, 50);
  };
}

function findBlock() {
  var openSpace = true;
  bricks.forEach(function(brick) {
    for(var i = 0; i < players.length; i++) {
      if ((players[i].x < brick.x + 50 && players[i].y < brick.y + 50 &&
            brick.x < players[i].x + 50 && brick.y < players[i].y + 50)) {
          openSpace = false;
        }
    }
  })
  return openSpace;
}

function powerUp(explodedCoord) {
  this.x = bricks[explodedCoord].x;
  this.y = bricks[explodedCoord].y;
  this.item = getRandom('item');
  this.coord = bricks[explodedCoord].explodedCoord;

  this.update = function() {
    //if player picks up, do this-
    for(var i = 0; i < players.length; i++) {
      if ((players[i].x < this.x + 50 && players[i].y < this.y + 50 &&
            this.x < players[i].x + 50 && this.y < players[i].y + 50)) {
          switch (this.item){
            case 'skull' :
              players[i].skull = true;
              console.log ("skull: " + players[i].skull);
              break;
            case 'boostSpeed' :
              players[i].speed++;
              console.log ("speed: " + players[i].speed);
              break;
            case 'boostFlame' :
              players[i].bombPower++;
              console.log ("flame: " + players[i].bombPower);
              break;
            case 'extraBomb' :
              players[i].bombInventory++;
              console.log ("bombs: " + players[i].bombInventory);
              break;
          }
          powerUps.shift();
      }
    }
  };
  this.draw = function() {

    if (this.item === 'skull') ctx.drawImage(powerUpImg,0, 0, 40, 36, this.x, this.y, 50, 50);
    if (this.item === 'boostSpeed') ctx.drawImage(powerUpImg,160, 0, 40, 36, this.x, this.y, 50, 50);
    if (this.item === 'boostFlame') ctx.drawImage(powerUpImg,80, 0, 40, 36, this.x, this.y, 50, 50);
    if (this.item === 'extraBomb') ctx.drawImage(powerUpImg,200, 0, 40, 36, this.x, this.y, 50, 50);

  };
}

function inRange(location, edge, dir) {
  var max = 650;
  if (dir === 'ver') max = 550;
  for (var i = 1; i <= 13; i+=2){
    if (edge <= max && edge >= 50){
      if (location < i * 50 + 10 && location > i * 50 - 10) {
        gridlock = i*50;
        return true;
      }
    }
  }
  return false;
}

function getRandom(item) {
  randNum = Math.floor(Math.random() * 8) + 1;
  if (item === 'block'){
    if (randNum === 1) return false;
    else return true;
  }
  if (item === 'hasItem') {
    if (randNum%3 === 0) return true;
    else return false;
  }
  if (item === 'item') {
    if (randNum > 4) randNum -= 4;
    switch (randNum) {
      case 1:
        return 'boostSpeed';
      case 2:
        return 'extraBomb';
      case 3:
        return 'boostFlame';
      case 4:
        return 'skull';
    }
  }
}