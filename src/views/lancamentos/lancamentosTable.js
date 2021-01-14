import React from 'react'
import CurrencyFormatter from 'currency-formatter'

export default props => {

	const rows = props.lancamentos.map(lancamento => {
		return (
			<tr key={lancamento.id}>
				<th scope="row">{lancamento.descricao}</th>
				<td>{CurrencyFormatter.format(lancamento.valor, { locale: 'pt-BR' })}</td>
				<td>{lancamento.tipo}</td>
				<td>{lancamento.mes}</td>
				<td>{lancamento.status}</td>
				<td>
					<button onClick={e => props.alterarStatus(lancamento, 'EFETIVADO')}
						disabled={lancamento.status !== 'PENDENTE'}
						title="Efetivar"
						type="button"
						className="btn btn-success">
						<i className="pi pi-check"></i>
					</button>
					<button onClick={e => props.alterarStatus(lancamento, 'CANCELADO')}
						disabled={lancamento.status !== 'PENDENTE'}
						title="Cancelar"
						type="button"
						className="btn btn-warning">
						<i className="pi pi-times"></i>
					</button>
					<button onClick={e => props.editAction(lancamento.id)}
						title="Editar"
						type="button"
						className="btn btn-primary">
						<i className="pi pi-pencil"></i>
					</button>
					<button onClick={e => props.deleteAction(lancamento)}
						title="Deletar"
						type="button"
						className="btn btn-danger">
						<i className="pi pi-trash"></i>
					</button>
				</td>
			</tr>
		)
	})

	return (
		<table className="table table-hover">
			<thead>
				<tr>
					<th scope="col">Descrição</th>
					<th scope="col">Valor</th>
					<th scope="col">Tipo</th>
					<th scope="col">Mês</th>
					<th scope="col">Situação</th>
					<th scope="col">Ações</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}