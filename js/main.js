var View = require('./snake_view.js');

$(function () {
  var rootEl = $('.snake-game');
  new View(rootEl);
});
