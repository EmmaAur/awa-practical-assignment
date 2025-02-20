import './App.css'
import MyContainer from './components/MyContainer'
import About from './components/About'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/about' element= {<>
            <Header></Header>
            <About></About>
          </>} />
          <Route path='/' element= {<>
            <Header></Header>
            <MyContainer></MyContainer>
          </>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
