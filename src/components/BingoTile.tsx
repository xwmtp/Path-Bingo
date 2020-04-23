import React from "react"

interface BingoTileProps {
    rows: string[],
    color: string,
    goal: string,
    hidden: boolean,
    onClick: () => void
}

function BingoTile(props:BingoTileProps) {

    let classes = props.rows;
    classes.push("tile")

    let onClick = props.onClick
    let goalName = props.goal

    //endgoal
    if (props.rows.includes("row1")) {
        classes.push("endgoal")
    }


    if (props.rows.includes("row1") && props.hidden) {
            classes.push("empty");
            onClick = () => {};
            goalName = props.rows.includes("col3")? "End" : "";

    } else {
        if (props.color === "green") {
            classes.push("greensquare")
        }
        if (props.color === "red") {
            classes.push("redsquare")
        }
    
        if (props.hidden) {
            classes.push("hidden")
        }    
    }


    const className = classes.join(" ")

    return (
        <td className = {className} onClick={onClick}>
            {goalName}
        </td>
    )
}

export default BingoTile