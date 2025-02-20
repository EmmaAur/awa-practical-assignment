import { useEffect, useState } from "react"
import { Button } from '@mui/material'
import '../styles/Board.css'

const Board = () => {

    return (
        <>
            <div className="options">
                <Button>Add new column</Button>
                <Button></Button>
            </div>

            <div className="board-columns">
            </div>
        </>
    );
};
export default Board
