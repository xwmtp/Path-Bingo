import React from "react"
import BingoTile from "./BingoTile"
import PopoutTile from "./PopoutTile"
import StartTile from "./StartTile";

interface BoardProps {
    goals: string[],
    seed: number,
    onGreen: () => void,
    onRed: () => void
}

interface BoardState {
    counters: number[]
}

class BingoBoard extends React.Component<BoardProps, BoardState> {

    constructor(props: BoardProps) {
        super(props);
        this.state = {
            counters: Array(25).fill(0)
        }
    }

    onTileClick(i: number) {
        this.incrementCounter(i)
        const newColor = this.calculateColor(i)
        if (newColor === "green") {
            this.props.onGreen();
        }
        if (newColor === "red") {
            this.props.onRed();
        }
    }

    incrementCounter(i: number) {
        let newCounters = this.state.counters
        newCounters[i] = newCounters[i] + 1
        this.setState({ counters: newCounters })
    }

    calculateRows(i: number) {
        const row = Math.floor(i / 5) + 1;
        const col = i % 5 + 1;

        let rows = [`row${row}`, `col${col}`]
        if (row === col) {
            rows = rows.concat("tlbr")
        }
        if (row + col === 6) {
            rows = rows.concat("bltr")
        }
        return rows
    }

    calculateColor(i: number) {
        if (this.state.counters[i] % 3 === 1) {
            return "green"
        }
        if (this.state.counters[i] % 3 === 2)
            return "red"
        return ""
    }

    boardIsHidden() {
        return this.state.counters.every(i => i === 0)
    }


    isHidden(i: number) {
        if (this.getStartTiles().includes(i)) {
            return false;
        }

        if (i === 22) {
            return true;
        }

        return !this.getAdjacentTiles(i)
            .map(tile => this.state.counters[tile])
            .some(counter => counter > 0)
    }

    getStartTiles() {
        return [17, 21, 23]
    }

    getAdjacentTiles(i: number): number[] {
        let adjacents: number[] = [];
        if (i > 4) {
            adjacents.push(i - 5);
        }
        if (i < 20) {
            adjacents.push(i + 5);
        }
        if (i % 5 !== 0 && i > 4) {
            adjacents.push(i - 1);
        }
        if (i % 5 !== 4 && i > 4) {
            adjacents.push(i + 1);
        }
        return adjacents;
    }

    allEndgoalsHidden() {
        return [0, 1, 2, 3, 4].every(tile => this.isHidden(tile))
    }

    render() {

        const createBingoTile = (i: number) => {
            return <BingoTile
                rows={this.calculateRows(i)}
                color={this.calculateColor(i)}
                goal={this.props.goals[i]}
                hidden={this.isHidden(i)}
                onClick={() => this.onTileClick(i)}
                key={i}
            />
        }


        return (
            <div id="results">
                <table id="bingo">
                    <tbody>
                        <tr>
                            <PopoutTile name="tl-br" />
                            <PopoutTile name="col1" />
                            <PopoutTile name="col2" />
                            <PopoutTile name="col3" />
                            <PopoutTile name="col4" />
                            <PopoutTile name="col5" />
                        </tr>

                        <tr>
                            <PopoutTile name="row1" />
                            {[0, 1, 2, 3, 4].map(createBingoTile)}
                        </tr>
                        <tr>
                            <PopoutTile name="row2" />
                            {[5, 6, 7, 8, 9].map(createBingoTile)}
                        </tr>
                        <tr>
                            <PopoutTile name="row3" />
                            {[10, 11, 12, 13, 14].map(createBingoTile)}
                        </tr>
                        <tr>
                            <PopoutTile name="row4" />
                            {[15, 16, 17, 18, 19].map(createBingoTile)}
                        </tr>
                        <tr>
                            <PopoutTile name="row5" />
                            {[20, 21].map(createBingoTile)}
                            {<StartTile/>}
                            {[23, 24].map(createBingoTile)}
                        </tr>
                        <tr>
                            <PopoutTile name="bl-tr" />
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    };
}

export default BingoBoard