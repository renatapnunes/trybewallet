import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deleteExpenses from '../actions/deleteExpenses';
import editExpense from '../actions/editExpense';

class ExpensesTable extends Component {
  constructor() {
    super();

    this.expenseLine = this.expenseLine.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
  }

  delete({ target }) {
    const { expenses, setDeleteExpenses } = this.props;
    const deletedExpense = expenses.filter(({ id }) => id !== +target.value);

    setDeleteExpenses(deletedExpense);
  }

  edit({ target }) {
    const { expenses, setEditExpense, setDeleteExpenses } = this.props;
    const expenseEdit = expenses.find(({ id }) => id === +target.value);
    const deletedExpense = expenses.filter(({ id }) => id !== +target.value);

    setEditExpense(expenseEdit, true);
    setDeleteExpenses(deletedExpense);
  }

  expenseLine() {
    const { expenses } = this.props;

    return expenses.map((expense) => {
      const {
        description,
        tag,
        method,
        value,
        currency,
        exchangeRates,
        id,
      } = expense;
      const { name, ask } = exchangeRates[0][currency];
      const currencyName = name.split('/', 1);
      const price = (value * ask).toFixed(2);

      return (
        <tr key={ id } id={ id }>
          <td>{ description }</td>
          <td>{ tag }</td>
          <td>{ method }</td>
          <td>{ value }</td>
          <td>{ currencyName[0] }</td>
          <td>{ Number(ask).toFixed(2) }</td>
          <td>{ price }</td>
          <td>Real</td>
          <td>
            <button
              type="button"
              onClick={ this.delete }
              data-testid="delete-btn"
              value={ id }
            >
              Excluir
            </button>
            <button
              type="button"
              onClick={ this.edit }
              data-testid="edit-btn"
              value={ id }
            >
              Editar
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table>
        <thead>
          <th>Descrição</th>
          <th>Tag</th>
          <th>Método de pagamento</th>
          <th>Valor</th>
          <th>Moeda</th>
          <th>Câmbio utilizado</th>
          <th>Valor convertido</th>
          <th>Moeda de conversão</th>
          <th>Editar/Excluir</th>
        </thead>
        <tbody>
          { this.expenseLine() }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  setDeleteExpenses: (expenses) => dispatch(deleteExpenses(expenses)),
  setEditExpense: (expense, status) => dispatch(editExpense(expense, status)),
});

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(Object).isRequired,
  setDeleteExpenses: PropTypes.func.isRequired,
  setEditExpense: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
