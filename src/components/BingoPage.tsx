import React from "react"
import AboutBingo from "./AboutBingo"
import BingoCard from "./BingoCard"




function BingoPage() {
    /*const bingoContent = boardRevealed? <BingoCard/> : <ClickToReveal onClick = {onClick} />*/

    return (
        <div id="bingoPage">
            <AboutBingo />
            <BingoCard/>
        </div>
    )
}

export default BingoPage