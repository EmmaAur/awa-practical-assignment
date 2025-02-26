/*
Sources:
1. vertical scrolling: https://stackoverflow.com/questions/71107467/how-to-implement-vertical-scrolling-of-a-grid-items-within-a-grid-in-material-ui
*/

import { useEffect, useState } from "react"
import { Button, Card, Container, Grid2 } from '@mui/material'
import '../styles/board.css'
import ColumnCard from "./ColumnCard";

interface IColumn {
    owner: string,
    columnname: string,
    createdAt: Date
}

const Board = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [token, setToken] = useState<string | null>(null)
    const [newcolumnName, setNewcolumnName] = useState<string>("")

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            fetchColumns()
        }
    }, [token])

    const fetchColumns = async () => {

        try {
            const response = await fetch('http://localhost:3000/api/columns', {
                method: "GET",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                 }
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }

            const data = await response.json()
            console.log(data.columns)

            setColumns(data.columns)
            console.log(columns)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
        
    }

    const addColumn = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/newcolumn", {
                method: "GET",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
        
            fetchColumns()

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    return (
        <>
            <div>
                <Button onClick={() => fetchColumns()}>Fetch columns</Button>
                <Button onClick={() => addColumn()}>Add new column</Button>
            </div>

            <Grid2 
                container
                direction="row" 
                rowSpacing={1} 
                //sx={{ overflowX: "scroll", width: 'auto' }} 
                className="grid-container">
                
                {columns.map((column) => (
                    <Card
                    className="grid-item"
                    sx={{ overflowY: "scroll", xs: 2, sm: 3, md: 4 , maxWidth: 1}}
                    key={column['columnname']}
                    >
                        
                        <h3>{column['columnname']}</h3>
                        <p>{column['owner']}</p>


                        <Button onClick={() => {
                            <ColumnCard></ColumnCard>
                        }}>Add new card</Button>
                    </Card>)
                )}
            
            </Grid2>
        </>
    );
};
export default Board
