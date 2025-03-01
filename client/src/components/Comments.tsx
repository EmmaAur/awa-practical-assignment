import { Button, Card, CardContent, IconButton, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

interface IComment {
    content: string,
    owner: string,
    username: string,
    cardId: string,
    lastEdited: Date,
    createdAt: Date,
    _id: string
}

interface CardProps {
    cardid: string
}

const Comments: React.FC<CardProps> = ({cardid}) => {
    const [comments, setComments] = useState<IComment[]>([])            // For updating comment data
    const [token, setToken] = useState<string | null>(null)             // Used to get the jwt from browser storage
    const [newComment, setNewComment] = useState<boolean>(false)        // For closing and opening the new comment textfield
    const [expand, setExpand] = useState<boolean>(false)                // For expanding the comments
    const [commentContent, setCommentContent] = useState<string>("")    // Used for userinput when adding a new comment
    
    // Getting jwt from browser memory
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            fetchData()
        }
    }, [token])

    // Sends the card id to backend and receives the comments of that card
    // Receives the updated list of comments and updates comments usestate.
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/comments/fetchdata', {
                method: "POST",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({cardid: cardid})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
            const data = await response.json()
            setComments(data.comments)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends the new comments content and the card id to backend. 
    // Receives the updated list of comments and updates comments usestate.
    const addComment = async () => {
        try {
            const response = await fetch('http://localhost:3000/comments/add', {
                method: "POST",
                headers: { 
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({content: commentContent, cardid: cardid})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }
            const data = await response.json()
            setComments(data.comments)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    // Sends the comment id to backend and deletes it from the database.
    // Receives the updated list of comments and updates comments usestate.
    const deleteComment = async (commentid: string) => {
        try {
            const response = await fetch('http://localhost:3000/comments/delete', {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({commentid: commentid})
            })

            if (!response.ok) {
                throw new Error("Error while fetching data")
            }

            const data = await response.json()
            setComments(data.comments)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

    return (
        <>
            {!expand ? ( // Show the comments if true
            <>
                <IconButton aria-label="expand" onClick={() => {setExpand(true)}}>
                    <ChevronRightIcon />
                </IconButton>Show comments
            </>):(<>
                <IconButton aria-label="expand" onClick={() => {setExpand(false)}}>
                    <ExpandMoreIcon/>
                </IconButton>
                {comments.map((comment) => (
                    <Card variant="outlined" sx={{borderRadius: 1, bgcolor: 'white', marginTop: 2}}>
                        <CardContent>
                            <Typography variant="body2" component="sub">
                                {"From: " + comment.owner}
                            </Typography><br/>
                            <Typography variant="body1" component="sub">
                                {comment['content']}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: "80%" }}>
                                <sub>Created at: {comment['createdAt'].toString().split(".")[0].replace("T", " ")}</sub><br/>
                                <sub>Last edited: {comment['lastEdited'].toString().split(".")[0].replace("T", " ")}</sub>
                            </Typography>
                            <Button onClick={() => {deleteComment(comment['_id'])}}>Delete</Button>
                        </CardContent>
                    </Card>
                ))}

                {!newComment ? ( //Toggle open the textfield to add a new comment
                <>
                    <Button onClick={() => {setNewComment(true)}}>Add comment</Button>
                </>):(<>
                    <TextField
                        id="outlined-multiline-static"
                        placeholder='Your comment'
                        variant='outlined'
                        multiline
                        onChange={(e) => {setCommentContent(e.target.value)}} ></TextField>
                    <Button onClick={() => {setNewComment(false), addComment()}}>Post</Button>
                    <Button onClick={() => {setNewComment(false)}}>Discard</Button>
                </>)}
            </>)}
        </>
    )
}

export default Comments
