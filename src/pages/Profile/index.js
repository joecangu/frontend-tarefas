// REACT
import { useContext, useState } from "react";

// COMPONENTS
import Header from "../../components/Header";
import Title from "../../components/Title";

// CSS
import './profile.css';

// ÍCONES
import { FiSettings, FiUpload } from 'react-icons/fi';

// LIB DE MENSAGEM
import { toast } from 'react-toastify';

// IMAGEM DO PERFIL
import avatarImg from '../../assets/avatar.png';

// CONTEXT API
import { AuthContext } from "../../contexts/auth";

export default function Profile(){

  const { user, storageUser, setUser, logout, token, api } = useContext(AuthContext);

  const [imageAvatar, setImageAvatar] = useState(null);
  const [id, setId] = useState(user && user.id);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [telefone, setTelefone] = useState(user && user.telefone);
  const [celular, setCelular] = useState(user && user.celular);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      }else{
        toast.error("Tipo do arquivo não suportado!");
        setImageAvatar(null);
        return;
      }
    }
  }

  // FUNÇÕ DE UPLOAD DA FOTO DE PERFIL DO USUÁRIO (NÃO ESTÁ PRONTA)
  async function handleUpload(){
    // FALTA CRIAR A FUNÇÃO PRA SUBIR A IMAGEM
  }
    
  // FUNÇÃO PARA ATUALIZAR OS DADOS DO USUÁRIO
  async function handleSubmit(e){
    e.preventDefault();
    
    // ATUALIZAR OS CAMPOS MENOS A FOTO DE PERFIL
    if(imageAvatar === null && name !== ''){

      // VARIAVEL DE CONFIGURAÇÃO PARA AUTORIZAÇÃO DO BEARER TOKEN
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // ALTERA OS DADOS DO USUÁRIO
      await api.put(`/users/${id}`,{
        name: name,
        email: email,
        avatarUrl: avatarUrl,
        telefone: telefone,
        celular: celular,
        },
        config
      ).then((val) =>{

      let data = {
        ...user,
        name: name,
        email: email,
        avatarUrl: avatarUrl,
        telefone: telefone,
        celular: celular,
      };

        setUser(data);
        storageUser(data);
        toast.success(val.data.msg);
      }).catch((err) => {
        console.error("ops! ocorreu um erro" + err);
        toast.error("Operação não realizada!");
      });
    } else if(name !== '' && imageAvatar !== null){
      // ATUALIZA O NOME E A FOTO
      handleUpload()
    }
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Meu Perfil">
          <FiSettings size={25}/>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25}/>
              </span>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFile}
              />  
              <br/>

              {avatarUrl === null ? (
                <img
                  src={avatarImg}
                  alt="Foto de Perfil"
                  width={250}
                  height={250}
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Foto de Perfil"
                  width={250}
                  height={250}
                />
              )}     
            </label>
              
            <label>Nome:</label>
            <input type="text" value={name} onChange={ (e) => setName(e.target.value) }/>

            <label>E-mail:</label>
            <input type="text" value={email} disabled={true}/>

            <label>Telefone:</label>
            <input type="text" value={telefone} onChange={ (e) => setTelefone(e.target.value) }/>

            <label>Celular:</label>
            <input type="text" value={celular} onChange={ (e) => setCelular(e.target.value) }/>
            
            <div className="buttons">
              <button className="btn-salvar" type="submit">Salvar</button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}