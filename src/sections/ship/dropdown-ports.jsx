const React = require('react');
const _ = require('eplodash');
const Translatable = require('epui-intl').mixin;
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const PropTypes = React.PropTypes;
const { connect } = require('react-redux');
const MIN_KEY_LENGTH = 2;
const domain = require('~/src/store/domain');

const DropDownPorts = React.createClass({

  mixins: [Translatable],

  translations: require(`epui-intl/dist/DropDownPorts/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    nTextInputToFindPort: PropTypes.string,
    nTextChoosePort: PropTypes.string,
    nTextNoPortFound: PropTypes.string,
    nTextSuggestedPorts: PropTypes.string,
    ports: PropTypes.object,
    searchPorts: PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {};
  },

  clearValue() {
    this.setState({
      value: null
    });
    this.refs.dropdown.clearValue();
  },

  getValue() {
    return this.state.value;
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

  render() {
    let styles = this.getStyles();
    let ports = this.state.ports;
    let entries = ports && ports.get('entries');
    let dataSource = [];
    if (entries) {
      entries.forEach((e, i) => {
        dataSource.push({
          text: e.get('name'),
          value: e.get('_id'),
        });
      });
    }
    let menuProps = {
      maxHeight: 400,
    };

    return (
      <AutoComplete
        {...this.props}
        ref='dropdown'
        dataSource={dataSource}
        filter={this._filter}
        floatingLabelStyle={styles.floatingLabelStyle}
        floatingLabelText={this.props.label}
        labelStyle={styles.labelStyle}
        disabled={this.props.disabled}
        errorText={this.props.errorText}
        hintText={this.t('nTextInputToFindPort')}
        menuProps={menuProps}
        notFoundText={this.t('nTextNoPortFound')}
        foundText={this.t('nTextChoosePort')}
        suggestionLabel={this.t('nTextSuggestedPorts')}
        onClose={this._handleClose}
        onUpdateInput={this._handleQueryChange}
        onNewRequest={this._handleDropdownChange}
        underlineStyle={styles.underlineStyle}
        showNullItem={true}
        nullItemText={this.t('nTextInputToFindPort')}
      />
    );
  },

  _filter(searchText, key) {
    return true;
  },

  _handleClose() {
    // clearQuery();
  },

  _handleDropdownChange(selectedItem) {
    this.setState({
      value: selectedItem
    });
  },

  _handleQueryChange(qry) {
    if(qry.length < MIN_KEY_LENGTH) { return; }
    let {
      searchPorts,
    } = global.api.epds;

    if (_.isFunction(searchPorts)) {
      searchPorts
        .promise({
          query: qry,
          size: 10,
        })
        .then(res => {
          let response = res.response;
          let ports = domain.create('Ports', response);

          this.setState({
            ports: ports,
          });
        })
        .catch(err => {
          //TODO: handle error
        });
    }
  },

});

module.exports = DropDownPorts;

// module.exports = connect(
//   (state, props) => {
//     return {
//       ...props,
//       ports: state.getIn(['search', 'port']),
//       searchPorts,
//     };
//   },
//   null,
//   null,
//   {withRef: true} // If true, stores a ref to the wrapped component instance and makes it available via getWrappedInstance() method. Defaults to false.
// )(DropDownPorts);
