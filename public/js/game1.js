
app = angular.module('MineSweeper', []);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
  });
  
app.controller('MinesweeperController', ['$scope', '$interval', function ($scope, $interval) {
   
    $scope.minefield = createMineField();
    $scope.marked = getMarked($scope.minefield);
    $scope.mines = getMines($scope.minefield);
    $scope.isLostMessageVisible = false;
    $scope.isWinMessageVisible = false;



    $scope.go = false;
    $scope.showtime = 0;
    $scope.stoptime = 0;
    var tick = function () {
        if ($scope.go) {
            $scope.showtime = Date.now() - $scope.gotime;
            $scope.stoptime = $scope.showtime
        } else {
            $scope.showtime = $scope.stoptime
        }
    };
    $interval(tick, 100);

    function startClock() {
        if (!$scope.go) {
            $scope.gotime = Date.now();
            $scope.go = true;
        }
    }

    function stopClock() {
        if ($scope.go) {
            $scope.go = false;
        }
    }

    $scope.handleSpot = function (event, spot) {
        if (false || ($scope.isLostMessageVisible == false && $scope.isWinMessageVisible == false)) {
            if (event.button == 2) {
                if (spot.isCovered) {
                    if (spot.isMarked) {
                        spot.isMarked = false;
                        $scope.marked = subMarked($scope.minefield);
                    } else {
                        spot.isMarked = true;
                        $scope.marked = addMarked($scope.minefield);
                    }
                }
            } else if (event.button == 0 && !spot.isMarked) {
                clearEmptySpace($scope.minefield, spot.ro, spot.co);
                startTime($scope.minefield);
                startClock();
                if (spot.content == "mine") {
                    stopClock();
                    revealAll($scope.minefield);
                    $scope.isLostMessageVisible = true;
                } else {
                    if (hasWon($scope.minefield)) {
                        stopClock();
                        $scope.timer = calcTime($scope.minefield);
                        $scope.isWinMessageVisible = true;
                    }
                }
            }
        }
    };
}]);



function createMineField() {
    var minefield = {};
    minefield.rows = [];
    minefield.starttime = 0;     //Date.now();
    minefield.mines = 50;
    minefield.marked = 0;
    minefield.gamerows = 16;
    minefield.gamecols = 26;

    for (var i = 0; i < minefield.gamerows; i++) {  //row
        var row = {};
        row.spots = [];

        for (var j = 0; j < minefield.gamecols; j++) {  //col
            var spot = {};
            spot.co = j;
            spot.ro = i;
            spot.isCovered = true;
            spot.isMarked = false;
            spot.content = "empty";
            row.spots.push(spot);
        }

        minefield.rows.push(row);
    }
    placeManyRandomMines(minefield);
    calculateAllNumbers(minefield);
    checkManyStartLocations(minefield);

    return minefield;
};

function getMines(minefield) {
    return minefield.mines;
}

function getMarked(minefield) {
    return minefield.marked;
}

function addMarked(minefield) {
    minefield.marked++;
    return minefield.marked;
}

function subMarked(minefield) {
    minefield.marked--;
    return minefield.marked;
}
function getSpot(minefield, row, column) {

    return minefield.rows[row].spots[column];
}

function checkManyStartLocations(minefield) {
    var ok = false;
    while (!ok) {
        ok = checkLocation(minefield);
    }
}

function checkLocation(minefield) {
    var row = Math.round(Math.random() * (minefield.gamerows - 1));
    var column = Math.round(Math.random() * (minefield.gamecols - 1));

    var spot = getSpot(minefield, row, column);
    if (spot.content == "empty") {
        spot.isCovered = false;
        return true;
    }
}

function placeManyRandomMines(minefield) {
    for (var i = 0; i < minefield.mines; i++) {
        placeRandomMine(minefield);
    }
}

function placeRandomMine(minefield) {
    var row = Math.round(Math.random() * (minefield.gamerows - 1));
    var column = Math.round(Math.random() * (minefield.gamecols - 1));

    var spot = getSpot(minefield, row, column);
    if (spot.content == "mine") {
        while (spot.content == "mine") {
            row = Math.round(Math.random() * (minefield.gamerows - 1));
            column = Math.round(Math.random() * (minefield.gamecols - 1));
            spot = getSpot(minefield, row, column);
        }
    }
    spot.content = "mine";
}

function calculateNumber(minefield, row, column) {
    var thisSpot = getSpot(minefield, row, column);
    if (thisSpot.content == "mine") {
        return;
    }

    var mineCount = 0;
    if (row > 0) {
        if (column > 0) {
            var spot = getSpot(minefield, row - 1, column - 1);
            if (spot.content == "mine") {
                mineCount++;
            }
        }

        var spot = getSpot(minefield, row - 1, column);
        if (spot.content == "mine") {
            mineCount++;
        }

        if (column < minefield.gamecols - 1) {
            var spot = getSpot(minefield, row - 1, column + 1);
            if (spot.content == "mine") {
                mineCount++;
            }
        }
    }

    if (column > 0) {
        var spot = getSpot(minefield, row, column - 1);
        if (spot.content == "mine") {
            mineCount++;
        }
    }

    if (column < minefield.gamecols - 1) {
        var spot = getSpot(minefield, row, column + 1);
        if (spot.content == "mine") {
            mineCount++;
        }
    }

    if (row < minefield.gamerows - 1) {
        if (column > 0) {
            var spot = getSpot(minefield, row + 1, column - 1);
            if (spot.content == "mine") {
                mineCount++;
            }
        }

        var spot = getSpot(minefield, row + 1, column);
        if (spot.content == "mine") {
            mineCount++;
        }

        if (column < minefield.gamecols - 1) {
            var spot = getSpot(minefield, row + 1, column + 1);
            if (spot.content == "mine") {
                mineCount++;
            }
        }
    }

    if (mineCount > 0) {
        thisSpot.content = mineCount;
    }
}

function calculateAllNumbers(minefield) {
    for (var y = 0; y < minefield.gamecols; y++) {  // col
        for (var x = 0; x < minefield.gamerows; x++) { //row
            calculateNumber(minefield, x, y);
        }
    }
}

function hasWon(minefield) {
    for (var y = 0; y < minefield.gamecols; y++) {  //col
        for (var x = 0; x < minefield.gamerows; x++) {  //row
            var spot = getSpot(minefield, x, y);
            if (spot.isCovered && spot.content != "mine") {
                return false;
            }
        }
    }
    return true;
}

function startTime(minefield) {
    if (minefield.starttime == 0) {
        minefield.starttime = Date.now();
    }

}

function calcTime(minefield) {
    var milliseconds = Date.now();
    var seconds = 0;
    var minutes = 0;
    var sec = Math.round((milliseconds - minefield.starttime) / 100) / 10;
    minutes = Math.floor(sec / 60.0);
    seconds = Math.round((sec / 60 - minutes) * 600.0) / 10;
    if (minutes == 1) {
        return "You won!       Time: " + minutes + " minute and " + seconds + " seconds";
    } else {
        return "You won!       Time: " + minutes + " minutes and " + seconds + " seconds";
    }
}

// Visar alla minor
function revealAll(minefield) {
    for (var y = 0; y < minefield.gamecols; y++) {  //col
        for (var x = 0; x < minefield.gamerows; x++) {  //row
            var spot = getSpot(minefield, x, y);
            if (spot.content == 'mine' && !spot.isMarked) {
                spot.isCovered = false;
            }
        }
    }
}


//Rensa alla covered om clickad spot innehåller 'empty' kolla alla 8 rutor runt omkring upprepa om någon är 'empty'
function clearEmptySpace(minefield, x, y) {
    var maxX = minefield.gamerows;
    var maxY = minefield.gamecols;

    var clearAll = function (minefield, x, y, maxX, maxY) {
        var spot;
        spot = getSpot(minefield, x, y);
        if (!spot.isMarked) {
            spot.isCovered = false;
            if (spot.content == 'empty') {
                for (var yy = -1; yy < 2; yy++) {
                    for (var xx = -1; xx < 2; xx++) {
                        if (x + xx >= 0 && x + xx < maxX && y + yy >= 0 && y + yy < maxY && (xx != 0 || yy != 0)) {
                            var spot2 = getSpot(minefield, x + xx, y + yy);
                            if (!spot2.isMarked) {
                                if (spot2.content != 'mine' && spot2.isCovered) {
                                    spot2.isCovered = false;
                                    if (spot2.content == 'empty') {
                                        clearAll(minefield, x + xx, y + yy, maxX, maxY);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    var spot = getSpot(minefield, x, y);
    if (spot.isCovered || spot.content == 'empty') {
       clearAll(minefield, x, y, maxX, maxY);
    }
}
