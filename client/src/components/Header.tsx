/*
Sources:
toolbar not blocking other components: https://stackoverflow.com/questions/56436811/why-are-there-two-toolbar-components-needed-to-render-correctly-in-the-materi
*/

import { useEffect } from 'react'
import '../styles/header.css'
import { AppBar, Button, Toolbar } from "@mui/material"

const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
}

const Header = () => {

    // useEffect to check if the authorization token exists every time it's first rendered -> If it doesn't, redirect the user back to "/"
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/"
        }
    })
    
    return (
        <header className="header">
            <AppBar className="app-bar">
                <Toolbar>
                    <h3 className="header-text">Very cool header</h3>
                    <Button className="header-button" variant="contained" href='/home'>Home</Button>
                    <Button className="header-button" variant="contained" href='/board'>Board</Button>

                    <Button className="logout" variant="contained" onClick={() => {logout()}}>Log out</Button>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </header>
    )
}

export default Header