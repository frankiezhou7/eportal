const React = require('react');
const _ = require('eplodash');
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const domain = require('~/src/store/domain');
const { connect } = require('react-redux');

const MIN_KEY_LENGTH = 2;

const DropDownPorts = React.createClass({
  mixins: [Translatable],

  translations: require(`epui-intl/dist/DropDownPorts/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    label: PropTypes.string,
    nTextChoosePort: PropTypes.string,
    nTextInputToFindPort: PropTypes.string,
    nTextNoPortFound: PropTypes.string,
    nTextSuggestedPorts: PropTypes.string,
    onChange: PropTypes.func,
    ports: PropTypes.object,
    searchPorts: PropTypes.func,
    type: PropTypes.oneOf(['Port','RegistryPort']),
    value: PropTypes.object,
    menuStyle: PropTypes.object,
    keyLabel: PropTypes.string,
    keyLabelStyle: PropTypes.object,
    required: PropTypes.bool,
    disableInit: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disabled: false,
      type: 'Port',
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
      ports: [],
      fullValue: {},
    };
  },

  componentWillMount() {
    this._fetchPorts(this.props.disableInit);
  },

  clearValue() {
    this.setState({
      value: null,
    });

    this.port.clearValue();
  },

  isValid() {
    let valid = true;
    if(this.props.required && !this.state.value) { valid = false };
    return new Promise((res, rej) => {
      res(valid);
    });
  },

  getValue() {
    let val = this.state.value;
    if(!val) { return null; }

    return val;
  },

  getFullValue() {
    let val = this.state.fullValue;
    if(!val) { return null; }

    return val;
  },

  getStyles() {
    let styles = {
      floatingLabelStyle: {
        left: 0,
      },
      labelStyle: {
        paddingLeft: '0px',
      },
      underlineStyle: {
        margin: 0,
      },
    };

    return styles;
  },

  isChanged() {
    return this.port.isChanged();
  },

  render() {
    let {
      disabled,
      errorText,
      label,
      keyLabel,
      keyLabelStyle,
      ...others,
    } = this.props;
    let styles = this.getStyles();
    let dataSource = [];
    let { ports, value, allPorts } = this.state;
    let val =  _.isObject(value) && value._id ? value._id : value;
    let found = false;
    ports.forEach((port, i) => {
      if (val === port._id) {
        found = true;
      }
      dataSource.push({
        text: port.name,
        value: port._id,
      });
    });

    if (_.isObject(value) && value._id && value.name && !found) {
      dataSource.push({
        text: value.name,
        value: value._id,
      });
    }

    let menuProps = {
      maxHeight: 400,
    };

    if(ports && ports.length > 0 && !found){
      value = _.find(allPorts, ['_id', val]);
    }

    return (
      <AutoComplete
        {...others}
        ref={(ref) => this.port = ref}
        dataSource={dataSource}
        disabled={disabled}
        errorText={errorText}
        filter={this._filter}
        floatingLabelStyle={styles.floatingLabelStyle}
        floatingLabelText={label || this.t('nText' + this.props.type)}
        foundText={this.t('nTextChoosePort')}
        hintText={this.t('nTextInputToFindPort')}
        labelStyle={styles.labelStyle}
        menuProps={menuProps}
        notFoundText={this.t('nTextNoPortFound')}
        nullItemText={this.t('nTextInputToFindPort')}
        onClose={this._handleClose}
        onNewRequest={this._handleDropdownChange}
        onUpdateInput={this._handleQueryChange}
        showNullItem={true}
        suggestionLabel={this.t('nTextSuggestedPorts')}
        underlineStyle={styles.underlineStyle}
        value={_.isObject(value) ? value.name : value}
        keyLabel={keyLabel}
        keyLabelStyle={keyLabelStyle}
      />
    );
  },

  _filter(searchText, key) {
    return true;
  },

  _handleDropdownChange(selectedItem, index, value) {
    if(this.props.onChange) this.props.onChange(selectedItem, value);

    this.setState({
      value: value,
      fullValue: selectedItem,
    });
  },

  _fetchPorts(disableInit) {
    if(disableInit) return;
    let { findPorts } = global.api.epds;
    if (!_.isFunction(findPorts)) {
      throw new Error(`api "findPorts" is wrong: ${findPorts}`)
    }

    findPorts
    .promise({
      cursor: 0,
      size: -1,
      total: 0,
    },)
    .then(res => {
      let ports = res.response.entries;
      this.setState({
        allPorts: ports,
      });
    })
    .catch(err => {
      console.error(err)
    });
  },

  _handleQueryChange(qry) {
    if(qry.length < MIN_KEY_LENGTH) {
      return;
    }

    let { searchPorts } = global.api.epds;
    if (!_.isFunction(searchPorts)) {
      throw new Error(`api "searchPorts" is wrong: ${searchPorts}`)
    }

    searchPorts
    .promise({ query: { name: qry, size: 10 } })
    .then(res => {
      let ports = res.response.entries;
      this.setState({
        ports: ports,
      });
    })
    .catch(err => {
      console.error(err)
    });
  },
});

module.exports = DropDownPorts;
