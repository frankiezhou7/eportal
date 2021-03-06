const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const DropDownPiClubsInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownPiClubs/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    getPiClubs: PropTypes.func,
    label: PropTypes.string,
    nTextShipType: PropTypes.string,
    piClubs: PropTypes.object,
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
      getPiClubs,
      piClubs,
    } = this.props;

    if (!piClubs || piClubs.size === 0) {
      if (_.isFunction(getPiClubs)) {
        getPiClubs();
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
      piClubs,
      getPiClubs,
      style,
      value,
      ...others
    } = this.props;

    let styles = this.getStyles();

    let menuItems = [];
    piClubs && piClubs.forEach((piClub, index) => {
      menuItems.push(
        <MenuItem
          key={index}
          primaryText={piClub.get('name')}
          value={piClub.get('code')}
        />,
      );
    });

    return (
      <SelectField
        {...others}
        ref="piClubs"
        disabled={disabled}
        floatingLabelText={this.t('nTextPiClub')}
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
      getPiClubs: global.api.epds.getPiClubs,
      piClubs: state.get('piClubs'),
    };
  },
  null,
  null,
  {withRef: true}
)(DropDownPiClubsInner);
