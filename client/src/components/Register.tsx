import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import '../styles/login.css'

const Register = () => {
    const [password, setpassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const register = (e) => {
        const formData = {
            "password": password,
            "username": username,
            "email": email
        }

    }

    return (
        <div className='login-div'>
            <h1>Register</h1>
            <TextField className="text-input" label="email" variant="standard">{email}</TextField><br></br>
            <TextField className="text-input" label="username" variant="standard">{username}</TextField><br></br>
            <TextField className="text-input" label="password" variant="standard">{password}</TextField><br></br>
            <Button className="register-button" variant="contained" onClick={(e) => register(e)}>Log in</Button>
        </div>
    )
}

export default Register
