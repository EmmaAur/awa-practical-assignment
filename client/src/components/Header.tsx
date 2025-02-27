/*
Sources:
toolbar not blocking other components: https://stackoverflow.com/questions/56436811/why-are-there-two-toolbar-components-needed-to-render-correctly-in-the-materi
*/

import { useEffect, useState } from 'react'
import '../styles/header.css'
import { AppBar, Button, Toolbar } from "@mui/material"


const Header = () => {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
        }
    }, [token])

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        window.location.href = "/"
    }
    
    return (
        <header className="header">
            <AppBar className="app-bar">
                <Toolbar>
                    <h3 className="header-text">Cool app</h3>
                    <Button className="header-button" variant="contained" href='/home'>Home</Button>
                    {!token ? 
                    ( // NO authentication token
                        <>
                            <Button className="register" variant="contained" href='/register'>Register</Button>
                            <Button className="login" variant="contained" href='/login'>Log in</Button>
                        </>
                    ):( // Authentication token FOUND
                        <>
                            <Button className="header-button" variant="contained" href='/board'>Board</Button>
                            <Button className="logout" variant="contained" onClick={() => {logout()}}>Log out</Button>
                        </>
                    )}
                    
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </header>
    )
}

export default Header