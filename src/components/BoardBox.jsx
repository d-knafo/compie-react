import React from 'react'

export const BoardBox = (props) => {
    return (
        <button className="board__box" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
