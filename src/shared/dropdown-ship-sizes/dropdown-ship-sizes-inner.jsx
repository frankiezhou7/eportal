const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');
const MIN_KEY_LENGTH = 2;

const DropDownShipSizesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownShipSizes/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    getShipSizeTypes: PropTypes.func,
    label: PropTypes.string,
    shipSizes: PropTypes.object,
    value: PropTypes.string,
    onChange:PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
    };
  },

  componentWillMount() {

    let {
      getShipSizeTypes,
      shipSizes,
    } = this.props;

    if (!shipSizes || shipSizes.size === 0) {
      if (_.isFunction(getShipSizeTypes)) {
        getShipSizeTypes();
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

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      disabled,
      getShipSizeTypes,
      shipSizes,
      value,
      ...others,
    } = this.props;

    let menuItems = [];
    shipSizes && shipSizes.forEach((shipSize, index) => {
      menuItems.push(
        <MenuItem
          key={index}
          primaryText={shipSize.get('name')}
          value={shipSize.get('code')}
        />,
      );
    });

    return(
      <SelectField
        {...others}
        ref="shipSizes"
        disabled={disabled}
        floatingLabelText={this.t('nLabelShipSize')}
        value={this.state.value}
        onChange={this._handleChange}
      >
        {menuItems}
      </SelectField>
    );
  },

  _handleChange(event, index, value) {
    if(this.props.onChange) this.props.onChange(event, index, value);
    this.setState({
      value: value,
    });
  },
});

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      getShipSizeTypes:global.api.epds.getShipSizeTypes,
      shipSizes: state.get('shipSizes'),
    };
  },
  null,
  null,
  {withRef: true}
)(DropDownShipSizesInner);
