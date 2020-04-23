import React, { useState } from "react"
import BingoBoard from "./BingoBoard"
import {generateBoard} from "../generator/board-to-array"
import BingoInfo from "./BingoInfo";


const seed = parseInt(new URLSearchParams(window.location.search).get("seed") || "-1");
if (seed === -1) {
    window.location.href = `?seed=${Math.floor(Math.random() * 999999)}`
}

const goals = generateBoard(seed, "path");


function BingoCard() {

    const [goalsCompleted, setGoalsCompleted] = useState(0);
    const onGreen = () =>  setGoalsCompleted(goalsCompleted + 1)
    const onRed   = () =>  setGoalsCompleted(goalsCompleted - 1)




    const board = seed === -1? <></> : <><BingoBoard goals = {goals} seed = {seed} onGreen = {onGreen} onRed = {onRed}/>
                                         <BingoInfo seed = {seed} goalsCompleted = {goalsCompleted}/></>

    return (
        <>
        {board}
        </>
    )
}

export default BingoCard