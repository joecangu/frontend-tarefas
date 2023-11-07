// REACT
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes';

// IMPORT BIBLIOTECA DE MENSAGENS (AVISOS)
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// AUTENTICAÇÃO
import AuthProvider from './contexts/auth';

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <ToastContainer autoClose={2000}/>
          <RoutesApp/>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
