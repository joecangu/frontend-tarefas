// REACT
import { NavLink } from 'react-router-dom';
import { useContext } from "react";

// CONTEXT API
import { AuthContext } from "../../contexts/auth";

// CSS
import styles from './Navbar.module.css';

// ÍCONES
import { FiUser, FiLogOut} from 'react-icons/fi';
import { FaAngleDown, FaRegCircleUser } from 'react-icons/fa6';

// REACT
import { useState } from 'react';

export default function Navbar(){

  const { logout, user } = useContext(AuthContext);

  async function handleLogout(){
    await logout();
  }

  const [openProfile, setOpenProfile] = useState(false);

  function handleOpenProfile(){
    setOpenProfile(!openProfile);
  }

  return(
    <nav className={styles.navbar}>
      <NavLink to="/dashboard" className={styles.brand}>
        Minhas <span> Tarefas</span>
      </NavLink>

      { user ? (
        <ul className={styles.links_list}>
          <li>
            <NavLink to="/clientes" className={({isActive}) => (isActive ? styles.active : '')}>
              <FiUser/> Clientes
            </NavLink>
          </li>

          <li>
            <NavLink to="/tarefas" className={({isActive}) => (isActive ? styles.active : '')}>
              <FiUser/> Tarefas
            </NavLink>
          </li>
    
          <li>
            <div className={styles.dropdown}>
              <button onClick={handleOpenProfile} > 
                {user.nome} <FaAngleDown style={{marginLeft: '5px'}}/> 
              </button>
              {openProfile ? (
                <ul className={styles.menu}>
                  <li>
                    <NavLink to="/profile" className={({isActive}) => (isActive ? styles.active : '')}>
                      <FaRegCircleUser/> Perfil
                    </NavLink>
                  </li>
                  <li>
                    <button style={{ margin: '0 35%'}}onClick={handleLogout}>
                        <FiLogOut/> Sair
                    </button>
                  </li>
                </ul>
              ) : null }
            </div>
          </li>
        </ul>
      )
      : <></>
      }
    </nav>
  )
}