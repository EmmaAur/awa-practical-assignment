/*
Sources:
toolbar not blocking other components: https://stackoverflow.com/questions/56436811/why-are-there-two-toolbar-components-needed-to-render-correctly-in-the-materi
*/

import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import { changeLanguage } from 'i18next'
import '../styles/header.css'
import { AppBar, Button, Toolbar } from "@mui/material"

const Header = () => {
    
    return (
        <header className="header">
            <AppBar className="app-bar">
                <Toolbar spacing={2}>
                    <h3 className="header-text">Very cool header</h3>
                    <Button className="header-button" variant="contained" href='/'>Home</Button>
                    <Button className="header-button" variant="contained" href='/board'>Board</Button>

                    <Button className="login" variant="contained" href='/'>Log in</Button>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </header>
    )
}

export default Header