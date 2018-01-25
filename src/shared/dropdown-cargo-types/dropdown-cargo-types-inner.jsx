const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const DropDownCargoTypesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownCargoTypes/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    cargoTypes: PropTypes.object,
    disabled: PropTypes.bool,
    listPayloadTypes: PropTypes.func,
    label: PropTypes.string,
    nLabelCargoTypes: PropTypes.string,
    nTextChooseCargoTypes: PropTypes.string,
    nTextInputToFindCargoTypes: PropTypes.string,
    nTextNoCargoTypesFound: PropTypes.string,
    nTextSuggestedCargoTypes: PropTypes.string,
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
      listPayloadTypes,
      cargoTypes,
    } = this.props;

    if (!cargoTypes || cargoTypes.size === 0) {
      if (_.isFunction(listPayloadTypes)) {
        listPayloadTypes();
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
      cargoTypes,
      value,
    } = this.props;

    let payloadType = this.state.value;
    let val = _.isObject(payloadType) ? payloadType._id : payloadType

    let menuItems = [];
    cargoTypes && cargoTypes.forEach((entry, index) => {
      menuItems.push(
        <MenuItem
          key={index}
          primaryText={entry.get('name')}
          value={entry.get('_id')}
        />,
      );
    });

    return (
      <SelectField
        {...this.props}
        ref="cargoTypes"
        disabled={disabled}
        onChange={this._handleChange}
        value={val}
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

let {
  listPayloadTypes,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      listPayloadTypes,
      cargoTypes: state.getIn(['payloadType', 'list']),
    };
  },
  null,
  null,
  {withRef: true}
)(DropDownCargoTypesInner);
