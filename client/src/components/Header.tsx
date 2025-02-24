/*
Sources:
toolbar not blocking other components: https://stackoverflow.com/questions/56436811/why-are-there-two-toolbar-components-needed-to-render-correctly-in-the-materi
*/

import '../styles/header.css'
import { AppBar, Button, Toolbar } from "@mui/material"

const Header = () => {
    
    return (
        <header className="header">
            <AppBar className="app-bar">
                <Toolbar>
                    <h3 className="header-text">Very cool header</h3>
                    <Button className="header-button" variant="contained" href='/'>Home</Button>
                    <Button className="header-button" variant="contained" href='/board'>Board</Button>

                    <Button className="logout" variant="contained" href='/logout'>Log out</Button>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </header>
    )
}

export default Header