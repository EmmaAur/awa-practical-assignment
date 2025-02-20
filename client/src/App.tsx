import './App.css'
import Home from './components/Home'
import Board from './components/Board'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
            <Header></Header>
            <Home></Home>
          </>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
