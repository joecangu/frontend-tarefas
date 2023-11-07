// REACT
import { useContext, useEffect, useState } from "react";

// CONTEXT API
import { AuthContext } from "../../contexts/auth";

// LIB PARA REQUISIÇÕES HTTP
import axios from "axios";

// COMPONENTS
import Header from "../../components/Header";
import Title from "../../components/Title";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";

// COMPONENT DATATABLE
import DataTable from 'react-data-table-component';

// MENSAGEM
import { toast } from 'react-toastify';

// ÍCONES
import { FiUser, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

// CSS
import './tags.css';

// TOOLTIP
import { Tooltip } from 'react-tooltip'
import { FaTags } from "react-icons/fa6";

export default function Tags(){
  
  const { api, token } = useContext(AuthContext);
  
  // VARIAVEL DE CONFIGURAÇÃO PARA AUTORIZAÇÃO DO BEARER TOKEN
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  };

  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastData, setLastData] = useState();

  const [nome, setNome] = useState('');
  const [nomeEdit, setNomeEdit] = useState('');
  const [idTag, setIdTag] = useState(null);
  const [editar, setEditar] = useState(null);

  // CONFIGURAÇÃO DO MODAL
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // VARIAVEL DE PAGINAÇÃO
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    async function loadTags(){
      const consulta = await api.get(`/tags`, config);

      setTags([]);
      await consultaTags(consulta);

      setLoading(false);
    }
    loadTags();  
  }, []);

  // FUNÇÃO PARA CONSULTAR AS TAGS
  async function consultaTags(consulta){
      
    const listaTagVazia = consulta.size === 0;       
    
    let tagsData = consulta.data.data;

    if(!listaTagVazia){
      let lista = [];
      tagsData.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.nome,
        })
      })

      const lastData = tagsData[tagsData.length - 1];
      setTags(tags => [...tags, ...lista]);
      setLastData(lastData);
    } else {
      setIsEmpty(true);
    }
  }

  // COLUNAS PARA MONTAR O DATATABLE
  const columns = [
    {
      name: 'Tag',
      selector: row => row.nome,
      sortable: true,
    },
    {
      name: 'Ações',
      cell:(row) => <div style={{ marginTop: '1px', justifyContent:"space-around" }}>
                      <a data-tooltip-id={row.id} data-tooltip-content="Editar">
                        <button style={{backgroundColor:'#f6a935', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px', marginBottom: '2px'}} id={row.nome}
                          onClick={ () => handleEdit(row) }
                        >
                          <FiEdit2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                        </button>
                      </a>
                      <a data-tooltip-id={row.id} data-tooltip-content="Excluir">
                        <button style={{ backgroundColor: '#ff0000', borderRadius:'5px', padding: '2px 7px', border:'0', cursor:'pointer' }} id={row.nome}
                          onClick={ () => handleDelete(row) }
                        >
                          <FiTrash2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                        </button>
                      </a>
                      <Tooltip id={row.id} />
                    </div>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    
  ];

  // FUNÇÃO DE ABRIR MODAL E PASSAR OS PARAMETROS PARA EDIÇÃO
  function handleEdit(item){

 
    // SETA OS VALORES NAS VARIAVEIS DE ESTADO
    setModal(!modal);
    setEditar(item);
    setNomeEdit(item.nome);
    setIdTag(item.id);
  }

  // FUNÇÃO PARA ABRIR MODAL E PASSAR PARAMETRO PARA EXCLUSÃO
  function handleDelete(item){
    setDeleteData(item);
    setModalDelete(!modalDelete);
    setIdTag(item.id);
  }

  function toggleModal(){
    setModal(!modal);
    setEditar('');
    setNome('');
    setIdTag(null);
  }

  //FUNÇÃO DE ADICIONAR NO BANCO DE DADOS
  async function handleSubmit(e){
    e.preventDefault();

    // INSERE OS DADOS NO BANCO
    await api.post(`/tags`,{
      nome: nome,
    },
    config
    ).then((val) =>{

      let tagsReq = val.data.data.original.data;

      // VOLTA OS CAMPOS PROS VALORES INICIAIS
      setNome('');
      setTags(tagsReq);
      setModal(false);

      // MENSAGEM DE SUCESSO
      toast.success(val.data.msg);
      
    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);

      // MENSAGEM CASO DE ERRO
      toast.error("Operação não realizada!");
    });
  }

  // FUNÇÃO DE ALTERAR TODOS OS CAMPOS DA TAG
  async function handleUpdate(e){
    e.preventDefault();

    // ALTERA OS DADOS DO USUÁRIO
    await api.put(`/tags/${idTag}`,{
      nome: nomeEdit,
    },
    config
    ).then((val) =>{

      let tagsReq = val.data.data.original.data;

      // VOLTA OS CAMPOS PROS VALORES INICIAIS
      setNomeEdit('');
      setTags(tagsReq);
      setModal(false);
      setIdTag(null);

      // MENSAGEM DE SUCESSO
      toast.success(val.data.msg);

    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);

      // MENSAGEM CASO DE ERRO
      toast.error("Operação não realizada!");
    });
  }

  // FUNÇÃO DE DELETAR
  async function handleDeleteData(e){
    e.preventDefault();

    await api.delete(`/tags/${idTag}`,
    config
    ).then((val)=>{

      let tagReq = val.data.data.original.data;
      
      // RETORNA VARIÁVEIS PARA O VALOR INICIAL
      setTags(tagReq);
      setIdTag(null);
      setDeleteData('');
      setModalDelete(false);

      // MENSAGEM DE SUCESSO
      toast.success(val.data.msg);

    }).catch((err) => {
        console.error("Ops! ocorreu um erro" + err);

        // MENSAGEM CASO DE ERRO
        toast.error("Erro excluir o cliente!");
    });
  }

  if(loading){
    return(
      <div>
        <Header/>
        <div className="content">
          <Title name="Tags">
            <FiUser size={25}/>
          </Title>
          <div className="container dashboard">
            <Loader/>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Tags">
          <FaTags size={25}/>
        </Title>

        <div className="buttons-header">
          <button onClick={ toggleModal }  className="btn-new">
            <FiPlus color="#FFF" size={25}/>
            Adicionar nova Tag
          </button>
        </div>
        <>
          { tags.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhuma tag encontrada.</span>
            </div>
          ) : (
            <>  
              <DataTable
                columns={columns}
                data={tags}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} 
                subHeader
                persistTableHead
              />  
            </>
          )}
        </>
      </div>

      {modal &&
        <Modal 
          titulo={editar ? "Editar Tag" : "Adicionar nova Tag"}
          close={ () => setModal(!modal) }
        >
          <form onSubmit={editar ? handleUpdate : handleSubmit}>                
            <label style={{display: 'flex', alignItems:'left'}}>
              <span>Nome:</span>
              <input 
                type="text" 
                name="nome" 
                placeholder="Digite o nome da tag"
                required 
                value={editar !== '' ? nomeEdit : nome}
                onChange={
                    (e) => {editar !== '' ? setNomeEdit(e.target.value) : setNome(e.target.value)}
                }
              />
            </label>
           
            <button className="btn">{ editar ? 'Alterar' : 'Salvar'}</button>
          </form>
        </Modal>
      }

      {modalDelete &&
        <Modal 
          titulo="Excluir Tag"
          close={ () => setModalDelete(!modalDelete) }
        >
          <form onSubmit={handleDeleteData}>   
            <label>
              <p>Tem certeza que deseja excluir a tag <b>{deleteData.nome} </b>? </p>
            </label>

            <button className="btn-delete">Excluir</button>
          </form>
        </Modal>
      }
    </div>
  )
}