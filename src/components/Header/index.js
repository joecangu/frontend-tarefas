// REACT
import { useContext } from 'react';
import { Link } from 'react-router-dom';

// CONTEXT API
import { AuthContext } from '../../contexts/auth'

// IMAGEM
import avatarImg from '../../assets/avatar.png';

// ÍCONES
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { FaTasks } from "react-icons/fa";
import { FaTags } from "react-icons/fa6";

// CSS
import './header.css';

export default function Header(){
  const { logout } = useContext(AuthContext);

  // FUNÇÃO PARA DESLOGAR USUÁRIO
  async function handleLogout(){
    await logout();
  }

  return(
    <div className="sidebar">
      <div>
        <img 
          src={ avatarImg }
          alt="Foto do usuário"
        />
      </div>
      <Link to='/tarefas'>
        <FaTasks color="#FFF" size={24}/>
        Tarefas
      </Link>
      <Link to='/tags'>
        <FaTags color="#FFF" size={24}/>
        Tags
      </Link>
      <Link to='/profile'>
        <FiSettings color="#FFF" size={24}/>
        Perfil
      </Link>
      <Link onClick={handleLogout}>
        <FiLogOut color="#FFF" size={24}/>
        Sair
      </Link>
    </div>
  )
} 