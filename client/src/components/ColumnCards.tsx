import React, { useEffect, useState } from 'react'
import '../styles/columncard.css'
import { Button, Card, CardContent, CardHeader, IconButton, MenuItem, MenuList, TextField, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface ICard {
    title: string,
    content: string,
    color: string,
    order: number,
    columnid: string,
    createdAt: Date,
    _id: string
}

interface CardProps {
    columnid: string,
    columns: string[]
}

const ColumnCards: React.FC<CardProps> = ({columnid, columns}) => {
    const [cards, setCards] = useState<ICard[]>([])

    
    const [menuid, setMenuid] = useState<string>("")
    const [renameid, setRenameid] = useState<string>("")
    const [editContent, setEditContent] = useState<string>("")
    const [changeColor, setChangeColor] = useState<string>("")

    const [cardName, setCardsName] = useState<string>("New card")
    const [cardContent, setCardsContent] = useState<string>("This is a new card.")

    const [token, setToken] = useState<string | null>(null)
    
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            fetchData()
        }
    }, [token])

    // Toggle tools to hide/show components when needed
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

    const toggleChangeColor= (cardid: string) => {
        if (changeColor != "") {
            setChangeColor("")
        } else {
            setChangeColor(cardid)
        }
    }

    // functions to communicate with backend
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/cards/fetchcards', {
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

    const addCard = async () => {
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

    return (
        <>
            {cards.map((card) => (<>
                {!card ? (null):(<>
                    <Card className='card' key={card['_id']} style={{backgroundColor: card.color}}>
                    {!(renameid===card['_id']) ? (<>
                        <CardHeader 
                            onDoubleClick={() => setRenameid(card['_id'])}
                            action={<>
                                <IconButton key={card['_id']} aria-label="settings" onClick={() => {toggleMenu(card['_id'])}}>
                                    <MoreVertIcon />
                                </IconButton>
                            </>}
                            title={card.title}
                        />
                    </>):(<>
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
                    { // This is the menu
                    !(menuid===card['_id']) ? (<></>):(<>
                        <MenuList key={card['_id']}>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), deleteCards(card['_id'])}}>Delete</MenuItem>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), toggleRename(card['_id'])}}>Rename</MenuItem>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), toggleEditContent(card['_id'])}}>Edit content</MenuItem>
                            <MenuItem onClick={() => {toggleChangeColor(card['_id'])}}>Change color</MenuItem>
                        </MenuList>
                    </>)}
                    { // This is the color change menu
                    !(changeColor===card['_id']) ? (<></>):(<>
                        <MenuList className="color-menu" key={card['_id']}>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#A9D2D5")}} 
                                sx={{backgroundColor: "#A9D2D5"}}>Light blue
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#DE9151")}} 
                                sx={{backgroundColor: "#DE9151"}}>Persian orange
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#519872")}} 
                                sx={{backgroundColor: "#519872"}}>Sea green
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#947EB0")}} 
                                sx={{backgroundColor: "#947EB0"}}>African violet
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    toggleChangeColor(card['_id']), 
                                    toggleMenu(card['_id']), 
                                    changeCardColor(card['_id'], "#F8AD9D")}} 
                                sx={{backgroundColor: "#F8AD9D"}}>Coral pink
                            </MenuItem>
                        </MenuList>
                    </>)}
                    <CardContent>
                        {!(editContent===card['_id']) ? (<>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} onDoubleClick={() => {toggleEditContent(card['_id'])}}>
                                {card['content']}
                            </Typography>
                        </>):(<>
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
            </>)}
        </>))}
        <Button onClick={() => {addCard()}}>Add new card</Button>
    </>
    )
}

export default ColumnCards

