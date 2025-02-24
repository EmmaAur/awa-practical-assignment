import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import '../styles/login.css'
import { useState } from 'react'

const Login = () => {
    const [password, setpassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    
    const login = (e) => {
        const formData = {
            "password": password,
            "username": username
        }

    }

    return (
        <div className='login-div'>
            <h1>Log in</h1>
            <TextField className="text-input" label="username" variant="standard">{username}</TextField><br></br>
            <TextField className="text-input" label="password" variant="standard">{password}</TextField><br></br>
            <Button className="login-button" variant="contained" onClick={(e) => login(e)}>Log in</Button>
        </div>
    )
}

export default Login
