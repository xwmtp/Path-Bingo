// seedrandom
(function (j, i, g, m, k, n, o) {
    function q(b) { var e, f, a = this, c = b.length, d = 0, h = a.i = a.j = a.m = 0; a.S = []; a.c = []; for (c || (b = [c++]); d < g;)a.S[d] = d++; for (d = 0; d < g; d++) { e = a.S[d]; h = h + e + b[d % c] & g - 1; f = a.S[h]; a.S[d] = f; a.S[h] = e; } a.g = function (b) { var c = a.S, d = a.i + 1 & g - 1, e = c[d], f = a.j + e & g - 1, h = c[f]; c[d] = h; c[f] = e; for (var i = c[e + h & g - 1]; --b;) { d = d + 1 & g - 1; e = c[d]; f = f + e & g - 1; h = c[f]; c[d] = h; c[f] = e; i = i * g + c[e + h & g - 1]; } a.i = d; a.j = f; return i; }; a.g(g); } function p(b, e, f, a, c) { f = []; c = typeof b; if (e && c == "object") for (a in b) if (a.indexOf("S") < 5) try { f.push(p(b[a], e - 1)); } catch (d) { } return f.length ? f : b + (c != "string" ? "\0" : ""); } function l(b, e, f, a) { b += ""; for (a = f = 0; a < b.length; a++) { var c = e, d = a & g - 1, h = (f ^= e[a & g - 1] * 19) + b.charCodeAt(a); c[d] = h & g - 1; } b = ""; for (a in e) b += String.fromCharCode(e[a]); return b; } i.seedrandom = function (b, e) {
        var f = [], a; b = l(p(e ? [b, j] : arguments.length ? b : [(new Date).getTime(), j, window], 3), f); a = new q(f); l(a.S, j); i.random = function () {
            for (var c = a.g(m), d = o, b = 0; c < k;) { c = (c + b) * g; d *= g; b = a.g(1); } for (; c >= n;) { c /= 2; d /= 2; b >>>= 1; } return (c + b) / d;
        }; return b;
    }; o = i.pow(g, m); k = i.pow(2, k); n = k * 2; l(i.random(), j);
})([], Math, 256, 6, 52);




//NOTICE: As of version 6, this script will only generate cards correctly for Ocarina of Time bingo
//and as such should be saved alongside the regular bingo script.


// 100 is way higher than would ever be allowed, so use it
// as a signal to get out
var TOO_MUCH_SYNERGY = 100;

// the number of squares in a row on the board
// might change in the future if we want to support arbitrarily sized boards
var SQUARES_PER_ROW = 5;

/*
 * Profile Format:
 *
 * defaultMinimumSynergy: the minimum synergy allowed in any one row
 * defaultMaximumSynergy: the maximum synergy allowed in any one row
 * defaultMaximumIndividualSynergy: the maximum synergy allowed between a pair of goals
 * defaultMaximumSpill:   the maximum allowed spill up in difficulty when choosing a goal
 * defaultInitialOffset:  the initial deviation from the desired time to allow when choosing a goal
 * defaultMaximumOffset:  the maximum allowed deviation from the desired time when choosing a goal
 * baselineTime:          the base amount of time that is factored in to account for starting / common setup
 * timePerDifficulty:     the ratio between time and difficulty
 */
var DEFAULT_PROFILE = {
    defaultMinimumSynergy: -3,
    defaultMaximumSynergy: 7,
    defaultMaximumIndividualSynergy: 3.75,
    defaultMaximumSpill: 2,
    defaultInitialOffset: 1,
    defaultMaximumOffset: 2,
    baselineTime: 27.75,
    timePerDifficulty: 0.75
};

var PATH_PROFILE = {
    defaultMinimumSynergy: -3,
    defaultMaximumSynergy: 7,
    defaultMaximumIndividualSynergy: 5,
    defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
    defaultInitialOffset: 1,
    defaultMaximumOffset: 3,
    baselineTime: DEFAULT_PROFILE.baselineTime,
    timePerDifficulty: DEFAULT_PROFILE.timePerDifficulty
};

var NORMAL_PROFILE = {
    defaultMinimumSynergy: DEFAULT_PROFILE.defaultMinimumSynergy,
    defaultMaximumSynergy: DEFAULT_PROFILE.defaultMaximumSynergy,
    defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
    defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
    defaultInitialOffset: DEFAULT_PROFILE.defaultInitialOffset,
    defaultMaximumOffset: DEFAULT_PROFILE.defaultMaximumOffset,
    baselineTime: DEFAULT_PROFILE.baselineTime,
    timePerDifficulty: DEFAULT_PROFILE.timePerDifficulty
};

var SHORT_PROFILE = {
    defaultMinimumSynergy: DEFAULT_PROFILE.defaultMinimumSynergy,
    defaultMaximumSynergy: 3,
    defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
    defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
    defaultInitialOffset: DEFAULT_PROFILE.defaultInitialOffset,
    defaultMaximumOffset: DEFAULT_PROFILE.defaultMaximumOffset,
    baselineTime: 12,
    timePerDifficulty: 0.5
};

var BLACKOUT_PROFILE = {
    defaultMinimumSynergy: -10,
    defaultMaximumSynergy: 10,
    defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
    defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
    defaultInitialOffset: 2,
    defaultMaximumOffset: 6,
    baselineTime: DEFAULT_PROFILE.baselineTime,
    timePerDifficulty: DEFAULT_PROFILE.timePerDifficulty
};

var SHORTBLACKOUT_PROFILE = {
    defaultMinimumSynergy: -4,
    defaultMaximumSynergy: 4,
    defaultMaximumIndividualSynergy: DEFAULT_PROFILE.defaultMaximumIndividualSynergy,
    defaultMaximumSpill: DEFAULT_PROFILE.defaultMaximumSpill,
    defaultInitialOffset: 2,
    defaultMaximumOffset: 6,
    baselineTime: 12,
    timePerDifficulty: 0.5
};

Array.prototype.sortNumerically = function () {
    return this.sort(function (a, b) {
        return a - b;
    });
};

Array.prototype.shuffled = function () {
    var toShuffle = this.slice();
    for (var i = 0; i < toShuffle.length; i++) {
        var randElement = Math.floor(Math.random() * (i + 1));
        var temp = toShuffle[i];
        toShuffle[i] = toShuffle[randElement];
        toShuffle[randElement] = temp;
    }
    return toShuffle;
};

function hasDuplicateStrings(array) {
    var seen = {};

    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (el in seen) {
            return true;
        }
        seen[el] = true;
    }

    return false;
};

//giuocob 16-8-12: lineCheckList[] has been replaced to allow for removal of all-child rows
//Note: the INDICES_PER_ROW relation is simply the inverse of the ROWS_PER_INDEX relation

// Deleted row1 (synergy between end goals irrelevant) and diagonals
var INDICES_PER_ROW = {
    "row2": [6, 7, 8, 9, 10],
    "row3": [11, 12, 13, 14, 15],
    "row4": [16, 17, 18, 19, 20],
    "row5": [21, 22, 23, 24, 25],
    "col1": [1, 6, 11, 16, 21],
    "col2": [2, 7, 12, 17, 22],
    "col3": [3, 8, 13, 18, 23],
    "col4": [4, 9, 14, 19, 24],
    "col5": [5, 10, 15, 20, 25],
};

//Given an object that maps keys to flat arrays, invert said object
function invertObject(obj) {
    var ret = {};
    Object.keys(obj).forEach(function (key) {
        obj[key].forEach(function (item) {
            if (!ret[item]) ret[item] = [];
            ret[item].push(key);
        });
    });
    return ret;
}

// a mapping from board slot to the rows that it's a part of
// for example, ROWS_PER_INDEX[1] returns ["row1", "col1", "tlbr"]
var ROWS_PER_INDEX = invertObject(INDICES_PER_ROW);

var BingoGenerator = function (bingoList, options) {
    if (!options) {
        options = {};
    }

    this.language = options.lang || 'name';
    this.mode = options.mode || 'normal';
    this.seed = options.seed || Math.ceil(999999 * Math.random()).toString();

    if (bingoList.info && bingoList.info.combined === 'true') {
        if (bingoList[this.mode]) {
            bingoList = bingoList[this.mode];
        }
        else if (bingoList["normal"]) {
            bingoList = bingoList["normal"];
        }
        else {
            console.log("bingoList doesn't contain a valid sub goal list for mode: \"" + this.mode + "\"");
        }
    }

    this.goalsByDifficulty = bingoList;
    this.rowtypeTimeSave = bingoList.rowtypes;
    this.synergyFilters = bingoList.synfilters || {};

    // assemble a list of all goals sorted by the goals' times
    this.goalsList = [];
    for (var i = 1; i <= 25; i++) {
        this.goalsList = this.goalsList.concat(bingoList[i]);
    }
    this.goalsList.sort(function (a, b) {
        var timeDiff = a.time - b.time;

        if (timeDiff !== 0) {
            return timeDiff;
        }

        if (a.id > b.id) {
            return 1;
        }
        else if (a.id < b.id) {
            return -1;
        }
        else {
            return 0;
        }
    });

    this.goalsByName = {};
    for (var i = 0; i < this.goalsList.length; i++) {
        var goal = this.goalsList[i];
        this.goalsByName[goal.name] = goal;
    }

    this.profile = NORMAL_PROFILE;
    if (this.mode === 'short') {
        this.profile = SHORT_PROFILE;
    }
    else if (this.mode === 'blackout') {
        this.profile = BLACKOUT_PROFILE;
    }
    else if (this.mode === 'path') {
        this.profile = PATH_PROFILE
    }

    this.baselineTime = options.baselineTime || this.profile.baselineTime;
    this.timePerDifficulty = options.timePerDifficulty || this.profile.timePerDifficulty;

    this.minimumSynergy = options.minimumSynergy || this.profile.defaultMinimumSynergy;
    this.maximumSynergy = options.maximumSynergy || this.profile.defaultMaximumSynergy;
    this.maximumIndividualSynergy = options.maximumIndividualSynergy || this.profile.defaultMaximumIndividualSynergy;
    this.maximumSpill = options.maximumSpill || this.profile.defaultMaximumSpill;
    this.initialOffset = options.initialOffset || this.profile.defaultInitialOffset;
    this.maximumOffset = options.maximumOffset || this.profile.defaultMaximumOffset;

    Math.seedrandom(this.seed);

    this.random_number = Math.random()
    console.log(this.random_number)
};

//Main entry point
BingoGenerator.prototype.makeCard = function () {
    console.log("Making a card...")
    // set up the bingo board by filling in the difficulties based on a magic square
    this.bingoBoard = this.generateMagicSquare();

    // fill in the goals of the board in a random order
    var populationOrder = this.generatePopulationOrder();
    console.log(`Population order: ${populationOrder}`)
    for (var i = 1; i <= 25; i++) {
        var nextPosition = populationOrder[i];

        var result = this.chooseGoalForPosition(nextPosition);

        if (result.goal) {
            console.log(`Pos ${nextPosition}: ${result.goal[this.language]} (time: ${result.goal.time} selfsynergy: ${result.goal.types.selfsynergy})`)
            // copy the goal data into the square
            this.bingoBoard[nextPosition].types = result.goal.types;
            this.bingoBoard[nextPosition].subtypes = result.goal.subtypes;
            this.bingoBoard[nextPosition].rowtypes = result.goal.rowtypes;
            this.bingoBoard[nextPosition].name = result.goal[this.language] || result.goal.name;
            this.bingoBoard[nextPosition].id = result.goal.id;
            this.bingoBoard[nextPosition].time = result.goal.time;
            this.bingoBoard[nextPosition].goal = result.goal;

            // also copy the synergy
            this.bingoBoard[nextPosition].synergy = result.synergy;
        }
        else {
            return false;
        }
    }

    return this.bingoBoard;
};

/**
 * Generate an initial magic square of difficulties based on the random seed
 * @returns {Array}
 */
BingoGenerator.prototype.generateMagicSquare = function () {
    var magicSquare = [];

    for (var i = 1; i <= 25; i++) {
        var difficulty = this.difficulty(i);

        magicSquare[i] = {
            difficulty: difficulty,
            desiredTime: difficulty * this.timePerDifficulty
        };
    }

    return magicSquare;
};

/**
 * Given a position on the board, chooses a goal that can be placed in that position without
 * blowing our synergy budget.
 * @param position  the position on the board that we want to find a goal for
 * @returns  {goal, synergy} or false
 */
BingoGenerator.prototype.chooseGoalForPosition = function (position) {
    var desiredDifficulty = this.bingoBoard[position].difficulty;
    var desiredTime = desiredDifficulty * this.timePerDifficulty;

    // scan through the acceptable difficulty ranges
    for (var offset = this.initialOffset; offset <= this.maximumOffset; offset++) {
        var minTime = desiredTime - offset;
        var maxTime = desiredTime + offset;

        var goalsAtTime = this.getGoalsInTimeRange(minTime, maxTime);
        goalsAtTime = goalsAtTime.shuffled();
        console.log(`Found ${goalsAtTime.length} goals in range ${minTime}, ${maxTime} for desired time ${desiredTime} (diff: ${desiredDifficulty})`)

        // scan through each goal at this difficulty level
        for (var j = 0; j < goalsAtTime.length; j++) {
            var goal = goalsAtTime[j];

            // don't allow duplicates of goals
            if (this.hasGoalOnBoard(goal)) {
                continue;
            }

            if (this.hasChildAfterStart(goal, position)) {
                continue;
            }

            // in blackout mode, don't allow goals that conflict with each other, e.g. 8 hearts and 9 hearts,
            // even if they are in different rows
            if (this.mode === 'blackout' || this.mode === 'path') {
                if (this.hasConflictsOnPartOfBoard(goal, position)) {
                    continue;
                }
            }

            var synergies = this.checkLine(position, goal);

            var goalWithSynergy = { goal: goal, synergy: synergies.maxSynergy }
            
            // No synergy check needed for unused goal at position 23
            if (position === 23) {
                return goalWithSynergy
            }

            if (this.maximumSynergy >= synergies.maxSynergy && synergies.minSynergy >= this.minimumSynergy) {


                console.log(`>Pos ${position}: ${goal.name} (time: ${goal.time}, selfsynergy: ${goal.types.selfsynergy}, offset: ${offset})`)
            // 

                return goalWithSynergy;
            }
            /*return {goal: goal, synergy: synergies.maxSynergy};*/
        }
    }

    return false;
};

/**
 * Generate a semi-random order to populate the bingo board goals in
 * @returns {Array}
 */
BingoGenerator.prototype.generatePopulationOrder = function () {
    //giuocob 19-2-13: this.bingoBoard is no longer populated left to right:
    //It is now populated mostly randomly, with high difficult goals and
    //goals on the diagonals out in front

    //Populate start goals
    var populationOrder = [];
    populationOrder[1] = 18;

    var startTiles = [22, 24].shuffled();
    populationOrder = populationOrder.concat(startTiles);

    //Next populate endgoals
    var endgoals = [1, 2, 3, 4, 5].shuffled();
    populationOrder = populationOrder.concat(endgoals);

    //Then middle row
    var middle = [8, 13].shuffled();
    populationOrder = populationOrder.concat(middle);

    //Then second rows
    var second = [7, 9, 12, 14, 17, 19].shuffled();
    populationOrder = populationOrder.concat(second);

    //Finally outer rows
    var outer = [6, 10, 11, 15, 16, 20, 21, 25].shuffled()
    populationOrder = populationOrder.concat(outer);

    //Empty start goal last
    var last = [23]
    populationOrder = populationOrder.concat(last)

    return populationOrder;
};

// uses a magic square to calculate the intended difficulty of a location on the bingo board
BingoGenerator.prototype.difficulty = function (i) {

    let difficulties = [
        [15, 17, 23, 16, 14],
        [3, 5, 6, 5, 2],
        [4, 7, 11, 8, 6],
        [8, 10, 14, 9, 7],
        [9, 13, 20, 15, 11]
    ]

    if (this.random_number > 0.5) {
        this.mirrorDifficulties(difficulties)
    }

    return difficulties.flat()[i - 1]
};

BingoGenerator.prototype.mirrorDifficulties = function(board) {
    board.forEach(row => row.reverse())
}


//Given a difficulty as an argument, find the square that contains that difficulty
BingoGenerator.prototype.getDifficultyIndex = function (difficulty) {
    for (var i = 1; i <= 25; i++) {
        if (this.bingoBoard[i].difficulty == difficulty) {
            return i;
        }
    }
    return 0;
};

/**
 * Returns all of the goals in the goalsList that have a time value in the range [minTime, maxTime]
 * (the range is inclusive on both ends).
 * Does not take into account any synergy between goals.
 * @param minTime  the minimum acceptable time, inclusive
 * @param maxTime  the maximum acceptable time, inclusive
 * @returns {Array.<T>}  sorted array of goals within the range of times
 */
BingoGenerator.prototype.getGoalsInTimeRange = function (minTime, maxTime) {
    // if linear scan ends up being too slow, we can optimize this by finding the min using binary search
    // and bailing out early after the first goal exceeds maxTime

    return this.goalsList.filter(function (goal) {
        // adding negative self synergy to times to make collecting goals longer (can't prepare for them in path-bingo)
        let adjustTime = goal.time - (goal.types.selfsynergy * 1.5)
        return minTime <= adjustTime && adjustTime <= maxTime;
    });
};

/**
 * Returns true if the given goal has already been placed on the board.
 * Does so by checking against the ids of goals already on the board. Therefore relies on
 * different goals having different id fields.
 * @param goal  the goal to check for
 * @returns {boolean}  true if the goal is on the board, false otherwise
 */
BingoGenerator.prototype.hasGoalOnBoard = function (goal) {
    for (var i = 1; i <= 25; i++) {
        if (this.bingoBoard[i].id === goal.id) {
            return true;
        }
    }

    return false;
};

/**
 * Returns true if the the goal requires child and the given position is one of the start tiles.
 * Apart from the start tiles, no goal should require child to avoid forcing going back in time.
 * @param goal  the goal to check for
 * @param position the position on the board where the goal may be palced
 * @returns {boolean}  true if the goal requires child outside of start position, false otherwise
 */
BingoGenerator.prototype.hasChildAfterStart = function (goal, position) {
    const startTiles = [18, 22, 24]
    return (goal.pathvars.aschild === 1) && !startTiles.includes(position)
};



/**
 * Returns true if there are goals that conflict with the given goal anywhere on the board.
 * This is intended for helping to generate better blackout cards.
 * @param goal  the goal to check for conflicts with (not already on the board)
 * @returns {boolean} true if the board contains goals that conflict with the given goal
 */
BingoGenerator.prototype.hasConflictsOnPartOfBoard = function (goal, position) {

    function onSameBoardPart(pos1, pos2) {
        const colPos1 = ((pos1 - 1) % 5) + 1
        const colPos2 = ((pos2 - 1) % 5) + 1

        return (colPos1 <= 3 && colPos2 <= 3) || (colPos1 >=3 && colPos2 >= 3)
    }


    for (var i = 1; i <= 25; i++) {
        var square = this.bingoBoard[i];

        if (square.goal ) {
            var squares = [goal, square.goal];
            var synergy = this.evaluateSquares(squares, false, true);
  
            if (synergy >= TOO_MUCH_SYNERGY) {
                console.log(`conflict: ${goal.name} (for pos ${position}) has too much synergy with ${square.goal.name} on the board! Synergy: ${synergy}`)
                return true;
            }
        }
    }

    return false;
};

/**
 * Return the squares in the given row *EXCEPT* the square at the given position.
 *
 * for example, getOtherSquares("row1", 4) would return the squares at positions [1, 2, 3, 5],
 * but not the square at position 4.
 *
 * @param row  the row on the board to pull squares from
 * @param position  the position to ignore
 * @returns {*|Array}
 */
BingoGenerator.prototype.getOtherSquares = function (row, position) {
    var rowIndices = INDICES_PER_ROW[row].filter(function (index) {
        return index != position;
    });

    var board = this;

    return rowIndices.map(function (index) {
        return board.bingoBoard[index];
    });
};

/**
 * Given a position on the board and a potential goal, determines the maximum amount of synergy that
 * any row containing the position would have
 * @param position  the position on the bingo board
 * @param potentialGoal  the goal that we're considering adding to the position
 * @returns {number}  the maximum synergy that the goal would have at that position
 */
BingoGenerator.prototype.checkLine = function (position, potentialGoal) {
    var rows = ROWS_PER_INDEX[position];
    var maxSynergy = 0;
    var minSynergy = TOO_MUCH_SYNERGY;

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];

        // include the desired difficulty along with the goal to make the "potential square"
        // because we use desired time now for calculating "difficulty" synergy
        var potentialSquare = JSON.parse(JSON.stringify(potentialGoal));
        potentialSquare.desiredTime = this.bingoBoard[position].desiredTime;

        // get the list of other squares in the row and append the potential one
        var potentialRow = this.getOtherSquares(row, position);
        potentialRow.push(potentialSquare);

        var effectiveRowSynergy = this.evaluateSquares(potentialRow);

        maxSynergy = Math.max(maxSynergy, effectiveRowSynergy);
        minSynergy = Math.min(minSynergy, effectiveRowSynergy);
    }

    return {
        minSynergy: minSynergy,
        maxSynergy: maxSynergy
    };
};

/**
 * Given a row, calculates the effective synergy between the squares in the row.
 * @param row  the string name of the row to check
 * @returns {number}
 */
BingoGenerator.prototype.evaluateRow = function (row, log = false) {
    return this.evaluateSquares(this.getOtherSquares(row), log = log);
};


/**
 * Given an array of squares, calculates the effective synergy between the squares.
 * This is determined using the type and subtype information of the goals in each square.
 * @param squares
 */
BingoGenerator.prototype.evaluateSquares = function (squares, log = false, conflict_log=false) {
    // bail out if there are duplicate goals
    // NOTE: keep this in addition to the duplicate checking from chooseGoalForPosition
    // because this still detects cases from hardcoded boards for analysis
    var ids = squares.map(function (el) { return el.id; }).filter(function (el) { return el; });
    if (hasDuplicateStrings(ids)) {
        return TOO_MUCH_SYNERGY;
    }

    if (log) {
        console.log("--- evaluate these squares:")
        console.log(squares.map(sq => sq.name))
        console.log(squares)
    }

    var synergiesForSquares = this.calculateSynergiesForSquares(squares);
    return this.calculateEffectiveSynergyForSquares(synergiesForSquares, log = log, conflict_log=conflict_log);
};

// aggregates type synergy data from the squares in a row for later use
BingoGenerator.prototype.calculateSynergiesForSquares = function (squares) {
    // a map of type -> list of type synergy values
    var typeSynergies = {};
    // a map of subtype -> list of subtype synergy values
    var subtypeSynergies = {};
    // a map of rowtype -> list of rowtype synergy values
    var rowtypeSynergies = {};
    // list of differences between desiredTime and actual time
    var timeDifferences = [];

    for (var m = 0; m < squares.length; m++) {
        var square = squares[m];

        this.mergeTypeSynergies(typeSynergies, square.types);
        this.mergeTypeSynergies(subtypeSynergies, square.subtypes);
        this.mergeTypeSynergies(rowtypeSynergies, square.rowtypes);

        // can't add a time difference for squares that are empty (since it's undefined)
        if (square.time !== undefined && square.desiredTime !== undefined) {
            // add negative selfsynergy to goals to make collect goals seem longer
            const adjustTime = square.time - (square.types.selfsynergy * 1.5)
            timeDifferences.push(square.desiredTime - adjustTime);
        }
    }

    return {
        typeSynergies: typeSynergies,
        subtypeSynergies: subtypeSynergies,
        rowtypeSynergies: rowtypeSynergies,
        goals: squares,
        timeDifferences: timeDifferences
    };
};

// helper method for implementing calculateSynergiesForSquares
BingoGenerator.prototype.mergeTypeSynergies = function (typeSynergies, newTypeSynergies) {
    for (var type in newTypeSynergies) {
        if (!typeSynergies[type]) {
            typeSynergies[type] = [];
        }

        typeSynergies[type].push(newTypeSynergies[type]);
    }
};

BingoGenerator.prototype.calculateCombinedTypeSynergies = function (synergiesForSquares) {
    var typeSynergies = synergiesForSquares.typeSynergies;
    var subtypeSynergies = synergiesForSquares.subtypeSynergies;

    var combinedTypeSynergies = {};

    // Check each subtype found to see if there is a matching type somewhere in the row
    // If so, add the subtype to the grand list
    for (var type in typeSynergies) {
        if (type in subtypeSynergies) {
            combinedTypeSynergies[type] = typeSynergies[type].concat(subtypeSynergies[type]);
        }
        else {
            combinedTypeSynergies[type] = typeSynergies[type];
        }
    }

    return combinedTypeSynergies;
};

/**
 * Filters rowtypeSynergies to only include entries that are present in every square of the board
 * @param synergiesForSquares
 */
BingoGenerator.prototype.filterRowtypeSynergies = function (synergiesForSquares) {
    var rowtypeSynergies = {};

    for (var rowtype in synergiesForSquares.rowtypeSynergies) {
        var rowtypeSynergy = synergiesForSquares.rowtypeSynergies[rowtype];

        // don't count it yet until we've filled up the entire row
        if (rowtypeSynergy.length < SQUARES_PER_ROW) {
            continue;
        }

        var rowtypeCost = 0;
        for (var i = 0; i < rowtypeSynergy.length; i++) {
            rowtypeCost += rowtypeSynergy[i];
        }

        var rowTypeThreshold = this.rowtypeTimeSave[rowtype];
        // "regular" row type synergy
        if (rowTypeThreshold > 0 && rowTypeThreshold > rowtypeCost) {
            rowtypeSynergies[rowtype] = rowTypeThreshold - rowtypeCost;
        }
        // "reverse" row type synergy
        else if (rowTypeThreshold < 0 && rowTypeThreshold > rowtypeCost) {
            rowtypeSynergies[rowtype] = rowtypeCost - rowTypeThreshold;
        }
    }

    return rowtypeSynergies;
};

BingoGenerator.prototype.calculateEffectiveTypeSynergies = function (typeSynergies) {
    var effectiveTypeSynergies = {};

    for (var type in typeSynergies) {
        var synergies = typeSynergies[type];

        var effectiveSynergies = this.filterSynergyValuesForType(type, synergies);

        if (effectiveSynergies.length > 0) {
            effectiveTypeSynergies[type] = effectiveSynergies;
        }
    }

    return effectiveTypeSynergies;
};

// Uses Synfilters (see goallist, works on endon, childchus )
// else: removes highest element of list!
BingoGenerator.prototype.filterSynergyValuesForType = function (type, synergies) {
    synergies.sortNumerically();

    var filter = this.synergyFilters[type] || "";
    if (/^min/.test(filter)) {
        var count = Number(filter.split(" ")[1]);
        return synergies.slice(0, count);
    }
    else if (/^max/.test(filter)) {
        var count = Number(filter.split(" ")[1]);
        synergies.reverse();
        return synergies.slice(0, count);
    }
    else {
        return synergies.slice(0, -1);
    }
};

// given aggregated type synergies for the row, calculates the effective synergy for that row
BingoGenerator.prototype.calculateEffectiveSynergyForSquares = function (synergiesForSquares, log = false, conflict_log=false) {

    if (log) {
        console.log("synergiesForSquares:")
        console.log(synergiesForSquares)
    }

    // Adds only the subtypes that also appear in types to types
    var typeSynergies = this.calculateCombinedTypeSynergies(synergiesForSquares);

    if (log) {
        console.log("combined Type Synergies:")
        console.log(typeSynergies)
    }

    var rowtypeSynergies = this.filterRowtypeSynergies(synergiesForSquares);

    // Assess final row synergy by removing the largest element from each type and adding the rest
    var effectiveTypeSynergies = this.calculateEffectiveTypeSynergies(typeSynergies);

    // total synergy in the row
    var rowSynergy = 0;

    if (log) {
        console.log("combined Effective Type Synergies:")
        console.log(effectiveTypeSynergies)

        console.log("filtered row type synergies")
        console.log(rowtypeSynergies)
        if (Object.keys(rowtypeSynergies).length !== 0 || rowtypeSynergies.constructor !== Object) {
            console.log("NON-EMPTY ROWTYPESYNERGYYYYYYYYYYYYYYYYYYYYYYYYYY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!______________________________________________________________________")
        }
    }

    // by this point we've already filtered out the highest value synergy in
    // calculateEffectiveTypeSynergies(), so just sum the synergies and return the value
    for (var type in effectiveTypeSynergies) {
        var synergies = effectiveTypeSynergies[type];

        for (var i = 0; i < synergies.length; i++) {
            if (synergies[i] > this.maximumIndividualSynergy) {
                if (conflict_log) {
                    console.log(`conflict synergy: ${synergies[i]}`)
                }
                return TOO_MUCH_SYNERGY;
            }

            rowSynergy += synergies[i];
        }
    }

    if (log) {
        console.log(`rowSynergies types: ${rowSynergy}`)
    }

    // we've already prefiltered/calculated these values, so just add them up
    // see filterRowtypeSynergies for details
    for (var rowtype in rowtypeSynergies) {
        rowSynergy += rowtypeSynergies[rowtype];
    }

    if (log) {
        console.log(`rowSynergies types AND rowtypes: ${rowSynergy}`)
    }


    var timeDifferences = synergiesForSquares.timeDifferences;
    // here's where we factor in expected time vs desired time:
    for (var i = 0; i < timeDifferences.length; i++) {
        // this is desiredTime - actualTime, so a positive value means a goal that is faster than desired
        var timeDifference = timeDifferences[i];

        rowSynergy += timeDifference;
    }

    return rowSynergy;
};


// preserve this function name for compatibility with existing code
export const ootBingoGenerator = function (bingoList, opts) {

    var bingoGenerator = new BingoGenerator(bingoList, opts);

    // repeatedly attempt to generate a card until it succeeds, bailing out after 10 fails
    var card = false;
    var iterations = 0;
    while (!card && iterations < 10) {
        card = bingoGenerator.makeCard();
        iterations++;
    }

    card["meta"] = { iterations: iterations };

    /*Object.keys(INDICES_PER_ROW).forEach(row => console.log(`${row}: ${bingoGenerator.evaluateRow(row, true)}`))*/

    return card;
};