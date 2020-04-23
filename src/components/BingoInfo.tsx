import React from "react"

interface BingoInfoProps {
    seed : number;
    goalsCompleted : number;
}

function BingoInfo(props: BingoInfoProps) {

   
    return (
        <div id="results">
            <p>Seed: <strong>{props.seed}</strong></p>
        </div>
    )
}

export default BingoInfo