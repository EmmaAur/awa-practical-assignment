/*
Sources:
toolbar not blocking other components: https://stackoverflow.com/questions/56436811/why-are-there-two-toolbar-components-needed-to-render-correctly-in-the-materi
*/

import '../styles/header.css'
import { AppBar, Button, Toolbar } from "@mui/material"

const HeaderLogin = () => {
    
    return (
        <header className="header">
            <AppBar className="app-bar">
                <Toolbar>
                    <h3 className="header-text">Very cool header</h3>
                    <Button className="register" variant="contained" href='/register'>Register</Button>
                    <Button className="login" variant="contained" href='/login'>Log in</Button>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </header>
    )
}

export default HeaderLogin