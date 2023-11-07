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

// MASCARA
import InputMask from "react-input-mask";

// MENSAGEM
import { toast } from 'react-toastify';

// ÍCONES
import { FiUser, FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { FaTags } from "react-icons/fa6";

// CSS
import './tarefas.css';

// TOOLTIP
import { Tooltip } from 'react-tooltip'

// FORMATAR DATAS
import { format } from 'date-fns';
import { FaTasks } from "react-icons/fa";

export default function Tarefas(){
  
  const { api, token } = useContext(AuthContext);
  
  // VARIAVEL DE CONFIGURAÇÃO PARA AUTORIZAÇÃO DO BEARER TOKEN
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };


  const [tarefas, setTarefas] = useState([]);
  const [feriados, setFeriados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastData, setLastData] = useState();


  // VARIAVEIS
  const [titulo, setTitulo] = useState('');
  const [tituloEdit, setTituloEdit] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [dataTarefa, setDataTarefa] = useState('');
  const [dataTarefaEdit, setDataTarefaEdit] = useState('');
  const [horaTarefa, setHoraTarefa] = useState('');
  const [horaTarefaEdit, setHoraTarefaEdit] = useState('');
  const [tempoDuracao, setTempoDuracao] = useState('');
  const [tempoDuracaoEdit, setTempoDuracaoEdit] = useState('');
  const [idTarefa, setIdTarefa] = useState(null);
  const [editar, setEditar] = useState(null);

  // VARIAVEIS DE PESQUISA
  const [tituloPesquisa, setTituloPesquisa] = useState('');
  const [dataTarefaPesquisa, setDataTarefaPesquisa] = useState('');
  const [dataTarefaInicioPesquisa, setDataTarefaInicioPesquisa] = useState('');
  const [dataTarefaFinalPesquisa, setDataTarefaFinalPesquisa] = useState('');
  const [mesSelected, setMesSelected] = useState(0);

  // CONFIGURAÇÃO DO MODAL
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalTag, setModalTag] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // VARIAVEIS DA COMBOBOX DE TAGS
  const [tags, setTags] = useState([])
  const [loadTags, setLoadTags] = useState(true);
  const [tagsSelected, setTagsSelected] = useState(0);
  const [idTagsSelecionado, setIdTagsSelecionado] = useState(1);

  // VARIAVEL DA PAGINAÇÃO
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // MONTA A TELA QUANDO INICIA
  useEffect(() => {

    // CARREGA AS TAREFAS
    async function loadTarefas(){
      const consulta = await api.get(`/tarefas`, config);

      setTarefas([]);
      await consultaTarefas(consulta);
      
      setLoading(false);
    }

    // FUNÇÃO PARA CONSULTAR AS TAGS E MONTAR A COMBOBOX
    async function carregarTags(e){
      await api.get(`/tags`,
      config
      ).then((tagsSelect)=>{
        let listaTags = [];
        let tag = tagsSelect.data.data;

        tag.forEach((doc) => {
          listaTags.push({
            id: doc.id,
            nome: doc.nome
          })
        });

        // NÃO ENCONTROU NENHUMA TAG NO BANCO(ZERADO)
        if(tag.length === 0){
          setLoadTags(false);
          setTags([]);
          return;
        }

        setTags(listaTags);
        setLoadTags(false);

      }).catch((err) => {
        console.error("Ops! ocorreu um erro" + err);
        toast.error("Erro ao buscar as tags!");
        setLoadTags(false);
        setTags([]);
      });
    }
    
    loadTarefas();
    carregarTags();
    consultarFeriados();
  }, []);

  // CONSULTA AS TAREFAS
  async function consultaTarefas(consulta){
  
    const listaTarefaVazia = consulta.size === 0;       
      
    let tarefasData = consulta.data.data;

    if(!listaTarefaVazia){
      let lista = [];
      tarefasData.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.titulo,
          descricao: doc.descricao,
          data: doc.data,
          hora: doc.hora,
          tag_id: doc.tag_id,
          tags: doc.tags,
          tempo_duracao: doc.tempo_duracao
        })
      })

      const lastData = tarefasData[tarefasData.length - 1];
      
      setTarefas(tarefas => [...tarefas, ...lista]);
      setLastData(lastData);
      consultarFeriados(lista)
    } else {
      setIsEmpty(true);
    }
  }

  // FUNÇÃO PARA CONSULTAR OS FERIADOS
  async function consultarFeriados(listaTarefas){
    let listaCompleta = listaTarefas;
    await axios.get(`https://date.nager.at/api/v3/publicholidays/2023/BR`,
    config
    ).then((todosFeriados)=>{
      let listaFeriados = [];
      
      let feriado = todosFeriados.data;

      feriado.forEach((doc) => {
        listaCompleta.push({
          id: doc.date,
          data: doc.date,
          titulo: doc.localName,
          descricao: null,
          hora: '',
          tag_id: null,
          tempo_duracao: null
        })
      });

      // NÃO ENCONTROU NENHUMA TAG NO BANCO(ZERADO)
      if(feriado.length === 0){    
        setFeriados([]);
        return;
      }
      setFeriados(listaFeriados);
      setTarefas(listaCompleta);
    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);
      // toast.error("Erro ao buscar os feriados!");
      setFeriados([]);
    });
  }

  // COLUNAS PARA MONTAR O DATATABLE
  const columns = [
    {
      name: 'Data e Hora',
      selector: row => format(new Date(row.data.replace(/-/g, '/')), 'dd/MM/yyyy') + ' ' + row.hora,
      sortable: true,
    },
    {
      name: 'Título',
      selector: row => row.titulo,
      sortable: true,
    },
    {
      name: 'Descrição',
      selector: row => row.descricao ? row.descricao : "Feriado",
      sortable: true,
    },
    {
      name: 'Tempo de Duração',
      selector: row => row.tempo_duracao ? row.tempo_duracao : " - ",
      sortable: true,
    },
    {
      name: 'Tag',
      selector: row => row.tags ? row.tags : " - ",
      sortable: true,
    },
    {
      name: 'Ações',
      cell:(row) => row.tag_id ? <div style={{ marginTop: '1px', justifyContent:"space-around" }}>
                      <a data-tooltip-id={row.id} data-tooltip-content="Tags">
                        <button style={{backgroundColor:'#5cb85c', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px', marginBottom: '2px'}} id={row.nome}
                          onClick={ () => handleEditTag(row) }
                        >
                          <FaTags style={{ marginTop: '2px'}} color='#FFF' size={17} />
                        </button>
                      </a>
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
                    </div> : <></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // FUNÇÃO DE ABRIR MODAL E PASSAR OS PARAMETROS PARA EDIÇÃO
  function handleEdit(item){

    // FORMATA A DATA PARA O PADRÃO DD/MM/YYYY
    let dataFormat = format(new Date(item.data.replace(/-/g, '/')), 'dd/MM/yyyy');
    
    // SETA OS VALORES NAS VARIAVEIS DE ESTADO
    setModal(!modal);
    setEditar(item);
    setTituloEdit(item.titulo);
    setDescricaoEdit(item.descricao);
    setDataTarefaEdit(dataFormat);
    setHoraTarefaEdit(item.hora);
    setTempoDuracaoEdit(item.tempo_duracao);
    setTagsSelected(item.tag_id);
    setIdTarefa(item.id);
  }

  // FUNÇÃO DE ABRIR MODAL E PASSAR OS PARAMETROS PARA EDIÇÃO
  function handleEditTag(item){
    
    setModalTag(!modalTag);
    setTagsSelected(item.tag_id);
    setIdTarefa(item.id);

  }

  // FUNÇÃO PARA ABRIR MODAL E PASSAR PARAMETRO PARA EXCLUSÃO
  function handleDelete(item){
    setDeleteData(item);
    setModalDelete(!modalDelete);
    setIdTarefa(item.id);
  }

  function toggleModal(){
    setModal(!modal);
    setEditar('');
    setTitulo('');
    setDescricao('');
    setDataTarefa('');
    setHoraTarefa('');
    setTempoDuracao('');
    setIdTarefa(null);
    setTagsSelected(0);
  }

  //FUNÇÃO DE ADICIONAR NO BANCO DE DADOS
  async function handleSubmit(e){
    e.preventDefault();

    // INSERE OS DADOS NO BANCO
    await api.post(`/tarefas`,{
      titulo: titulo,
      descricao: descricao,
      data: dataTarefa,
      hora: horaTarefa,
      tag_id: idTagsSelecionado,
      tempo_duracao: tempoDuracao
    },
    config
    ).then((val) =>{

      let tarefasReq = val.data.data.original.data;

      // VOLTA OS CAMPOS PROS VALORES INICIAIS
      setTitulo('');
      setDescricao('');
      setDataTarefa('');
      setHoraTarefa('');
      setTagsSelected(0);
      setTempoDuracao('');
      setTarefas(tarefasReq);
      setModal(false);

      // MENSAGEM DE SUCESSO
      toast.success(val.data.msg);
    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);

      // MENSAGEM CASO DE ERRO
      toast.error("Operação não realizada!");
    });
  }

  // FUNÇÃO DE ALTERAR TODOS OS CAMPOS DA TAREFA
  async function handleUpdate(e){
    e.preventDefault();

    // ALTERA OS DADOS DO USUÁRIO
    await api.put(`/tarefas/${idTarefa}`,{
      titulo: tituloEdit,
      descricao: descricaoEdit,
      data: dataTarefaEdit,
      hora: horaTarefaEdit,
      tag_id: idTagsSelecionado,
      tempo_duracao: tempoDuracaoEdit
    },
    config
    ).then((val) =>{

      let tarefasReq = val.data.data.original.data;

      // VOLTA OS CAMPOS PROS VALORES INICIAIS
      setTituloEdit('');
      setDescricaoEdit('');
      setDataTarefaEdit('');
      setHoraTarefaEdit('');
      setTagsSelected(0);
      setTempoDuracaoEdit('');
      setTarefas(tarefasReq);
      setModal(false);
      setIdTarefa(null);

      // MENSAGEM DE SUCESSO
      toast.success(val.data.msg);

    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);

      // MENSAGEM CASO DE ERRO
      toast.error("Operação não realizada!");
    });
  }

  // FUNÇÃO DE ALTERAR A TAG
  async function handleAlterarTag(e){
    e.preventDefault();

    // ALTERA OS DADOS DO USUÁRIO
    await api.put(`/tarefas/${idTarefa}`,{
      tag_id: idTagsSelecionado
    },
    config
    ).then((val) =>{

      let tarefasReq = val.data.data.original.data;

      // VOLTA OS CAMPOS PROS VALORES INICIAIS
      setTagsSelected(0);
      setTarefas(tarefasReq);
      setModalTag(false);
      setIdTarefa(null);

      // MENSAGEM DE SUCESSO
      toast.success("Tag da Tarefa atualizada com sucesso!");

    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);

      // MENSAGEM CASO DE ERRO
      toast.error("Operação não realizada!");
    });
  }

  // FUNÇÃO DE DELETAR
  async function handleDeleteData(e){
    e.preventDefault();

    await api.delete(`/tarefas/${idTarefa}`,
    config
    ).then((val)=>{

      let tarefaReq = val.data.data.original.data;
      
      // RETORNA VARIÁVEIS PARA O VALOR INICIAL
      setTarefas(tarefaReq);
      setIdTarefa(null);
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

  // CONSULTA AS TAREFAS DE ACORDO COM O PARAMETRO
  async function handlePesquisar(e){
    e.preventDefault();

    // ALTERA OS DADOS DO USUÁRIO
    await api.post(`/tarefas-consulta/`,{
      titulo: tituloPesquisa ? tituloPesquisa : '',
      data: dataTarefaPesquisa ? dataTarefaPesquisa : '',
      data_tarefa_inicio: dataTarefaInicioPesquisa ? dataTarefaInicioPesquisa : '',
      data_tarefa_final: dataTarefaFinalPesquisa ? dataTarefaFinalPesquisa : '',
      tag_id: checked ? checked : '',
      mes: mesSelected ? mesSelected : ''
    },
    config
    ).then((response) =>{
      let tarefasReq = response.data.data;

      // VOLTA OS CAMPOS PARA OS VALORES INICIAIS
      setTarefas(tarefasReq);
      setTituloPesquisa('');
      setDataTarefaPesquisa('');
      setDataTarefaInicioPesquisa('');
      setDataTarefaFinalPesquisa('');
      setChecked([]);
      setMesSelected(0);
      setTituloPesquisa('');
        
    }).catch((err) => {
      console.error("Ops! ocorreu um erro" + err);
      toast.error("Operação não realizada!");
    });
  }

  // FUNÇÃO PARA PEGAR O ID DA TAG
  function handleChangeTag(e){
    let tag_id = e.target.value;
    setTagsSelected(tag_id)
    
    setIdTagsSelecionado(tag_id);
  }

  // FUNÇÃO PARA PEGAR O MES
  function handleChangeMes(e){
    let mesSelecionado = e.target.value;
    setMesSelected(mesSelecionado)
  }

  // VARIAVEL QUE VERIFICA O ESTADO DOS VALORES DO CHECKBOX
  const [checked, setChecked] = useState([]);
  function handleCheck(e){
    
    var updatedList = [...checked];
    let lista = [];
    lista.push(
      e.target.id
    );
   
    if(e.target.checked){
      updatedList = [...checked, ...lista];
    } else {
      updatedList.splice(checked.indexOf(e.target.value), 1);
    }
    setChecked(updatedList);
  }

  // FUNÇÃO DE VERIFICAÇÃO DO RADIOBUTTON
  const [selectedOption, setSelectedOption] = useState('Data'); 

  // FUNÇÃO PARA TROCAR O VALOR DO RADIO BUTTON
  function onValueChange(event){
    // ALTERA O VALOR DO ESTADO DO RADIOBUTTON
    setSelectedOption(event.target.value)
  }

  if(loading){
    return(
      <div>
        <Header/>
        <div className="content">
          <Title name="Tarefas">
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
        <Title name="Tarefas">
          <FaTasks size={25}/>
        </Title>

        {/* DIV DE PESQUISA DE TAREFAS */}
        <div className="consultar">
          <h2>Consultar tarefas</h2>
          <label>
            <span>Título:</span>
            <input 
              type="text" 
              name="tituloPesquisa" 
              placeholder="Digite título da tarefa"
              value={tituloPesquisa}
              onChange={ (e) => { setTituloPesquisa(e.target.value)} }
            />
          </label>

          <div style={{ justifyContent: "space-around", marginTop: '20px' }}>
          <span style={{marginRight: "10px"}}>Pesquisar por:</span>
          <input 
            type='radio' 
            name="data" 
            value={"Data"}
            checked={selectedOption === "Data"}
            onChange={onValueChange}
          />
          <span style={{marginRight: "10px"}}>Data</span>

          <input 
            type='radio' 
            name="semana" 
            value={"Semana"}
            checked={selectedOption === "Semana"}
            onChange={onValueChange}
          />
          <span style={{marginRight: "10px"}}>Semana</span>

          <input 
            type='radio' 
            name="mes" 
            value={"Mes"}
            checked={selectedOption === "Mes"}
            onChange={onValueChange}
          />
          <span>Mês</span>
          </div>
          <br/>
          
          <div style={{marginBottom: '3px'}}>
            { selectedOption === "Data" ? (
              <>
                <span>Data: </span>
                  <InputMask 
                  mask="99/99/9999" 
                  type="text" 
                  name="dataPesquisa" 
                  value={dataTarefaPesquisa}
                  onChange={ (e) => { setDataTarefaPesquisa(e.target.value)} }
                />
              </>
            ): selectedOption === "Semana" ? (
              <>
                <span>De: </span>
                  <InputMask 
                  mask="99/99/9999" 
                  type="text" 
                  name="dataPesquisaInicio" 
                  value={dataTarefaInicioPesquisa}
                  onChange={ (e) => { setDataTarefaInicioPesquisa(e.target.value)} }
                />
                <span>Até: </span>
                  <InputMask 
                  mask="99/99/9999" 
                  type="text" 
                  name="dataPesquisaFinal" 
                  value={dataTarefaFinalPesquisa}
                  onChange={ (e) => { setDataTarefaFinalPesquisa(e.target.value)} }
                />
              </>
            ):(
              <>
                <span>Mês: </span>
                <select value={mesSelected} onChange={handleChangeMes} style={{ width: '40%', marginRight: '20%' }} >
                  <option key={0} value={0}>Selecione um mês</option>  
                  <option key={0o1} value={0o1}> Janeiro </option>
                  <option key={0o2} value={0o2}> Fevereiro </option>
                  <option key={0o3} value={0o3}> Março </option>
                  <option key={0o4} value={0o4}> Abril </option>
                  <option key={0o5} value={0o5}> Maio </option>
                  <option key={0o6} value={0o6}> Junho </option>
                  <option key={0o7} value={0o7}> Julho </option>
                  <option key={8} value={8}> Agosto </option>
                  <option key={9} value={9}> Setembro </option>
                  <option key={10} value={10}> Outubro </option>
                  <option key={11} value={11}> Novembro </option>
                  <option key={12} value={12}> Dezembro </option>      
                </select>
              </>
            )}
          </div>
          
          <br/>
        
          <span>Tags:</span>
          <div style={{marginTop: "5px", display: "flex", flexDirection: "row" }}>
            { tags.map(value => {
              return (
                <div key={value.id} style={{ marginRight: "5px"}}>
                  <input 
                    type="checkbox" 
                    id={value.id} 
                    value={value.nome}
                    name={value.id}
                    onChange={(e) => handleCheck(e)} 
                  /> 
                  {value.nome}
                </div> 
              )
            })}
          </div>

          <button style={{ marginRight: '10px'}}className="btn-search" onClick={handlePesquisar}>
            <FiSearch color="#FFF" size={20}/>
            Pesquisar
          </button>
        </div>
        {/* FIM DA DIV DE PESQUISA */}

        <div className="buttons-header">
          <button onClick={ toggleModal }  className="btn-new">
            <FiPlus color="#FFF" size={25}/>
            Adicionar nova Tarefa
          </button>
        </div>
        <>
          { tarefas.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhuma tarefa encontrada.</span>
            </div>
          ) : (
            <>  
              <DataTable
                columns={columns}
                data={tarefas}
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
          titulo={editar ? "Editar Tarefa" : "Adicionar nova Tarefa"}
          close={ () => setModal(!modal) }
        >
          <form onSubmit={editar ? handleUpdate : handleSubmit}>                
            <label style={{display: 'flex', alignItems:'left'}}>
              <span>Título:</span>
              <input 
                type="text" 
                name="titulo" 
                placeholder="Digite título da tarefa"
                required 
                value={editar !== '' ? tituloEdit : titulo}
                onChange={
                    (e) => {editar !== '' ? setTituloEdit(e.target.value) : setTitulo(e.target.value)}
                }
              />
            </label>
            <label style={{display: 'flex', alignItems:'left'}}>
              <span>Descrição:</span>
              <input 
                type="textarea" 
                name="descricao" 
                placeholder="Digite a descrição da tarefa"
                required 
                value={editar !== '' ? descricaoEdit : descricao}
                onChange={
                    (e) => {editar !== '' ? setDescricaoEdit(e.target.value) : setDescricao(e.target.value)}
                }
              />
            </label>
            <label>
                <span>Data:</span>
                <InputMask 
                  mask="99/99/9999" 
                  type="text" 
                  name="data" 
                  placeholder="Digite a data"
                  required 
                  value={editar !== '' ? dataTarefaEdit : dataTarefa}
                  onChange={
                      (e) => {editar !== '' ? setDataTarefaEdit(e.target.value) : setDataTarefa(e.target.value)}
                  }
                />
            </label>
            <label>
              <span>Hora:</span>
              <InputMask 
                mask="99:99:99" 
                type="text" 
                name="hora" 
                placeholder="Digite a hora"
                value={editar !== '' ? horaTarefaEdit : horaTarefa}
                onChange={
                    (e) => {editar !== '' ? setHoraTarefaEdit(e.target.value) : setHoraTarefa(e.target.value)}
                }
              />
            </label>
            <label>
              <span>Tempo de Duração:</span>
              <InputMask 
                mask="99:99:99" 
                type="text" 
                name="tempoDuracao" 
                placeholder="Digite o tempo de duração"
                value={editar !== '' ? tempoDuracaoEdit : tempoDuracao}
                onChange={
                    (e) => {editar !== '' ? setTempoDuracaoEdit(e.target.value) : setTempoDuracao(e.target.value)}
                }
              />
            </label>
            <label>
              <span>Tag:</span>
              {/* COMBOBOX DE TAGS */}
              { 
                loadTags ? (
                  <input 
                  type="textarea" 
                  disabled={true}
                  placeholder="Carregando..."
                  value="Carregando"
                  />
                ) : (
                  <select value={tagsSelected} onChange={handleChangeTag} style={{ width: '40%', marginRight: '20%' }} >
                    { tags.map((item, id) => {
                      return(
                        <option key={item.id} value={item.id}>
                          { item.nome }
                        </option>
                      )
                    })}
                  </select>
                )
              }
            </label>

            <button className="btn">{ editar ? 'Alterar' : 'Salvar'}</button>
          </form>
        </Modal>
      }
      { modalTag &&
        <Modal 
          titulo="Alterar Tag da Tarefa"
          close={ () => setModalTag(!modalTag) }
        >
          <form onSubmit={handleAlterarTag}>   
            <label>
              <span>Tag:</span>
              {/* COMBOBOX DE TAGS */}
              { 
                loadTags ? (
                  <input 
                  type="textarea" 
                  disabled={true}
                  placeholder="Carregando..."
                  value="Carregando"
                  />
                ) : (
                  <select value={tagsSelected} onChange={handleChangeTag} style={{ width: '40%', marginRight: '20%' }} >
                    { tags.map((item, id) => {
                      return(
                        <option key={item.id} value={item.id}>
                          { item.nome }
                        </option>
                      )
                    })}
                  </select>
                )
              }
            </label>

            <button className="btn">Alterar</button>
          </form>
        </Modal>
      }

      {modalDelete &&
        <Modal 
          titulo="Excluir Tarefa"
          close={ () => setModalDelete(!modalDelete) }
        >
          <form onSubmit={handleDeleteData}>   
            <label>
              <p>Tem certeza que deseja excluir a tarefa <b>{deleteData.titulo} </b>? </p>
            </label>
            <button className="btn-delete">Excluir</button>
          </form>
        </Modal>
      }
    </div>
  )
}