import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'
import LancamentoService from '../../app/service/lancamentoService'
import AuthService from '../../app/service/authService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class ConsultaLancamento extends React.Component {
	state = {
		ano: '',
		mes: '',
		tipo: '',
		descricao: '',
		lancamentos: [],
		displayConfirmation: false,
		lancamentoDeletar: {}
	}

	constructor() {
		super();
		this.service = new LancamentoService();
	}

	buscar = () => {
		if (!this.state.ano) {
			messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
			return false;
		}

		const usuarioLogado = AuthService.obterUsuarioAutenticado();

		const lancamentoFiltro = {
			ano: this.state.ano,
			mes: this.state.mes,
			tipo: this.state.tipo,
			descricao: this.state.descricao,
			usuario: usuarioLogado.id
		}

		this.service
			.consultar(lancamentoFiltro)
			.then(response => {
				const lista = response.data;
				if(lista.length < 1) {
					messages.mensagemAlerta("Nenhum resultado encontrado.")
				}
				this.setState({ lancamentos: lista })
			})
			.catch(error => {
				console.log(error)
			})
	}

	editar = (id) => {
		this.props.history.push(`/cadastro-lancamentos/${id}`)
	}

	deletar = () => {
		this.service.deletar(this.state.lancamentoDeletar.id)
			.then(response => {
				const lancamentos = this.state.lancamentos;
				const index = lancamentos.indexOf(this.state.lancamentoDeletar);
				lancamentos.splice(index, 1);
				this.setState({ lancamentos: lancamentos, displayConfirmation: false });
				messages.mensagemSucesso('Lançamento deletado com sucesso!')
			}).catch(error => {
				messages.mensagemErro('Ocorreu um erro ao tentar deletar o Lançamento.')
			})
	}

	abrirConfirmacao = (lancamento) => {
		this.setState({ displayConfirmation: true, lancamentoDeletar: lancamento })
	}

	cancelarDelecao = () => {
		this.setState({ displayConfirmation: false, lancamentoDeletar: {} })
	}

	preparaFormularioCadastro = () => {
		this.props.history.push('/cadastro-lancamentos')
	}

	alterarStatus = (lancamento, status) => {
		this.service
			.alterarStatus(lancamento.id, status)
			.then(response => {
				const lancamentos = this.state.lancamentos;
				const index = lancamentos.indexOf(lancamento);
				if (index !== -1) {
					lancamento.status = status;
					lancamentos[index] = lancamento;
					this.setState({ lancamentos })
				}
				messages.mensagemSucesso("Status atualizado com sucesso!")
			})
	}

	render() {
		const meses = this.service.obterListaMeses()
		const tipos = this.service.obterListaTipos()

		const confirmDialogFooter = (
			<div>
				<Button label="Confirmar"
					icon="pi pi-check"
					onClick={this.deletar} />
				<Button label="Cancelar"
					icon="pi pi-times"
					onClick={this.cancelarDelecao}
					className="p-button-secondary" />
			</div>
		);

		return (
			<Card title="Consulta Lançamento">
				<div className="row">
					<div className="col-lg-6">
						<div className="bs-component">
							<FormGroup label="Ano: *" htmlFor="inputAno">
								<input type="text"
									className="form-control"
									id="inputAno"
									value={this.state.ano}
									onChange={e => this.setState({ ano: e.target.value })}
									placeholder="Digite o Ano" />
							</FormGroup>

							<FormGroup label="Mês: *" htmlFor="inputMes">
								<SelectMenu id='inputMes'
									value={this.state.mes}
									className='form-control'
									onChange={e => this.setState({ mes: e.target.value })}
									lista={meses} />
							</FormGroup>

							<FormGroup label="Descrição:" htmlFor="inputDesc">
								<input type="text"
									className='form-control'
									id='inputDesc'
									value={this.state.descricao}
									onChange={e => this.setState({ descricao: e.target.value })}
									placeholder="Digite a descrição" />
							</FormGroup>

							<FormGroup label="Tipo Lançamento:" htmlFor="inputTipo">
								<SelectMenu id='inputTipo'
									value={this.state.tipo}
									className='form-control'
									onChange={e => this.setState({ tipo: e.target.value })}
									lista={tipos} />
							</FormGroup>

							<button onClick={this.buscar}
								type="button"
								className="btn btn-success">
								<i className="pi pi-search"></i> Buscar 								
							</button>
							<button onClick={this.preparaFormularioCadastro}
								type="button"
								className="btn btn-danger">
								<i className="pi pi-plus"></i> Cadastrar
							</button>
						</div>
					</div>
				</div>
				<br />
				<div className="row">
					<div className="col-lg-12">
						<div className="bs-component">
							<LancamentosTable lancamentos={this.state.lancamentos}
								deleteAction={this.abrirConfirmacao}
								editAction={this.editar}
								alterarStatus={this.alterarStatus} />
						</div>
					</div>
				</div>
				<div>
					<Dialog header="Confirmação"
						visible={this.state.displayConfirmation}
						style={{ width: '50vw' }}
						footer={confirmDialogFooter}
						modal={true}
						onHide={() => this.setState({ displayConfirmation: false })}>
						Confirma a exclusão deste Lançamento?
					</Dialog>
				</div>
			</Card>
		)
	}
}

export default withRouter(ConsultaLancamento);