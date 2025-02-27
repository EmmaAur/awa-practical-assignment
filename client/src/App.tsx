import './App.css'
import Board from './components/Board'
import Header from './components/Header'
import Home from './components/Home'
import Register from './components/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'


function App() {

  return (
    <>
      <Header></Header>
      <BrowserRouter>
        <Routes>

          <Route path='/home' element= {<>
            <Home></Home>
          </>} />
          
          <Route path='/board' element= {<>
            <Board></Board>
          </>} />
          
          <Route path='/' element= {<>
            <Login></Login>
          </>} />

          <Route path='/login' element= {<>
            <Login></Login>
          </>} />

          <Route path='/register' element= {<>
            <Register></Register>
          </>} />
        
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
