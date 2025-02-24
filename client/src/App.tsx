import './App.css'
import Board from './components/Board'
import Header from './components/Header'
import HeaderLogin from './components/HeaderLogin'
import Register from './components/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path='/board' element= {<>
            <Header></Header>
            <Board></Board>
          </>} />
          
          <Route path='/' element= {<>
            <HeaderLogin></HeaderLogin>
            <Login></Login>
          </>} />

          <Route path='/login' element= {<>
            <HeaderLogin></HeaderLogin>
            <Login></Login>
          </>} />

          <Route path='/register' element= {<>
            <HeaderLogin></HeaderLogin>
            <Register></Register>
          </>} />
        
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
