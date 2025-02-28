import { Box, Button, Card, CardContent, CardHeader, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface IComment {
    content: string,
    owner: string,
    username: string,
    cardId: string,
    lastEdited: Date,
    createdAt: Date
}


interface CardProps {
    cardid: string
}

const Comment: React.FC<CardProps> = ({cardid}) => {
    const [comments, setComments] = useState<IComment[]>([])
    const [token, setToken] = useState<string | null>(null)
    const [newComment, setNewComment] = useState<boolean>(false)
    const [commentContent, setCommentContent] = useState<string>("")
        
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            fetchData()
        }
    }, [token])


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
            console.log(data.comments)
            setComments(data.comments)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching data:", error.message)
            }
        }
    }

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

    return (
        <>{comments.map((comment) => (
            <Card variant="outlined" sx={{borderRadius: 1, bgcolor: 'white', marginTop: 2}}>
                <CardContent>
                    <Typography variant="body2" component="sub">
                        {"From: " + comment.owner}
                    </Typography><br/>
                    <Typography variant="body1" component="sub">
                        {comment['content']}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: "80%" }}>
                        <sub>Created at: {comment['createdAt'].toString().split(".")[0].replace("T", " ") /* Source 1 */}</sub><br/>
                        <sub>Last edited: {comment['lastEdited'].toString().split(".")[0].replace("T", " ") /* Source 1 */}</sub>
                    </Typography>
                </CardContent>
            </Card>
        ))}
        
        {!newComment ? (<>
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
        </>)}</>
    )
}

export default Comment
