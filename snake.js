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
  playAreaSize: 500,
  snakeHeadSize: 20

};


var controller = {
  init: function(){
    view.init();
  }
};


var view = {

  init: function(){
    view.snakeHead = $("#snake-head");
    view.playArea = $("#playarea");
    view.food = $("#food");
  },

  placeSnakeHead: function(top, left){
    view.snakeHead.offset({top: top, left: left})
  },

  placeRandomFood: function(){
    var playAreaPaddedLeft = (view.playArea.offset().left + 10);
    var playAreaPaddedTop = (view.playArea.offset().top + 10);  
    var posX = util.rand(playAreaPaddedLeft, (model.playAreaSize - 20 - 10));
    var posY = util.rand(playAreaPaddedTop, (model.playAreaSize - 20 - 10));

    view.food.offset({top: posY, left: posX});

    if (util.touch(view.food, view.snakeHead)){
      console.log("whoops!");
      view.placeRandomFood();
    } else {
      console.log("worked!")
      return true;
    }
  }

  

};


$( document ).ready(function(){
  controller.init();
});