const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const DropDownPortTypesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownPorts/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    getPortTypes: PropTypes.func,
    label: PropTypes.string,
    nTextPortTypes: PropTypes.string,
    portTypes: PropTypes.object,
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
      getPortTypes,
      portTypes,
    } = this.props;

    if (!portTypes || portTypes.size === 0) {
      if (_.isFunction(getPortTypes)) {
        getPortTypes();
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
      root: {
        verticalAlign: 'middle',
      },
    };

    return styles;
  },

  render() {
    let {
      disabled,
      portTypes,
      getPortTypes,
      style,
      value,
      ...others
    } = this.props;

    let styles = this.getStyles();
    let menuItems = [];
    portTypes && portTypes.forEach((portType, index) => {
      menuItems.push(
        <MenuItem
          key={index}
          primaryText={portType.get('name')}
          value={portType.get('name')}
        />,
      );
    });

    return (
      <SelectField
        {...others}
        ref="portTypes"
        disabled={disabled}
        floatingLabelText={this.t('nTextPortTypes')}
        onChange={this._handleChange}
        style={Object.assign(styles.root, style)}
        value={this.state.value}
        autoWidth={true}
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
      getPortTypes: global.api.epds.getPortTypes,
      portTypes: state.get('portTypes'),
    };
  },
  null,
  null,
  {withRef: true}
)(DropDownPortTypesInner);
