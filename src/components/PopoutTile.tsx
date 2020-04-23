import React from "react"

interface PopoutProps {
    name: string
}

function PopoutTitle(props:PopoutProps) {

    return (
        <td className = "popout">
            {props.name}
        </td>
    )
}

export default PopoutTitle