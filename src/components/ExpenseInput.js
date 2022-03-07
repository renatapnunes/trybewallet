import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getCurrencies from '../actions/getCurrencies';
import addExpenses from '../actions/addExpenses';
import editExpense from '../actions/editExpense';

const defaultTag = 'Alimentação';

class ExpenseIpunt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: (0.00).toFixed(2),
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: defaultTag,
      exchangeRates: [],
      id: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.inputValue = this.inputValue.bind(this);
    this.inputDescription = this.inputDescription.bind(this);
    this.selectCurrency = this.selectCurrency.bind(this);
    this.selectMethod = this.selectMethod.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.add = this.add.bind(this);
    this.updateState = this.updateState.bind(this);
    this.edit = this.edit.bind(this);
    // this.stateEditing = this.stateEditing.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { editing } = this.props;
    if (prevProps.editing !== editing) {
      this.stateEditing();
    }
  }

  stateEditing() {
    const { editingExpense } = this.props;
    this.setState({
      value: editingExpense.value,
      description: editingExpense.description,
      currency: editingExpense.currency,
      method: editingExpense.method,
      tag: editingExpense.tag,
      exchangeRates: editingExpense.exchangeRates,
      id: editingExpense.id,
    });
  }

  handleChange({ target }) {
    const { name, value } = target;

    this.setState({
      [name]: value,
    });
  }

  async add() {
    const { setGetCurrencies, currencies, setAddExpenses } = this.props;
    const arrayCurrencies = [];
    arrayCurrencies.push(currencies);

    await setGetCurrencies();
    await this.setState({
      exchangeRates: arrayCurrencies,
    });

    await setAddExpenses(this.state);

    this.updateState();
  }

  updateState() {
    this.setState((prevState) => ({
      value: (0.00).toFixed(2),
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: defaultTag,
      exchangeRates: [],
      id: prevState.id + 1,
    }));
  }

  edit() {
    const { setAddExpenses, setEditExpense } = this.props;
    setAddExpenses(this.state);
    const resetState = {
      value: (0.00).toFixed(2),
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: defaultTag,
      exchangeRates: [],
      id: 0,
    };

    setEditExpense(resetState, false);
  }

  inputValue() {
    const { value } = this.state;

    return (
      <label htmlFor="value">
        Valor
        <input
          type="text"
          id="value"
          name="value"
          onChange={ this.handleChange }
          value={ value }
        />
      </label>
    );
  }

  inputDescription() {
    const { description } = this.state;

    return (
      <label htmlFor="description">
        Descrição
        <input
          type="text"
          id="description"
          name="description"
          onChange={ this.handleChange }
          value={ description }
        />
      </label>
    );
  }

  selectCurrency() {
    const { currency } = this.state;
    const { currencies } = this.props;

    const currenciesFiltered = Object.keys(currencies)
      .filter((currencyName) => currencyName !== 'USDT');

    return (
      <label htmlFor="currency">
        Moeda
        <select
          id="currency"
          name="currency"
          onChange={ this.handleChange }
          value={ currency }
        >
          { currenciesFiltered.map((opCurrency) => (
            <option key={ opCurrency } value={ opCurrency }>{ opCurrency }</option>
          ))}
        </select>
      </label>
    );
  }

  selectMethod() {
    const { method } = this.state;
    const methods = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];

    return (
      <label htmlFor="method">
        Método de pagamento
        <select
          id="method"
          name="method"
          onChange={ this.handleChange }
          value={ method }
        >
          { methods.map((opMethod) => (
            <option key={ opMethod } value={ opMethod }>{ opMethod }</option>
          ))}
        </select>
      </label>
    );
  }

  selectTag() {
    const { tag } = this.state;
    const tags = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde', 'Outro'];

    return (
      <label htmlFor="tag">
        Tag
        <select
          id="tag"
          name="tag"
          onChange={ this.handleChange }
          value={ tag }
        >
          { tags.map((opTag) => (
            <option key={ opTag } value={ opTag }>{ opTag }</option>
          ))}
        </select>
      </label>
    );
  }

  render() {
    const { editing } = this.props;
    return (
      <form>
        { this.inputValue() }
        { this.inputDescription() }
        { this.selectCurrency() }
        { this.selectMethod() }
        { this.selectTag() }
        {
          editing
            ? <button type="button" onClick={ this.edit }>Editar despesa</button>
            : <button type="button" onClick={ this.add }>Adicionar despesa</button>
        }
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  editingExpense: state.wallet.editingExpense,
  editing: state.wallet.editing,
});

const mapDispatchToProps = (dispatch) => ({
  setGetCurrencies: () => dispatch(getCurrencies()),
  setAddExpenses: (expense) => dispatch(addExpenses(expense)),
  setEditExpense: (expense, status) => dispatch(editExpense(expense, status)),
});

ExpenseIpunt.propTypes = ({
  currencies: PropTypes.arrayOf(Object).isRequired,
  editingExpense: PropTypes.arrayOf(Object).isRequired,
  editing: PropTypes.bool.isRequired,
  setGetCurrencies: PropTypes.func.isRequired,
  setAddExpenses: PropTypes.func.isRequired,
  setEditExpense: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseIpunt);
