import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getCurrencies from '../actions/getCurrencies';
import ExpenseInput from '../components/ExpenseInput';
import ExpensesTable from '../components/ExpensesTable';

class Wallet extends React.Component {
  constructor() {
    super();

    this.calculateExpenses = this.calculateExpenses.bind(this);
  }

  componentDidMount() {
    const { setGetCurrencies } = this.props;
    setGetCurrencies();
  }

  calculateExpenses() {
    const { expenses } = this.props;

    const totalExpense = expenses.reduce((acc, { value, currency, exchangeRates }) => {
      const { ask } = exchangeRates[0][currency];
      return acc + (value * ask);
    }, 0);

    return totalExpense.toFixed(2);
  }

  render() {
    const { email } = this.props;

    return (
      <>
        <header>
          <p data-testid="email-field">{ email }</p>
          <p data-testid="total-field">{ `R$${this.calculateExpenses()}`}</p>
          <p data-testid="header-currency-field">BRL</p>
        </header>
        <main>
          <ExpenseInput />
          <ExpensesTable />
        </main>
      </>

    );
  }
}

const mapStateToPrpos = (state) => ({
  email: state.user.email,
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  setGetCurrencies: () => dispatch(getCurrencies()),
});

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(Object).isRequired,
  setGetCurrencies: PropTypes.func.isRequired,
};

export default connect(mapStateToPrpos, mapDispatchToProps)(Wallet);
