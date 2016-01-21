var Board = require('./snake.js');

var View = function($el) {
  this.$el = $el;
  this.board = new Board();
  this.setupViewGrid();
  $(window).on("keydown", this.handleKeyEvent.bind(this));
  this.intervalID = window.setInterval(this.step.bind(this), 100);
};

var KEYCODES = {
  32: "SPACE",
  37: "W",
  38: "N",
  39: "E",
  40: "S"
};

View.prototype.handleKeyEvent = function (event) {
  if (KEYCODES[event.keyCode] === "SPACE") {
    this.$el.empty();
    window.clearInterval(this.intervalID);
    new View(this.$el);
  }
  this.board.snake.turn(KEYCODES[event.keyCode]);
};

View.prototype.setupViewGrid = function () {
  for (var i = 0; i <= 20; i++) {
    var $ul = $("<ul>");
    for (var j = 0; j <= 20; j++) {
      var $li = $('<li>');
      $li.attr('pos', [i,j]);
      $ul.append($li);
    }
    this.$el.append($ul);
  }

  this.renderApple();
  // this.renderMines();
  this.$li = this.$el.find('li');

  this.$h1 = $('<h1>');
  this.$el.append(this.$h1);
  this.$h1.addClass("count");
  this.$h1.text("SCORE: 0");

  this.$h1_2 = $('<h1>');
  this.$el.append(this.$h1_2);
  this.$h1_2.addClass("count");
  this.$h1_2.text("Red Snake: 0");
};

View.prototype.renderApple = function () {
  var position = this.board.apple.position;

  this.$apple = $("li[pos='" + position.x + "," + position.y + "']");
  this.$apple.addClass('apple');
};

// View.prototype.renderMines = function () {
//   var positions = this.board.mines.map(function(mine){
//     return mine.position;
//   });
//   positions.forEach(function(position){
//     this.$mines = $("li[pos='" + position.x + "," + position.y + "']");
//     this.$mines.addClass('mine');
//   });
// };

View.prototype.viewRender = function () {
  this.$li.removeClass();
  var view = this;
  var segments = this.board.snake.segments;

  segments.forEach(function(segment){
    for (var i = 0; i <= 20; i++) {
      for (var j = 0; j <= 20; j++) {
        if (segment.x === i && segment.y === j) {
          this.$snake = $("li[pos='" + i + "," + j + "']");
          this.$snake.addClass("snake2");
        }
        if (view.board.snake.head().x === i && view.board.snake.head().y === j) {
          this.$head = $("li[pos='" + i + "," + j + "']");
          this.$head.removeClass('snake2');
          this.$head.addClass("head");
        }
      }
    }
  });

  var segments2 = this.board.snake2.segments;

  segments2.forEach(function(segment){
    for (var i = 0; i <= 20; i++) {
      for (var j = 0; j <= 20; j++) {
        if (segment.x === i && segment.y === j) {
          this.$snake2 = $("li[pos='" + i + "," + j + "']");
          this.$snake2.addClass("snake");
        }
        if (view.board.snake2.head().x === i && view.board.snake2.head().y === j) {
          this.$head = $("li[pos='" + i + "," + j + "']");
          this.$head.removeClass('snake');
          this.$head.addClass("head");
        }
      }
    }
  });

  this.$h1.text('Black Score: ' + this.board.count)
  this.$h1_2.text('Red Score: ' + this.board.opp)

  this.renderApple();
  // this.renderMines();

};


View.prototype.step = function () {
    this.board.snake.move();
    this.board.snake2.move();
  if (this.board.snake.segments.length !== 0 && this.board.count < 20 && this.board.opp < 20) {
    this.viewRender();
  } else {
    this.$el.empty();
    this.$over = $('<over>');
    if (this.board.count === 20) {
      this.$over.html("You Won! <br/> Final Score: " + this.board.count + "<br/><br/> Press Space to restart");
    } else {
      this.$over.html("Game Over <br/><br/><br/> Press Space to restart");
    }
    this.$el.append(this.$over);
    this.$el.removeClass();

    window.clearInterval(this.intervalID);
  }
};








module.exports = View;
