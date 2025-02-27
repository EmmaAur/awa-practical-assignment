/*
Sources:
1. vertical scrolling: https://stackoverflow.com/questions/71107467/how-to-implement-vertical-scrolling-of-a-grid-items-within-a-grid-in-material-ui
2. double click: https://medium.com/@zahidbashirkhan/implementing-double-click-to-edit-text-in-react-2e1d4bcb2493
*/

import { useEffect, useState } from "react"
import { Avatar, Button, Card, CardHeader, Grid2, IconButton, MenuItem, MenuList, TextField } from '@mui/material'
import '../styles/board.css'
import ColumnCards from "./ColumnCards";
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface IColumn {
    owner: string,
    columnname: string,
    cards: [string],
    createdAt: Date,
    _id: string
}

const Board = () => {
    const [columns, setColumns] = useState<IColumn[]>([]) // For fetching column data
    const [columnsOrder, setColumnsOrder] = useState<string[]>([])

    const [menuid, setMenuid] = useState<string>("") // For toggling menu visible / not visible
    const [renameid, setRenameid] = useState<string>("") // for toggling rename field visible / not visible
    const [columnName, setColumnName] = useState<string>("")
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

    const toggleRename = (cardid: string) => {
        // Used when user wants to rename a card.
        if (renameid != "") {
            setRenameid("")
        } else {
            setRenameid(cardid)
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

            const lista: string[] = []
            data.columns.forEach((column: { _id: string; }) => {
                lista.push(column._id)
            });
            setColumnsOrder(lista)

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
        
            const data = await response.json()
            setColumns(data.columns)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

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
        <>
            <div>
                <Button variant="outlined" onClick={() => addColumn()}>Add new column</Button>
            </div>

            <Grid2 
                container
                direction="row" 
                rowSpacing={1}
                className="grid-container">
                
                {columns.map((column) => (
                    <Card
                    variant="outlined"
                    className="grid-item"
                    sx={{ width: 250, maxWidth: 1, height: "100%"}}
                    key={column['_id']}
                    > 
                    {!(renameid===column['_id']) ? (<>
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
                        </>):(<>
                            <TextField 
                                required 
                                className="text-input"
                                variant="standard"
                                placeholder='Column name'
                                onChange={(e) => {setColumnName(e.target.value)}}>
                            </TextField>
                            <Button onClick={() => {toggleRename(column['_id']), renameColumn(column['_id'])}}>Save</Button>
                            <Button onClick={() => {toggleRename(column['_id'])}}>Discard</Button>
                        </>)}

                        {!(menuid===column['_id']) ? (<></>):(<>
                            <MenuList>
                                <MenuItem onClick={() => {toggleMenu(column['_id']), deleteColumn(column['_id'])}}>Delete</MenuItem>
                                <MenuItem onClick={() => {toggleMenu(column['_id']), toggleRename(column['_id'])}}>Rename</MenuItem>
                            </MenuList>
                        </>)}
                        
                        <ColumnCards columnid={column['_id']} columns={columnsOrder}></ColumnCards>
                    </Card>
                ))}
            </Grid2>
        </>
    );
};
export default Board
