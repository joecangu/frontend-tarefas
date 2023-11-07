// REACT
import { useState, createContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// IMPORTA A CONEXÃO COM A API
import api from '../services/api';

// LIB DE MENSAGEM
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
    
  // VERIFICA SE O USUÁRIO ESTÁ LOGADO
  useEffect(() => {
    async function loadUser(){
      const storageUser = localStorage.getItem('@users');

      let localStorageUser = JSON.parse(storageUser);
      let storageToken = '';

      if(localStorageUser) {
        storageToken = localStorageUser.token;
      }
      
      if(storageUser){
        setUser(JSON.parse(storageUser));
        setToken(storageToken);
        setLoading(false);
      } 
      setLoading(false);
    }
    loadUser();
  }, []);


  // LOGIN NO SISTEMA
  async function signIn(email, password){
    setLoadingAuth(true);

    let usuario = {
      email: email,
      password: password
    }
      
    // GERA O TOKEN DE ACESSO
    await api.post("/login",{
      email: email,
      password: password
    }).then((value) => {

    // VARIAVEL DO TOKEN
    let generateToken = value.data.token;
    
    setToken(generateToken);

    // VARIAVEL DE CONFIGURAÇÃO PARA AUTORIZAÇÃO DO BEARER TOKEN
    const config = {
      headers: { Authorization: `Bearer ${generateToken}` }
    };

    // CONSULTA OS DADOS DO USUÁRIO
    api.post('/users/login',{
      email: usuario.email,
      password: usuario.password
    },
    config
    ).then((val) =>{

      let data = {
        id: val.data.id,
        email: val.data.email,
        name: val.data.name,
        avatarUrl: val.data.avatarurl,
        telefone: val.data.telefone,
        celular: val.data.celular,
        token: generateToken
      };
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Seja bem-vindo ao sistema!");
        navigate("/tarefas");
      }).catch((err) => {
        console.error("ops! ocorreu um erro" + err);
        toast.error("Usuário sem autorização!");
        setLoadingAuth(true);
      });
    }).catch((err) => {
      console.error("ops! ocorreu um erro" + err);
      toast.error("Usuário ou senha incorretos!");
      setLoadingAuth(false);
    });
  }

  // CADASTRAR USUÁRIO
  async function signUp(email, password, name){
    setLoadingAuth(true);

    await api.post("/users",{
      name: name,
      email: email,
      password: password,
    }).then(() => {
      let data = {
        name: name,
        email: email,
        password: password
      }

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success(`Usuário cadastrado! Faça Login.`)
      navigate("/");
    }).catch((err) => {
      console.error("ops! ocorreu um erro" + err);
      setLoadingAuth(true);
    });
  }

  // GUARDAR NA SESSÃO OS DADOS DO USUÁRIO
  function storageUser(data){
    localStorage.setItem('@users', JSON.stringify(data))
  }


  // FUNÇÃO DE DESLOGAR DO SISTEMA
  async function logout(){

    // VARIAVEL DE CONFIGURAÇÃO PARA AUTORIZAÇÃO DO BEARER TOKEN
    const config = {
      headers: {'Authorization': `Bearer ${token}`},
    }

    // FAZ O LOGOUT DO USUÁRIO
    await api.get('/logout',
      config
    ).then((val) => {
      localStorage.removeItem('@users');
      setUser(null);
      setToken(null);
      toast.success(val.data.message);
      navigate("/");
    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);
      setLoadingAuth(true);
    });       
  }

  return(
    <AuthContext.Provider 
      value={{
        signed: !!user, //false
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        token: token,
        loading,
        storageUser,
        setUser,
        api
      }}
    >
      { children }
    </AuthContext.Provider>
  )
}
export default AuthProvider;