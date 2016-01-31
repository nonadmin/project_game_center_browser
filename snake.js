"use strict";

var util = {

  rand: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },


  touch: function(obj, collection){
    var isTouching = false;
    var objRect = obj[0].getBoundingClientRect();

    $.each(collection, function(i, elem){
      elem = elem instanceof jQuery ? elem[0] : elem;
      var elemRect = elem.getBoundingClientRect();

        if (objRect.left < elemRect.left + elemRect.width &&
            objRect.left + objRect.width > elemRect.left &&
            objRect.top < elemRect.top + elemRect.height &&
            objRect.top + objRect.height > elemRect.top) {
          isTouching = true;
          return false;
        }

    });
    return isTouching;
  }

};


var model = {

  init: function(gameSpeed){
    model.gameSpeed = gameSpeed;
    model.currentDirection = {'left': '+=20'};
    model.lastKeyCode = 39; // start off going right
  },


  increaseSpeed: function(){
    if (model.gameSpeed > 20){
      model.gameSpeed -= 10;
    }
  },


  speed: function(){
    return (400 - model.gameSpeed);
  }

};


var controller = {

  init: function(){
    controller.bindKeyPress();
    controller.startGame(400);
  },


  changeDirection: function(keyCode){
    var changeDirection = {
      37: function(){
        //console.log('left');
        return {'left': '-=20'};
      },
      38: function(){
        //console.log('up');
        return {'top': '-=20'};
      },
      39: function(){
        //console.log('right');
        return {'left': '+=20'};
      },
      40: function(){
        //console.log('down');
        return {'top': '+=20'};
      }
    };

    if (changeDirection.hasOwnProperty(keyCode) && 
        controller.directionAllowed(keyCode)){ 
      model.currentDirection = changeDirection[keyCode]();
      model.lastKeyCode = keyCode;
    }
  },


  bindKeyPress: function(){
    $('body').on("keydown", function(event){
      controller.changeDirection(event.which);
    });
  },


  startGame: function(gameSpeed){
    model.init(gameSpeed);
    view.init();
    model.snakePieces = [];
    controller.playLoop();
  },


  playLoop: function(){
    controller.loopID = setInterval(function(){    
      view.moveSnake(model.currentDirection);

      if (controller.illegalMove()) {
        view.destroySnake();
      }

      if (util.touch(view.snakeHead, view.food)){
        controller.growSnake();
      }
    }, model.gameSpeed);
  },


  directionAllowed: function(keyCode){
    if (keyCode === 37 && model.lastKeyCode !== 39 || 
        keyCode === 39 && model.lastKeyCode !== 37 || 
        keyCode === 38 && model.lastKeyCode !== 40 ||
        keyCode === 40 && model.lastKeyCode !== 38){
      return true;
    } else {
      return false;
    }
  },


  growSnake: function(){
    model.snakePieces.push(view.newSnakePiece());
    view.placeRandomFood();

    // increasing game speed!
    model.increaseSpeed();
    view.updateStats(model.speed());

    clearInterval(controller.loopID);
    controller.playLoop();
  },


  illegalMove: function(){
    if (!(util.touch(view.snakeHead, view.playArea))){
      return true;
    } else if (util.touch(view.snakeHead, model.snakePieces)) {
      return true;
    } else {
      return false;
    }
  },

};


var view = {

  init: function(){
    view.snakeHead = $("#snake-head");
    view.playArea = $("#playarea");
    view.food = $("#food");
    view.stats = $('span');

    view.updateStats(0);
    view.snakeHead.show();
    view.snakeHead.css({'top': '0px', 'left': '0px'});
    view.placeRandomFood();
  },


  newSnakePiece: function(){
    var newPiece = $("<div class='snake-piece'/>").css(view.snakeHead.position());
    $("#gutter").append(newPiece);
    return newPiece;
  },
  

  placeRandomFood: function(){ 
    var posX = util.rand(0, (458 - 20));
    var posY = util.rand(0, (458 - 20));

    view.food.css({'top': posY, 'left': posX});

    if (util.touch(view.food, $('.snake-piece'))){
      view.placeRandomFood();
    } else {
      return;
    }
  },


  moveSnake: function(direction){
    var nextPos = view.snakeHead.position();
    view.snakeHead.css(direction);

    // iterate through snake "pieces", moving each
    $.each(model.snakePieces, function(index, piece){
      var newPos = nextPos;
      nextPos = piece.position();
      piece.css(newPos);
    }); 
  },


  updateStats: function(score){
    view.stats[0].innerHTML = score;
  },


  destroySnake: function(){
    $('.snake-piece').fadeOut(1000, function(){
      clearInterval(controller.loopID);
      controller.startGame(400);
    });
  }

};


$( document ).ready(function(){
  controller.init();
});