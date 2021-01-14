import React from 'react'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'

import { withRouter } from 'react-router-dom'
import * as messages from '../../components/toastr'

import LancamentoService from '../../app/service/lancamentoService'
import AuthService from '../../app/service/authService'


class CadastroLancamentos extends React.Component {

	state = {
		id: null,
		descricao: '',
		valor: '',
		mes: '',
		ano: '',
		tipo: '',
		status: '',
		usuario: null,
		atualizando: false
	}

	constructor() {
		super();
		this.service = new LancamentoService();
	}

	componentDidMount() { // executa depois de render()
		const params = this.props.match.params
		if (params.id) {
			this.service.obterPorId(params.id)
				.then(response => {
					this.setState({ ...response.data, atualizando: true }) // SPREAD OPERATOR DO ECMA SCRIPT
				})
				.catch(error => {
					messages.mensagemErro(error.response.data)
				})
		}
	}

	submit = () => {
		const usuarioLogado = AuthService.obterUsuarioAutenticado()

		const { descricao, valor, mes, ano, tipo } = this.state;
		const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

		try {
			this.service.validar(lancamento)
		} catch (erro) {
			const mensagens = erro.mensagens;
			mensagens.forEach(msg => messages.mensagemErro(msg));
			return false;
		}

		this.service.salvar(lancamento)
			.then(response => {
				this.props.history.push('/consulta-lancamentos')
				messages.mensagemSucesso('Lancamento cadastrado com sucesso!')
			}).catch(error => {
				messages.mensagemErro(error.response.data)
			});
	}

	atualizar = () => {
		const { descricao, valor, mes, ano, tipo, status, usuario, id } = this.state;
		const lancamento = { descricao, valor, mes, ano, tipo, usuario, status, id };
		this.service.atualizar(lancamento)
			.then(response => {
				this.props.history.push('/consulta-lancamentos')
				messages.mensagemSucesso('Lancamento atualizado com sucesso!')
			}).catch(error => {
				messages.mensagemErro(error.response.data)
			});
	}

	handleChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;
		this.setState({ [name]: value })
	}

	render() {
		const tipos = this.service.obterListaTipos();
		const meses = this.service.obterListaMeses();

		return (
			<Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
				<div className="row">
					<div className="col-lg-12">
						<FormGroup id="inputDescricao" label="Descrição: *">
							<input id="inputDescricao"
								type="text"
								className="form-control"
								name="descricao"
								value={this.state.descricao}
								onChange={this.handleChange} />
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6">
						<FormGroup id="inputAno" label="Ano: *">
							<input id="inputAno"
								type="text"
								className="form-control"
								name="ano"
								value={this.state.ano}
								onChange={this.handleChange} />
						</FormGroup>
					</div>
					<div className="col-lg-6">
						<FormGroup id="inputMes" label="Mês: *">
							<SelectMenu
								id="inputMes"
								lista={meses}
								className="form-control"
								name="mes"
								value={this.state.mes}
								onChange={this.handleChange} />
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-4">
						<FormGroup id="inputValor" label="Valor: *">
							<input id="inputValor"
								type="text"
								className="form-control"
								name="valor"
								value={this.state.valor}
								onChange={this.handleChange} />
						</FormGroup>
					</div>
					<div className="col-lg-4">
						<FormGroup id="inputTipo" label="Tipo: *">
							<SelectMenu id="inputTipo"
								lista={tipos}
								className="form-control"
								name="tipo"
								value={this.state.tipo}
								onChange={this.handleChange} />
						</FormGroup>
					</div>
					<div className="col-lg-4">
						<FormGroup id="inputStatus" label="Status: *">
							<input id="inputStatus"
								type="text"
								className="form-control"
								disabled
								name="status"
								value={this.state.status}
								onChange={this.handleChange} />
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12">
						{this.state.atualizando ?
							(
								<button onClick={this.atualizar}
									type="button"
									className="btn btn-primary">
									<i className="pi pi-refresh"></i> Atualizar
								</button>
							) :
							(
								<button onClick={this.submit}
									type="button"
									className="btn btn-success">
									<i className="pi pi-save"></i> Salvar
								</button>
							)}
						<button onClick={e => this.props.history.push('/consulta-lancamentos')}
							type="button"
							className="btn btn-danger">
							<i className="pi pi-times"></i> Cancelar
						</button>
					</div>
				</div>
			</Card>
		)
	}
}

export default withRouter(CadastroLancamentos);