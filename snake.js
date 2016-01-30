"use strict";

var util = {
  rand: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  touch: function(obj, collection){
    var isTouching = false;
    var objRect = obj[0].getBoundingClientRect();

    $.each(collection, function(i, val){
      var valRect = val.getBoundingClientRect();

        if (objRect.left < valRect.left + valRect.width &&
            objRect.left + objRect.width > valRect.left &&
            objRect.top < valRect.top + valRect.height &&
            objRect.top + objRect.height > valRect.top) {
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
  }


};


var controller = {

  init: function(){
    controller.bindKeyPress();
    controller.startGame(400);
  },


  startGame: function(gameSpeed){
    model.init(gameSpeed);
    view.init();
    model.snakePieces = [];
    controller.playLoop();
  },

  playLoop: function(){
    controller.loopID = setInterval(function(){    
      //console.log("moving snake")
      view.moveSnake(model.currentDirection);

      if (view.outOfBounds()) {
        clearInterval(controller.loopID);
        controller.startGame(400);
      }

      if (util.touch(view.snakeHead, view.food)){
        clearInterval(controller.loopID);
        controller.growSnake();
        view.placeRandomFood();
        model.gameSpeed -= 10;
        controller.playLoop();
      }
    }, model.gameSpeed);
  },

  changeDirection: function(keyCode){
    var changeDirection = {
      37: function(){
        console.log('left');
        return {'left': '-=20'};
      },
      38: function(){
        console.log('up');
        return {'top': '-=20'};
      },
      39: function(){
        console.log('right');
        return {'left': '+=20'};
      },
      40: function(){
        console.log('down');
        return {'top': '+=20'};
      }
    };

    if (changeDirection.hasOwnProperty(keyCode) && 
        controller.directionAllowed(keyCode)){ 
      model.currentDirection = changeDirection[keyCode]();
      model.lastKeyCode = keyCode;
    }
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


  bindKeyPress: function(){
    $('body').on("keydown", function(event){
      controller.changeDirection(event.which);
    });
  },


  growSnake: function(){
    model.snakePieces.push(view.newSnakePiece());
  }
};


var view = {

  snakeHead: $("#snake-head"),
  playArea: $("#playarea"),
  food: $("#food"),

  newSnakePiece: function(){
    var newPiece = $("<div class='snake-piece'/>").css(view.snakeHead.position());
    $("#gutter").append(newPiece);
    return newPiece;
  },

  init: function(){
    view.snakeHead = $("#snake-head");
    view.playArea = $("#playarea");
    view.food = $("#food");

    $('.snake-piece').not("#snake-head").remove();
    view.snakeHead.css({'top': '0px', 'left': '0px'});
    view.placeRandomFood();
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

    $.each(model.snakePieces, function(index, piece){
      var newPos = nextPos;
      nextPos = piece.position();
      piece.css(newPos);
    });
    
  },

  outOfBounds: function(){
    if (util.touch(view.snakeHead, view.playArea)){
      return false;
    } else {
      return true;
    }
  }

};


$( document ).ready(function(){
  controller.init();
});