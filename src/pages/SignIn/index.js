// REACT
import { useState, useContext } from 'react'
import { NavLink } from "react-router-dom";

// CSS
import './signin.css'

// CONTEXT API
import { AuthContext } from '../../contexts/auth'

export default function SignIn(){
    
  // VARIÁVEIS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loadingAuth } = useContext(AuthContext)

  // FUNÇÃO DE LOGIN
  async function handleSignIn(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      await signIn(email, password);
    }
  }

  return(
    <div className='login'>
      <h1>Login</h1>
      <p>Faça o login para poder utilizar o sistema!</p>

      <form onSubmit={handleSignIn}>
        <label>
          <span>E-mail:</span>
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="E-mail do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input 
            type="password" 
            name="password" 
            required 
            placeholder="Senha do usuário"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label> 

        {!loadingAuth && <button className="btn">Login</button>}

        {loadingAuth && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        <br/><br/>

        <a>
          <NavLink to="/register">
            <span>Ainda não tem conta? Cadastre-se aqui</span>
          </NavLink>
        </a>
      </form>
    </div> 
  )
}