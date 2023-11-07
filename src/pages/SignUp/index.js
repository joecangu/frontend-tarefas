// REACT
import { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'

// CSS
import './signup.css';

// CONTEXT API
import { AuthContext } from '../../contexts/auth'

export default function SignUp(){

  // VARIÁVEIS
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e){
    e.preventDefault();
    
    if(name !== '' && email !== '' && password !== ''){
      await signUp(email, password, name);
    }
  }

  return(
    <div className='register'>
      <h1>Cadastrar Usuário</h1>
      <p>Crie seu usuário</p>
          
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome do usuário</span>
          <input 
            type="text" 
            name="name"
            required
            placeholder='Nome Completo'
            value={name}
            onChange={ (e)=> setName(e.target.value) }
          />
        </label>
          
        <label>
          <span>E-mail</span>
          <input 
            type="text" 
            name="email"
            required
            placeholder='email@email.com'
            value={email}
            onChange={ (e)=> setEmail(e.target.value) }
          />
        </label>
          
        <label>
          <span>Senha:</span>
          <input 
            type="password" 
            name="password"
            required
            placeholder='*******'
            value={password}
            onChange={ (e)=> setPassword(e.target.value) }
          />
        </label>
          
        <button type="submit" className='btn'>
          {loadingAuth ? 'Carregando...' : 'Cadastrar'}
        </button>
        <br/><br/>
        <a>
          <NavLink to="/">
            <span>Voltar</span>
          </NavLink>
        </a>
      </form> 
    </div>
  )
}