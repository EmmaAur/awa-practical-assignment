import React, { use, useEffect, useState } from 'react'
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
    columnid: string
}

const ColumnCards: React.FC<CardProps> = ({columnid}) => {
    const [cards, setCards] = useState<ICard[]>([])
    
    const [menuid, setMenuid] = useState<string>("")
    const [renameid, setRenameid] = useState<string>("")
    const [editContent, setEditContent] = useState<string>("")

    const [cardName, setCardName] = useState<string>("")
    const [cardContent, setCardContent] = useState<string>("")

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
        } else {
            setMenuid(cardid)
        }
    }

    const toggleRename = (cardid: string) => {
        if (renameid != "") {
            setRenameid("")
        } else {
            setRenameid(cardid)
        }
    }

    const toggleEditContent = (cardid: string) => {
        if (editContent != "") {
            setEditContent("")
        } else {
            setEditContent(cardid)
        }
    }

    // functions to access backend
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

    const deleteCard = async (cardid: string) => {
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
                body: JSON.stringify({columnid: columnid, cardid: cardid, newtitle: cardName})
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
                body: JSON.stringify({columnid: columnid, cardid: cardid, newcontent: cardContent})
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

    // NOT YET DONE!!!
    const changeColor = async (cardid: string) => {
        try {
            const response = await fetch("http://localhost:3000/cards/color", {
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

    return (
        <div className='card-container' draggable onDragStart={() => {}}>
            {cards.map((card) => (
                <Card className='card' key={card['_id']} style={{backgroundColor: card['color']}}>

                    {!(renameid===card['_id']) ? (<>
                        <CardHeader
                            action={
                              <IconButton key={card['_id']} aria-label="settings" onClick={() => {toggleMenu(card['_id'])}}>
                                  <MoreVertIcon />
                              </IconButton>
                            }
                            title={card['title']}
                        />
                    </>):(<>
                        <TextField 
                            required 
                            className="text-input" 
                            variant="standard"
                            defaultValue={cardName}
                            onChange={(e) => {setCardName(e.target.value)}}>
                        </TextField>
                        <Button onClick={() => {toggleRename(card['_id']), renameCard(card['_id'])}}>Save</Button>
                        <Button onClick={() => {toggleRename(card['_id'])}}>Discard</Button>
                    </>)}
                    
                    {!(menuid===card['_id']) ? (<></>):(<>
                        <MenuList key={card['_id']}>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), deleteCard(card['_id'])}}>Delete</MenuItem>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), toggleRename(card['_id'])}}>Rename</MenuItem>
                            <MenuItem onClick={() => {toggleMenu(card['_id']), toggleEditContent(card['_id'])}}>Edit content</MenuItem>
                            <MenuItem onClick={() => {changeColor(card['_id'])}}>Change color</MenuItem>
                        </MenuList>
                    </>)}

                    <CardContent>
                        {!(editContent===card['_id']) ? (<>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {card['content']}
                            </Typography>
                        </>):(<>
                            <TextField 
                                id="outlined-multiline-static"
                                variant='outlined'
                                multiline onChange={(e) => {setCardContent(e.target.value)}} 
                                defaultValue={card['content']}>
                            </TextField>
                            <Button onClick={() => {toggleEditContent(card['_id']), editCardContent(card['_id'])}}>Save</Button>
                            <Button onClick={() => {toggleEditContent(card['_id'])}}>Discard</Button>
                        </>)}
                    </CardContent>
                </Card>
            ))}
            <Button onClick={() => {addCard()}}>Add new card</Button>
        </div>
    )
}

export default ColumnCards

