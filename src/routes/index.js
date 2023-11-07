// REACT
import { Routes, Route } from 'react-router-dom';

// ROTA PRIVADA
import Private from './Private';

// PAGES
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import Tarefas from '../pages/Tarefas';
import Tags from '../pages/Tags';

function RoutesApp(){
  return(
    <Routes>
      <Route path="/" element={ <SignIn/> }/>
      <Route path="/register" element={ <SignUp/> }/>
      <Route path="/tarefas" element={ <Private><Tarefas/></Private> }/>
      <Route path="/tags" element={ <Private><Tags/></Private> }/>
      <Route path="/profile" element={ <Private><Profile/></Private> }/>
    </Routes>
  )
}

export default RoutesApp;