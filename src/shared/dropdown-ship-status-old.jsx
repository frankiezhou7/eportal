const React = require('react');
const _ = require('eplodash');
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;

const getShipStatusTypes = global.api.epds.getShipStatusTypes;

const DropDownShipStatusOlder = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownShipStatus/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    getShipStatusTypes: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      shipStatusTypes: [],
      value: this.props.value,
    };
  },

  componentWillMount() {
    let { shipStatusTypes } = this.state;
    if (!shipStatusTypes || shipStatusTypes.length === 0) {
      if (_.isFunction(getShipStatusTypes)) {
        getShipStatusTypes
          .promise()
          .then((res, rej) => {
            if(res && res.response){
              this.setState({shipStatusTypes: res.response});
            }
          })
          .catch(() => {});
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;
    if (this.state.value !== value) {
      this.setState({
        value: value,
      });
    }
  },

  clearValue() {
    this.setState({
      value: null
    });
  },

  getValue() {
    return this.state.value;
  },

  render() {
    let {
      disabled,
      value,
      getShipStatusTypes,
      ...other,
    } = this.props;
    let { shipStatusTypes } = this.state;
    let menuItems = [];
    shipStatusTypes && shipStatusTypes.forEach((shipStatus, index) => {
      menuItems.push(
        <MenuItem
          key={index}
          primaryText={shipStatus.name}
          value={shipStatus.code}
        />,
      );
    });

    return(
      <SelectField
        {...other}
        ref="shipStatusTypes"
        disabled={disabled}
        floatingLabelText={this.t('nTextShipStatus')}
        value={this.state.value}
        onChange={this._handleChange}
      >
        {menuItems}
      </SelectField>
    );
  },

  _handleChange(event, index, value) {
    this.setState({
      value: value,
    });
  },
});

module.exports = DropDownShipStatusOlder;
