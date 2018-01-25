const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const DropDownShipTypesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownShipTypes/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    getShipTypes: PropTypes.func,
    label: PropTypes.string,
    nTextShipType: PropTypes.string,
    shipTypes: PropTypes.object,
    style: PropTypes.object,
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
      getShipTypes,
      shipTypes,
    } = this.props;

    if (!shipTypes || shipTypes.size === 0) {
      if (_.isFunction(getShipTypes)) {
        getShipTypes();
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

  isValid(){
    return true;
  },

  getStyles() {
    let styles = {
      root: {
        verticalAlign: 'middle',
      },
    };

    return styles;
  },

  render() {
    let {
      disabled,
      shipTypes,
      getShipTypes,
      style,
      value,
      ...others
    } = this.props;

    let styles = this.getStyles();

    let menuItems = [];
    shipTypes && shipTypes.forEach((shipType, index) => {
      menuItems.push(
        <MenuItem
          key={index}
          primaryText={shipType.get('name')}
          value={shipType.get('code')}
        />,
      );
    });

    return (
      <SelectField
        {...others}
        ref="shipTypes"
        disabled={disabled}
        floatingLabelText={this.t('nTextShipType')}
        onChange={this._handleChange}
        style={Object.assign(styles.root, style)}
        value={this.state.value}
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
      getShipTypes: global.api.epds.getShipTypes,
      shipTypes: state.get('shipTypes'),
    };
  },
  null,
  null,
  {withRef: true}
)(DropDownShipTypesInner);
