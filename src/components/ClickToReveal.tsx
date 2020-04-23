import React from "react"


interface RevealProps {
    onClick : () => void;
}

function ClickToReveal(props:RevealProps) {


    return (
        <div id="clickToReveal" onClick={props.onClick}>
            Click to reveal
        </div>
    )
}

export default ClickToReveal