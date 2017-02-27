'use strict';

/**
Gameboard
Manage buttons
Manage Habitat: a grid of possible cell locations.
Manage Cell life cycle: to avoid the future cycle influencing the outcome of the current cycle, in each generation, first mark the cells with their fated status in the next lifecycle-- live/dead/born-- then after each cell has been marked, change the status of each cell.
**/
var Board = React.createClass({
  displayName: 'Board',

  paused: false,
  gen: 1,
  initialize_timer: function initialize_timer() {
    var time = setInterval(this.event, 200);
  },
  event: function event() {
    if (!this.paused) this.nextGeneration();
  },
  getInitialState: function getInitialState() {
    var grid = [];
    for (var row = 0; row < this.props.gridHeight; row++) {
      var grid_row = [];
      //build the row
      for (var col = 0; col < this.props.gridWidth; col++) {
        var random = Math.floor(Math.random() * 4);
        if (random == 0) grid_row[col] = 'born';else if (random == 1) grid_row[col] = 'live';else grid_row[col] = 'dead';
      }
      //add row to grid
      grid.push(grid_row);
    }
    this.initialize_timer();
    return {
      grid: grid
    };
  },
  nextGeneration: function nextGeneration() {
    var arr = this.state.grid;
    var arr_of_destiny = [];
    for (var rows in arr) {
      var current_row = arr[rows];
      var row_of_destiny = [];
      for (var cell in current_row) {
        //get the 8 neighbors of cell
        var c = parseInt(cell);
        var r = parseInt(rows);
        var above = r <= 0 ? arr.length - 1 : r - 1; //row number of the row above the current cell.
        var below = r >= arr.length - 1 ? 0 : r + 1; //row number of the row below the current cell.
        var left = c <= 0 ? current_row.length - 1 : c - 1; //column number of column to the left of current cell.
        var right = c >= current_row.length - 1 ? 0 : c + 1; //column number of the column to the right of the current cell.
        var neighbors = [arr[above][left], arr[above][cell], arr[above][right], arr[rows][left], arr[rows][right], arr[below][left], arr[below][cell], arr[below][right]];
        //now count live neighbors
        var live = 0;
        for (var n in neighbors) {
          if (neighbors[n] != 'dead') live++;
        } //now determine if the cell survives, and push its fate to row_of_destiny
        if (current_row[cell] != 'dead') {
          if (live > 1 && live < 4) row_of_destiny.push('live'); //survives
          else row_of_destiny.push('dead'); //dies
        } else if (live == 3) {
            //A new cell is born here
            row_of_destiny.push('born');
          } else {
            //cell stays empty/dead
            row_of_destiny.push('dead');
          }
      } //for cell in rows
      arr_of_destiny.push(row_of_destiny);
    } //rows in this.state.grid
    this.setState({ grid: arr_of_destiny });
    this.gen++;
  }, //nextGeneration function end
  start: function start() {
    this.paused = false;
  },
  pause: function pause() {
    this.paused = true;
  },
  clear: function clear() {
    var temp = [];
    for (var row = 0; row < this.props.gridHeight; row++) {
      var grid_row = [];
      //build the row
      for (var col = 0; col < this.props.gridWidth; col++) {
        grid_row[col] = 'dead';
      }
      //add row to grid
      temp.push(grid_row);
    }
    this.gen = 1;
    this.setState({ grid: temp });
  },
  add: function add(coords) {
    var temp_grid = this.state.grid;
    temp_grid[coords[0]][coords[1]] = 'born';
    this.setState({ grid: temp_grid });
  },
  render: function render() {
    var rows = [];
    for (var row in this.state.grid) {
      rows.push(React.createElement(Row, { row: row, vals: this.state.grid[row], newCell: this.add }));
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'text-center controls' },
        React.createElement(
          'button',
          { className: 'btn btn-primary', onClick: this.start },
          'Start'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-warning', onClick: this.pause },
          'Pause'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-danger', onClick: this.clear },
          'Clear'
        ),
        React.createElement(
          'p',
          null,
          'Generations: ',
          this.gen
        )
      ),
      React.createElement(
        'div',
        { className: 'grid' },
        rows
      ),
      React.createElement(
        'button',
        { className: 'btn btn-info', onClick: this.nextGeneration },
        'Cycle'
      ),
      React.createElement(
        'p',
        null,
        'Key:  '
      ),
      React.createElement('div', { className: 'cell born' }),
      React.createElement(
        'p',
        null,
        '-New Cell  '
      ),
      React.createElement('div', { className: 'cell live' }),
      React.createElement(
        'p',
        null,
        '-Older Cell  '
      ),
      React.createElement('div', { className: 'cell' }),
      React.createElement(
        'p',
        null,
        '-Dead Cell'
      )
    );
  }
});

var Row = React.createClass({
  displayName: 'Row',

  render: function render() {
    var cells = [];
    for (var val in this.props.vals) {
      var classes = "cell " + this.props.vals[val];
      cells.push(React.createElement(Cell, { row: this.props.row, col: val, names: classes, newCell: this.props.newCell }));
    }
    return React.createElement(
      'div',
      { className: 'row' },
      cells
    );
  }
});

var Cell = React.createClass({
  displayName: 'Cell',

  add: function add() {
    var coords = [this.props.row, this.props.col];
    this.props.newCell(coords);
  },
  render: function render() {
    return React.createElement('div', { className: this.props.names, onClick: this.add });
  }
});

/**
render gameboard
**/
ReactDOM.render(React.createElement(Board, { gridWidth: 70, gridHeight: 50 }), document.getElementById("life"));