import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import '../styles/login.css'
import { useState } from 'react'
import Box from '@mui/material/Box'

const Login = () => {
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    
    const fetchData = async (username: string, password: string) => {
        const formData = {
            "password": password,
            "username": username
        }

        try {
            const response = await fetch('http://localhost:3000/user/login',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })

            if (!response) {
                throw new Error("Error fetching data")
            }

            const data = await response.json()
            console.log(data)

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error when trying to log in")
            }
        }

    }

    return (
        <div className='login-div'>
            
            <Box
                className="login-div"
                component="form"
                sx={{
                    alignItems: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                '& .MuiTextFirld-root': {m: 1, width: '25ch'}
                }}
            >
                <h1>Log in</h1>
                <TextField 
                    required
                    className="text-input" 
                    label="username" 
                    variant="standard"
                    onChange={(e) => {setUsername(e.target.value)}}
                /><br></br>
                <TextField 
                    required
                    className="text-input" 
                    label="password" 
                    variant="standard"
                    onChange={(e) => {setPassword(e.target.value)}}
                /><br></br>
                <Button 
                    className="login-button" 
                    variant="contained"
                    sx={{m:1, width: '25ch'}} 
                    onClick={(e) => fetchData(username, password)}>Log in</Button>
            </Box>
        </div>
    )
}

export default Login
