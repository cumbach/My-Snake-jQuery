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

  while (this.board.snake.isOccupying([x,y]) || this.board.snake2.isOccupying([x,y])) {
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
