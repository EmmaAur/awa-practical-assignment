/*
Sources:
1. vertical scrolling: https://stackoverflow.com/questions/71107467/how-to-implement-vertical-scrolling-of-a-grid-items-within-a-grid-in-material-ui
*/

import { useEffect, useState } from "react"
import { Avatar, Button, Card, CardHeader, Grid2, IconButton, MenuItem, MenuList } from '@mui/material'
import '../styles/board.css'
import ColumnCards from "./ColumnCards";
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface IColumn {
    owner: string,
    columnname: string,
    createdAt: Date,
    _id: string
}

interface IComment {

}

const Board = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [menuid, setMenuid] = useState<string>("")
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            fetchData()
        }
    }, [token])

    const toggleMenu = (cardid: string) => {
        if (menuid != "") {
            setMenuid("")
        } else {
            setMenuid(cardid)
        }
    }

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/columns/fetchdata', {
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
            setColumns(data.columns)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
        
    }

    const addColumn = async () => {
        try {
            const response = await fetch("http://localhost:3000/columns/add", {
                method: "GET",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
        
            fetchData()

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    const deleteColumn = async (columnid: string) => {
        setMenuid("") // reset the menuid toggle
        try {
            const response = await fetch("http://localhost:3000/columns/delete", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
        
            fetchData()

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    return (
        <>
            <div>
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
                    variant="outlined"
                    className="grid-item"
                    sx={{ width: 250, maxWidth: 1, height: "100%"}}
                    key={column['_id']}
                    > 
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: "black" }}>
                                    {column['owner'][0] /* set username's first letter as avatar */}
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings" onClick={() => {toggleMenu(column['_id'])}}>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={column['columnname']}
                            subheader={column['owner']}
                        />

                        {!(menuid===column['_id']) ? (<></>):(<>
                            <MenuList>
                                <MenuItem onClick={() => {toggleMenu(column['_id']), deleteColumn(column['_id'])}}>Delete</MenuItem>
                                <MenuItem onClick={() => {}}>Rename</MenuItem>
                            </MenuList>
                        </>)}
                        <ColumnCards columnid={column['_id']}></ColumnCards>
                    </Card>
                ))}
            </Grid2>
        </>
    );
};
export default Board
