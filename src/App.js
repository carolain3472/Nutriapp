import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {InicioPage} from './pages/Inicio'
import {ChatBot} from './components/ChatBot'
import { PaymentGateway } from "./pages/PasarelaPago";
import { Login } from './pages/Login'
import { Perfil } from './pages/Perfil'
import { Dashboard } from './pages/Dashboard';
import { Recetas } from './pages/Recetas';
import { Nutrichat } from './pages/Nutrichat';
import { Preferencias } from './pages/Preferencias';
import Questionnaire from './components/Questionnaire';



/**Como crear rutas  
 * Importacion
 * import { Login_template } from './pages/Login_template'
 * Implementación
 * <Route path='/login' element ={<Login_template/>} />  
 * */  


function App() {
  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' element ={<InicioPage/>} />
      <Route path='/chat' element ={<ChatBot/>} />
      <Route path="/checkout" element={<PaymentGateway />} />
      <Route path='/login' element ={<Login/>} />
      <Route path='/perfil' element ={<Perfil/>} />
      <Route path='/dashboard' element ={<Dashboard/>} />
      <Route path='/recetas' element ={<Recetas/>} />
      <Route path='/nutrichat' element ={<Nutrichat/>} />
      <Route path='/preferencias' element ={<Preferencias/>} />
      <Route path='/questionnaire' element={<Questionnaire />} />
      {/* <Route path='/login' element ={<Login_template/>} /> */}
    
    </Routes>

  </BrowserRouter>
  )
}

export default App
