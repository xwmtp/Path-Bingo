import { ootBingoGenerator } from "./generator";
import { bingoList } from "./goallist";
import { goalAdditions } from "./goallist-additions"


export function generateBoard(seed, mode) {
    var bingoFunc = ootBingoGenerator;

    const bingoOpts = {
        seed: seed.toString(),
        mode: mode,
        lang: "name",
    };

    const fullBingoList = addAdditionalGoalInfo(goalAdditions)
    console.log(fullBingoList)

    const board = (bingoFunc(fullBingoList, bingoOpts))
        .map(goal => goal.name);
    board.shift();
    return board;
}


function addAdditionalGoalInfo(additions) {
    return addAdditions(readAdditions(additions), bingoList)
}

function readAdditions(csv) {
    var lines = csv.split(";");

    const headers = lines[0].split(":");
    const additions = {};

    for (var i = 1; i < lines.length; i++) {

        var currentLine = lines[i].split(":");

        const goal = currentLine[0]
        additions[goal] = {}

        for (var j = 1; j < currentLine.length; j++) {
            additions[goal][headers[j]] = parseInt(currentLine[j])
        }
    }
    console.log(additions)
    return additions
}

function addAdditions(additions, goalList) {
    for (const goalName in additions) {
        const values = additions[goalName]
        let goals = goalList["normal"][values.difficulty]
        for (let i = 0; i < goals.length; i++) {
            if (goals[i].name.toLowerCase() === goalName.toLowerCase()) {
                goalList["normal"][values.difficulty][i]["pathvars"] = {}
                for (const header in values) {
                    if (header !== "difficulty") {
                        goalList["normal"][values.difficulty][i]["pathvars"][header] = values[header];
                    }
                }
            }
        }
    }
    return goalList;
}