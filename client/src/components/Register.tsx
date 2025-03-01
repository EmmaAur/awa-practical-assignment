import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import '../styles/login.css'
import { useState } from 'react'
import Box from '@mui/material/Box'


const Register = () => {
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    
    // Sends register data to backend and if data is valid, redirects the user to log in page
    const fetchData = async (username: string, password: string, email: string) => {
        const formData = {
            "password": password,
            "username": username,
            "email": email
        }
        try {
            const response = await fetch('http://localhost:3000/user/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error("Error fetching data")
            }
            
            if (response.status === 200) {
                window.location.href = 'login'
            }

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error when trying to register")
            }
        }
    }

    return (
        <>
            <Box
                className="login-div"
                component="form"
                sx={{
                    alignItems: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                '& .MuiTextFirld-root': {m: 1, width: '15ch'}
                }}
            >
                <h1>Register</h1>
                <TextField 
                    required
                    className="text-input" 
                    label="email" 
                    variant="standard"
                    onChange={(e) => {setEmail(e.target.value)}}
                /><br></br>
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
                    type="password"
                    variant="standard"
                    onChange={(e) => {setPassword(e.target.value)}}
                /><br></br>
                <Button 
                    className="login-button" 
                    variant="contained"
                    sx={{m:1, width: '25ch'}} 
                    onClick={() => fetchData(username, password, email)}>Register</Button>
            </Box>
        </>
    )
}

export default Register
