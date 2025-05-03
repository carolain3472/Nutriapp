import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {InicioPage} from './pages/Inicio'
import {ChatBot} from './components/ChatBot'
import { PaymentGateway } from "./pages/PasarelaPago";



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
    
    </Routes>

  </BrowserRouter>
  )
}

export default App
