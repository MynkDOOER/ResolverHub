import { Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Profile from './pages/profile'

const App = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
        </Route>
    </Routes>
    </>
  )
}

export default App;
