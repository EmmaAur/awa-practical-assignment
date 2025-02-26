import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [token, setToken] = useState<string | null>(null)
    
        useEffect(() => {
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
            }
        }, [token])

    return (
        <div>
          <h1>Welcome to very cool app</h1>
          {!token ? 
                ( // NO token
                    <>
                        <Button className="register" variant="contained" href='/register'>Stuff 1</Button>
                    </>
                ):( // token FOUND
                    <>
                        <Button className="header-button" variant="contained" href='/board'>Styuff 2</Button>
                    </>
                )}
        </div>
    )
}

export default Home
