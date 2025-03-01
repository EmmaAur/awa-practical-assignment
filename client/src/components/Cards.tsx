/*
Sources
1. Replace letter on array: https://stackoverflow.com/questions/39624581/javascript-replace-characters-of-an-element-in-an-array
2. Card drag and drop: https://www.youtube.com/watch?v=u65Y-vqYNAk
*/

import React, { useEffect, useState } from 'react'
import '../styles/columncard.css'
import { Button, Card, CardContent, CardHeader, IconButton, MenuItem, MenuList, TextField, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Comments from './Comments'

interface ICard {
    title: string,
    content: string,
    color: string,
    order: number,
    columnid: string,
    lastEdited: Date,
    createdAt: Date,
    _id: string
}

interface CardProps {
    columnid: string
}

const Cards: React.FC<CardProps> = ({columnid}) => {
    const [cards, setCards] = useState<ICard[]>([])                                 // For updating card data
    const [menuid, setMenuid] = useState<string>("")                                // For toggling card menu visible / not visible
    const [renameid, setRenameid] = useState<string>("")                            // For toggling rename field visible / not visible
    const [editContent, setEditContent] = useState<string>("")                      // For toggling card content editing field visible / not visible

    const [changeColor, setChangeColor] = useState<string>("")                      // Used for userinput when changing card color
    const [cardName, setCardsName] = useState<string>("New card")                   // Used for userinput when editing card title
    const [cardContent, setCardsContent] = useState<string>("This is a new card.")  // Used for userinput when editing column content

    const [token, setToken] = useState<string | null>(null)                         // Used to get the jwt from browser storage
    
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
            toggleChangeColor("")
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

    const toggleEditContent = (cardid: string) => {
        // Used when user wants to edit the contents of a card.
        if (editContent != "") {
            setEditContent("")
        } else {
            setEditContent(cardid)
        }
    }

    const toggleChangeColor = (cardid: string) => {
        if (changeColor != "") {
            setChangeColor("")
        } else {
            setChangeColor(cardid)
        }
    }
    // Toggle tools end

    // Sends columnid to backend and fetches cards matching the columnid. Updates cards usestate.
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/cards/fetchdata', {
                method: "POST",
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
            setCards(data.cards)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
        
    }

    // Sends columnid to backend, receives the updated list of cards and updates cards usestate.
    const addCards = async () => {
        try {
            const response = await fetch("http://localhost:3000/cards/add", {
                method: "POST",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({"columnid": columnid})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
            
            const data = await response.json()
            setCards(data.cards)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends the card id to backend and deletes it from the database.
    // Receives the updated list of cards and updates cards usestate.
    const deleteCards = async (cardid: string) => {
        try {
            const response = await fetch('http://localhost:3000/cards/delete', {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({cardid: cardid, columnid: columnid})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }

            const data = await response.json()
            setCards(data.cards)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends card id and the new card title to backend.
    // Receives the updated list of cards and updates cards usestate.
    const renameCard = async (cardid: string) => {
        try {
            const response = await fetch('http://localhost:3000/cards/rename', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({cardid: cardid, columnid: columnid, newtitle: cardName})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }

            const data = await response.json()
            setCards(data.cards)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends card id and the new card content to backend.
    // Receives the updated list of cards and updates cards usestate.
    const editCardContent = async (cardid: string) => { 
        try {
            const response = await fetch('http://localhost:3000/cards/updatecontent', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({cardid: cardid, columnid: columnid, newcontent: cardContent})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }

            const data = await response.json()
            setCards(data.cards)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends card id and the new color to backend.
    // Receives the updated list of cards and updates cards usestate.
    const changeCardColor = async (cardid: string, newcolor: string) => {
        try {
            const response = await fetch("http://localhost:3000/cards/updatecolor", {
                method: "POST",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({cardid: cardid, columnid: columnid, newcolor: newcolor})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
            
            const data = await response.json()
            setCards(data.cards)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends the card that's being dragged (cardfrom) and the card that the first card is dropped on (cardto) and sends them to backend.
    // Receives the updated list of cards and updates cards usestate.
    const reorderCards = async (cardfrom: ICard, cardto: ICard) => {
        try {
            const response = await fetch("http://localhost:3000/cards/reorder", {
                method: "POST",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ cardfrom: cardfrom, cardto: cardto })
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
            
            const data = await response.json()
            setCards(data.cards)
            
            // Refresh the page in order to update both of the columns affected by drag and drop
            if (data.columns) {
                window.location.href = "./board"
            }

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Drag and drop according to source 2.
    const handleOnDrag = (e: React.DragEvent, card: ICard) => {
        e.dataTransfer.setData("card", JSON.stringify(card))
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleOnDrop = (e: React.DragEvent, cardto: ICard) => {
        const cardfrom: ICard = JSON.parse(e.dataTransfer.getData("card")) // The card we're dragging
        console.log(cardfrom, cardto)
        if (cardfrom._id === cardto._id) {
            return
        }
        reorderCards(cardfrom, cardto)
    }
    // Drag and drop ends


    return (
        <>
            {cards.map((card) => (<>
                <Card 
                    className='card' 
                    key={card['_id']} 
                    style={{backgroundColor: card.color}} 
                    draggable
                    onDragStart={(e) => {handleOnDrag(e, card)}}
                    onDrop={(e) => {handleOnDrop(e, card)}}
                    onDragOver={(e) => {handleDragOver(e)}} // This is needed so that the drag and drop event doesn't end before it's complete
                >
                    {!(renameid===card['_id']) ? ( 
                    // Toggle open the card title rename field / card title
                    <>
                        <CardHeader 
                            onDoubleClick={() => setRenameid(card['_id'])}
                            action={<>
                                <IconButton key={card['_id']} aria-label="settings" onClick={() => {toggleMenu(card['_id'])}}>
                                    <MoreVertIcon />
                                </IconButton>
                            </>}
                            title={card.title}
                        />
                    </>):
                    (<>
                        <TextField 
                            required 
                            className="text-input"
                            variant="standard"
                            placeholder='Title'
                            defaultValue={card['title']}
                            onChange={(e) => {setCardsName(e.target.value)}}>
                        </TextField>
                        <Button onClick={() => {toggleRename(card['_id']), renameCard(card['_id'])}}>Save</Button>
                        <Button onClick={() => {toggleRename(card['_id'])}}>Discard</Button>
                    </>)}
                    { 
                    // Toggle open card menu
                    !(menuid===card['_id']) ? (<></>):(<>
                        <MenuList key={card['_id']}>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), deleteCards(card['_id'])}}>Delete</MenuItem>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), toggleRename(card['_id'])}}>Rename</MenuItem>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), toggleEditContent(card['_id'])}}>Edit content</MenuItem>
                            <MenuItem onClick={() => {toggleChangeColor(card['_id'])}}>Change color</MenuItem>
                        </MenuList>
                    </>)}
                    { 
                    // Toggle open card color changing menu
                    !(changeColor===card['_id']) ? (<></>):(<>
                        <MenuList className="color-menu" key={card['_id']}>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#A9D2D5")}} 
                                sx={{backgroundColor: "#A9D2D5"}}>Blue
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#DE9151")}} 
                                sx={{backgroundColor: "#DE9151"}}>Orange
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#519872")}} 
                                sx={{backgroundColor: "#519872"}}>Green
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#947EB0")}} 
                                sx={{backgroundColor: "#947EB0"}}>Purple
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#F8AD9D")}} 
                                sx={{backgroundColor: "#F8AD9D"}}>Pink
                            </MenuItem>
                        </MenuList>
                    </>)}
                    <CardContent>
                        {!(editContent===card['_id']) ? ( 
                        // Toggle open card content changing text field / card content
                        <>
                            <Typography variant="body1" sx={{ color: 'text.primary' }} onDoubleClick={() => {toggleEditContent(card['_id'])}}>
                                {card['content']}
                            </Typography>

                            <Comments cardid={card['_id']}></Comments>
                            
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <sub>Created at: {card['createdAt'].toString().split(".")[0].replace("T", " ") /* Source 1 */}</sub><br/>
                                <sub>Last edited: {card['lastEdited'].toString().split(".")[0].replace("T", " ") /* Source 1 */}</sub>
                            </Typography>
                        </>):
                        (<>
                            <TextField 
                                id="outlined-multiline-static"
                                placeholder='Edit content'
                                variant='outlined'
                                multiline onChange={(e) => {setCardsContent(e.target.value)}} 
                                defaultValue={card['content']}>
                            </TextField>
                            <Button onClick={() => {toggleEditContent(card['_id']), editCardContent(card['_id'])}}>Save</Button>
                            <Button onClick={() => {toggleEditContent(card['_id'])}}>Discard</Button>
                        </>)}
                    </CardContent>
                </Card>
            </>))}
        <Button onClick={() => {addCards()}}>Add new card</Button>
    </>
    )
}

export default Cards

