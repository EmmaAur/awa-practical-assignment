import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import Profile from './Profile'

const Home = () => {
    const [token, setToken] = useState<string | null>(null)
    
        useEffect(() => {
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
            }
        }, [token])

    return (
        <div>
          <h1>Welcome to a very cool app</h1>
          {!token ? 
                ( // NO token
                    <>
                        <p>This app is so cool that you probably cannot resist registering. Yeah. That has to be it. No need for marketing speeches here.</p>
                        <Button className="register" variant="contained" href='/register'>Go register!</Button>
                    </>
                ):( // token FOUND
                    <>
                        <Button className="header-button" variant="contained" href='/board'>Go edit your board!</Button>
                        <Profile></Profile>
                    </>
                )}
        </div>
    )
}

export default Home
