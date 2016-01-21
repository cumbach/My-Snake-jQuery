/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	$(function () {
	  var rootEl = $('.snake-game');
	  new View(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Coord (x, y) {
	  this.x = x;
	  this.y = y;
	}
	
	Coord.prototype.plus = function (coord2) {
	  return new Coord(this.x + coord2.x, this.y + coord2.y);
	};
	
	Coord.prototype.equals = function (coord2) {
	  return (this.x === coord2.x) && (this.y === coord2.y);
	};
	
	Coord.prototype.isOpposite = function (coord2) {
	  return (this.x === (-1 * coord2.x)) && (this.y === (-1 * coord2.y));
	};
	
	function Apple (board) {
	  this.board = board;
	
	  this.replace();
	}
	
	Apple.prototype.replace = function () {
	  // var x = Math.floor(Math.random() * 20);
	  // var y = Math.floor(Math.random() * 20);
	
	  var x = Math.floor(Math.random() * 20);
	  var y = Math.floor(Math.random() * 20);
	
	  while (this.board.snake.isOccupying([x,y])) {
	    x = Math.floor(Math.random() * 20);
	    y = Math.floor(Math.random() * 20);
	  }
	  // debugger
	
	  this.position = new Coord(x,y);
	};
	
	// function Mine (board) {
	//   this.board = board;
	//
	//   this.replace();
	// }
	//
	// Mine.prototype.replace = function () {
	//   // var x = Math.floor(Math.random() * 20);
	//   // var y = Math.floor(Math.random() * 20);
	//
	//   var x = Math.floor(Math.random() * 20);
	//   var y = Math.floor(Math.random() * 20);
	//
	//   while (this.board.snake.isOccupying([x,y])) {
	//     x = Math.floor(Math.random() * 20);
	//     y = Math.floor(Math.random() * 20);
	//   }
	//   // debugger
	//
	//   this.position = new Coord(x,y);
	// };
	
	function Snake (board) {
	  this.board = board;
	  this.direction = "E";
	  this.segments = [new Coord(3,3), new Coord(3,4), new Coord(3,5)];
	}
	
	Snake.prototype.head = function () {
	  return this.segments[this.segments.length -1];
	};
	
	Snake.prototype.isOccupying = function (array) {
	  var result = false;
	  this.segments.forEach(function (segment) {
	    if (segment.x === array[0] && segment.y === array[1]) {
	      result = true;
	      return result;
	    }
	  });
	  return result;
	};
	
	Snake.prototype.move = function () {
	
	  // this.board.mines.forEach(function(mine){
	  //   if (mine.position.equals(this.head())) {
	  //     mineHit = true;
	  //   }
	  // }.bind(this));
	
	    if (this.board.apple.position.equals(this.head()) &&
	      this.board.moveInBoard()) {
	    this.board.apple.replace();
	    // this.board.mines.push(new Mine(this.board));
	    this.board.count += 1;
	    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));
	  } else if (this.board.moveInBoard()) {
	    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));
	    this.segments.shift();
	  } else {
	    this.segments = [];
	  }
	  // debugger;
	  for (var i = 0; i < this.segments.length - 1; i++) {
	    if (this.segments[i].equals(this.head())) {
	      this.segments = [];
	    }
	  }
	  // debugger;
	};
	
	
	Snake.DIFFS = {
	  "N": new Coord(-1, 0),
	  "E": new Coord(0, 1),
	  "S": new Coord(1, 0),
	  "W": new Coord(0, -1)
	};
	
	Snake.prototype.turn = function (newDirection) {
	  // console.log(!Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[newDirection]));
	
	  if (!Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[newDirection])) {
	    this.direction = newDirection;
	  }
	};
	
	Snake.prototype.grow = function () {
	  if (this.board.moveInBoard()) {
	    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));
	    // this.segments.shift();
	  } else {
	    this.segments = [];
	  }
	};
	
	function Snake2 (board) {
	  this.board = board;
	  this.direction = "W";
	  this.segments = [new Coord(18,18), new Coord(17,18), new Coord(16,18)];
	}
	
	Snake2.prototype.head = function () {
	  return this.segments[this.segments.length -1];
	};
	
	Snake2.prototype.isOccupying = function (array) {
	  var result = false;
	  this.segments.forEach(function (segment) {
	    if (segment.x === array[0] && segment.y === array[1]) {
	      result = true;
	      return result;
	    }
	  });
	  return result;
	};
	
	Snake2.prototype.move = function () {
	
	  if (this.board.apple.position.equals(this.head())) {
	    this.board.apple.replace();
	    this.board.opp += 1;
	    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));
	  } else {
	  // } else if (this.board.moveInBoard()) {
	  //
	    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));
	    this.segments.shift();
	  // } else {
	  //
	  //   this.segments = [];
	  }
	
	  // for (var i = 0; i < this.segments.length - 1; i++) {
	  //   if (this.segments[i].equals(this.head())) {
	  //     this.segments = [];
	  //   }
	  // }
	
	  this.aI();
	
	};
	
	Snake2.prototype.aI = function() {
	
	  var nextMove = this.head().plus(Snake.DIFFS[this.direction]);
	  var newDirection = this.direction;
	  if (nextMove.x <= 0 || nextMove.x >= 20 || nextMove.y <= 0 || nextMove.y >= 20) {
	
	
	    Object.keys(Snake.DIFFS).forEach(function(direction){
	      var head = this.head();
	
	      for (var i = 0; i < 5; i++) {
	        head = head.plus(Snake.DIFFS[direction]);
	      }
	
	      if (head.x >= 0 &&
	          head.y >= 0 &&
	          head.x <= 20 &&
	          head.y <= 20 &&
	          !Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[direction])) {
	        newDirection = direction;
	      }
	
	    }.bind(this));
	
	
	  }
	  this.turn(newDirection);
	};
	
	Snake2.prototype.turn = function (newDirection) {
	  Object.keys(Snake.DIFFS).forEach(function(direction){
	    var head = this.head();
	    // debugger;
	    for (var i = 0; i < 20; i++) {
	      head = head.plus(Snake.DIFFS[direction]);
	      if (this.board.apple.position.equals(head)) {
	        if (!Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[direction])) {
	          newDirection = direction;
	        }
	        break;
	      }
	    }
	  }.bind(this));
	
	  this.direction = newDirection;
	
	  // if (!Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[newDirection])) {
	  //   this.direction = newDirection;
	  // } else {
	  //   while (true) {
	  //     newDirection = Object.keys(Snake.DIFFS)[Math.floor(Math.random() * 4)];
	  //     if (!Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[newDirection]) &&
	  //         Snake.DIFFS[this.direction] !== Snake.DIFFS[newDirection]) {
	  //       console.log(Snake.DIFFS[this.direction]);
	  //       console.log(Snake.DIFFS[newDirection]);
	  //       this.direction = newDirection;
	  //       break;
	  //     }
	  //   }
	  // }
	};
	
	Snake2.prototype.grow = function () {
	  if (this.board.moveInBoard()) {
	    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));
	    // this.segments.shift();
	  } else {
	    this.segments = [];
	  }
	};
	
	function Board () {
	  this.snake = new Snake(this);
	  this.snake2 = new Snake2(this);
	  this.grid = [];
	  this.setupGrid();
	  this.apple = new Apple(this);
	  // this.mines = [];
	  // this.mines.push(new Mine(this));
	  this.count = 0;
	  this.opp = 0;
	}
	
	Board.prototype.moveInBoard = function () {
	  var head = this.snake.head();
	  return (head.x >= 0 && head.x <= 20 && head.y >= 0 && head.y <= 20);
	};
	
	Board.prototype.setupGrid = function () {
	  for (var i = 0; i <= 20; i++) {
	    for (var j = 0; j <= 20; j++) {
	      this.grid.push([i,j]);
	    }
	  }
	};
	
	Board.prototype.render = function () {
	  this.snake.segments.forEach(function (segment) {
	    this.grid[segment.x, segment.y] = "Z";
	  }.bind(this));
	};
	
	
	
	module.exports = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map