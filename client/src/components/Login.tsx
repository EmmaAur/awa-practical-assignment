import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import '../styles/login.css'
import { useState } from 'react'
import Box from '@mui/material/Box'


const Login = () => {
    const [password, setPassword] = useState<string>('')
    const [email, setemail] = useState<string>('')
    
    // Sends login data to backend and if data is valid and user is found, 
    // sends user the jwt token and redirects them to /board.
    const fetchData = async (password: string, email: string) => {
        const formData = {
            "password": password,
            "email": email
        }

        try {
            const response = await fetch('http://localhost:3000/user/login',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error("Error fetching data")
            }

            const data = await response.json()
            console.log(data)
            
            if (data.token) {
                localStorage.setItem("token", data.token)
                window.location.href = '/board'
            }

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
                    label="email" 
                    variant="standard"
                    onChange={(e) => {setemail(e.target.value)}}
                /><br></br>
                <TextField 
                    required
                    className="text-input" 
                    label="password" 
                    variant="standard"
                    type="password"
                    onChange={(e) => {setPassword(e.target.value)}}
                /><br></br>
                <Button 
                    className="login-button" 
                    variant="contained"
                    sx={{m:1, width: '25ch'}} 
                    onClick={() => fetchData(password, email)}>Log in</Button>
            </Box>
        </div>
    )
}

export default Login
