/*
Sources:
1. vertical scrolling: https://stackoverflow.com/questions/71107467/how-to-implement-vertical-scrolling-of-a-grid-items-within-a-grid-in-material-ui
2. double click: https://medium.com/@zahidbashirkhan/implementing-double-click-to-edit-text-in-react-2e1d4bcb2493
*/

import { useEffect, useState } from "react"
import { Avatar, Button, Card, CardHeader, Container, Grid2, IconButton, MenuItem, MenuList, TextField, Typography } from '@mui/material'
import '../styles/board.css'
import Cards from "./Cards";
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface IColumn {
    owner: string,
    columnname: string,
    cards: [string],
    createdAt: Date,
    _id: string
}

const Board = () => {
    const [columns, setColumns] = useState<IColumn[]>([])       // For updating column data
    const [menuid, setMenuid] = useState<string>("")            // For toggling menu visible / not visible
    const [renameid, setRenameid] = useState<string>("")        // For toggling rename field visible / not visible
    const [columnName, setColumnName] = useState<string>("")    // Used for userinput when editing column name
    const [token, setToken] = useState<string | null>(null)     // Used to get the jwt from browser storage

    // Getting jwt from browser storage
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            fetchData()
        }
    }, [token])

    // Toggle tools to hide/show components based on matching id's
    const toggleMenu = (cardid: string) => {
        if (menuid != "") {
            setMenuid("")
        } else {
            setMenuid(cardid)
        }
    }
    const toggleRename = (cardid: string) => {
        // Used when user wants to rename a card.
        if (renameid != "") {
            setRenameid("")
        } else {
            setRenameid(cardid)
        }
    }
    // Toggle tools end

    // Fetches columns and updates columns usestate.
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

    // Sends nothing to backend, receives the updated list of columns and updates columns usestate.
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
        
            const data = await response.json()
            setColumns(data.columns)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends the column id to backend and deletes it from the database.
    // Receives the updated list of columns and updates columns usestate.
    const deleteColumn = async (columnid: string) => {
        try {
            const response = await fetch("http://localhost:3000/columns/delete", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({columnid: columnid})
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

    // Sends columnid and the new column name to backend.
    // Receives the updated list of columns and updates columns usestate.
    const renameColumn = async (columnid: string) => {
        try {
            const response = await fetch('http://localhost:3000/columns/rename', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({columnid: columnid, newname: columnName})
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

    return (
        <Container>
            <div>
                <Button variant="outlined" onClick={() => addColumn()} style={{marginTop: 20}}>Add new column</Button>
                <Typography></Typography>
            </div>

            <Grid2 
                container
                direction="row" 
                rowSpacing={1}
                className="grid-container"
                onDrop={() => {fetchData()}}
                >
                
                {columns.map((column) => (
                    <Card
                        id={column['_id']}
                        variant="outlined"
                        className="grid-item"
                        sx={{ width: 250, maxWidth: 1, height: "100%"}}
                        key={column['_id']}

                    >
                    {!(renameid===column['_id']) ? ( // Shows card header or a text field for renaming the column
                        <>
                            <CardHeader
                                onDoubleClick={() => {toggleRename(column['_id'])}}
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
                                subheader={column['createdAt'].toString().split("T")[0]}
                            />
                        </>):(
                        <>
                            <TextField 
                                required 
                                className="text-input"
                                variant="standard"
                                placeholder='Column name'
                                defaultValue={column['columnname']}
                                onChange={(e) => {setColumnName(e.target.value)}}>
                            </TextField>
                            <Button onClick={() => {toggleRename(column['_id']), renameColumn(column['_id'])}}>Save</Button>
                            <Button onClick={() => {toggleRename(column['_id']), setColumnName(column['columnname'])}}>Discard</Button>
                        </>)}

                        {!(menuid===column['_id']) ? (<></>):( // Show either nothing or the column menu
                        <>
                            <MenuList>
                                <MenuItem onClick={() => {toggleMenu(column['_id']), deleteColumn(column['_id'])}}>Delete</MenuItem>
                                <MenuItem onClick={() => {toggleMenu(column['_id']), toggleRename(column['_id'])}}>Rename</MenuItem>
                            </MenuList>
                        </>)}
                        
                        <Cards columnid={column['_id']}></Cards>
                    </Card>
                ))}
            </Grid2>
        </Container>
    );
};
export default Board
