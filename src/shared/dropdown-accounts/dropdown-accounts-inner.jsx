const React = require('react');
const _ = require('eplodash');
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');
const ACCOUNT_TYPE = require('~/src/shared/constants').ACCOUNT_TYPE;
const MIN_KEY_LENGTH = 2;

const DropDownAccountsInner = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownAccounts/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    type: PropTypes.oneOf(_.values(ACCOUNT_TYPE)),
    disabled: PropTypes.bool,
    entries: PropTypes.object,
    label: PropTypes.string,
    nLabelOrganization: PropTypes.string,
    nTextInputToFindOrganization: PropTypes.string,
    nTextChooseOrganization: PropTypes.string,
    nTextNoOrganizationFound: PropTypes.string,
    nTextSuggestedOrganizations: PropTypes.string,
    searchAccounts: PropTypes.func,
    findAccounts: PropTypes.func,
    onChange:PropTypes.func,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      listedEntries: [],
    };
  },

  clearValue() {
    this.setState({
      value: null
    });
  },

  componentWillMount() {
    let fn = this.props.findAccounts;
    if (_.isFunction(fn)) {
      fn.promise({
        query: {
          types: this.props.type,
          role: 'TRADE'
        },
        sortby: {'name': -1},
        size: 30,
      }).then((res)=>{
        if(res.status ==='OK'){
          this.setState({listedEntries: res.response && res.response.entries});
        }
      }).catch(e => {
        alert(e);
      });
    }
  },

  getValue() {
    return this.state.value;
  },

  render() {
    let {
      disabled,
      label,
      entries,
      value,
    } = this.props;

    let { listedEntries } = this.state;
    let dataSource = [];

    if (entries) {
      dataSource = [];
      entries.forEach((e, i) => {
        dataSource.push({
          text: e.get('name'),
          value: e.get('_id'),
        });
      });
    }else if(value){
      dataSource.push(value);
    }

    if(listedEntries && listedEntries.length > 0){
      dataSource = [];
      listedEntries.forEach((e, i) => {
        dataSource.push({
          text: e.name,
          value: e._id,
        });
      });
    }

    return (
      <AutoComplete
        dataSource={dataSource}
        disabled={disabled}
        filter={this._filter}
        floatingLabelText={label || this.t('nLabelOrganization')}
        foundText={this.t('nTextChooseOrganization')}
        hintText={this.t('nTextInputToFindOrganization')}
        notFoundText={this.t('nTextNoOrganizationFound')}
        suggestionLabel={this.t('nTextSuggestedOrganizations')}
        showNullItem={true}
        fullWidth = {true}
        nullItemText={this.t('nTextInputToFindOrganization')}
        onUpdateInput={this._handleQueryChange}
        onNewRequest={this._handleDropdownChange}
      />
    );
  },

  _filter(searchText, key) {
    return true;
  },

  _handleDropdownChange(selectedItem) {
    if(this.props.onChange) this.props.onChange(selectedItem);
    this.setState({
      value: selectedItem,
    });
  },

  _handleQueryChange(qry) {
    if(qry.length < MIN_KEY_LENGTH) { return; }
    let fn = this.props.searchAccounts;
    if (_.isFunction(fn)) {
      fn({
        query: {
          name: qry,
          type: this.props.type,
          role: 'TRADE'
        },
        sortby: {'name': -1},
        size: 30,
      });
    }
  },
});

let { searchAccounts, findAccounts } = global.api.order;

module.exports = connect(
  (state, props) => {
    let accounts = state.getIn(['search', 'account']);

    return {
      entries: accounts && accounts.get('entries'),
      searchAccounts,
      findAccounts,
    };
  },
  null,
  null,
  {withRef: true} // If true, stores a ref to the wrapped component instance and makes it available via getWrappedInstance() method. Defaults to false.
)(DropDownAccountsInner);
