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

  init: function(speed){
    model.speed = speed;
    model.currentDirection = {'left': '+=' + model.speed};
    model.lastKeyCode = 39; // start off going right
  }


};


var controller = {
  init: function(){
    model.init(10);
    view.init();
    controller.bindKeyPress();
  },

  playLoop: function(){

  },

  changeDirection: function(keyCode){
    var changeDirection = {
      37: function(){
        console.log('left');
        return {'left': '-=' + model.speed};
      },
      38: function(){
        console.log('up');
        return {'top': '-=' + model.speed};
      },
      39: function(){
        console.log('right');
        return {'left': '+=' + model.speed};
      },
      40: function(){
        console.log('down');
        return {'top': '+=' + model.speed};
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
  }
};


var view = {

  init: function(){
    view.snakeHead = $("#snake-head");
    view.playArea = $("#playarea");
    view.food = $("#food");
  },

  placeRandomFood: function(){ 
    var posX = util.rand(0, (458 - 20));
    var posY = util.rand(0, (458 - 20));

    view.food.css({'top': posY, 'left': posX});

    if (util.touch(view.food, view.snakeHead)){
      view.placeRandomFood();
    } else {
      return;
    }
  }

};


$( document ).ready(function(){
  controller.init();
});