const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const DropDownOrganizationRolesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownOrganizations/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    getOrgRoleTypes: PropTypes.func,
    label: PropTypes.string,
    nTextShipStatus: PropTypes.string,
    orgRoles: PropTypes.object,
    style: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    accType: PropTypes.string,
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
      getOrgRoleTypes,
      orgRoles,
    } = this.props;

    if (!orgRoles || orgRoles.size === 0) {
      if (_.isFunction(getOrgRoleTypes)) {
        getOrgRoleTypes();
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
      orgRoles,
      getOrgRoleTypes,
      style,
      value,
      accType,
      ...others
    } = this.props;

    let styles = this.getStyles();

    let menuItems = [];
    if(accType === 'AGENCY'){
      for(let roleType of (orgRoles && orgRoles)){
        let code = roleType.get('code');
        if(code === 'ORGA' || code === 'OROW' || code === 'ORCH') {
          menuItems.push(
            <MenuItem
              key={code}
              primaryText={roleType.get('name')}
              value={code}
            />,
          );
        }
      }
    }else if(accType === 'PRINCIPAL'){
      for(let roleType of (orgRoles && orgRoles)){
        let code = roleType.get('code');
        if(code === 'OROW' || code === 'ORCH') { continue; }
        menuItems.push(
          <MenuItem
            key={code}
            primaryText={roleType.get('name')}
            value={code}
          />,
        );
      }
    }else{
      orgRoles && orgRoles.forEach((orgRoleType, index) => {
        menuItems.push(
          <MenuItem
            key={index}
            primaryText={orgRoleType.get('name')}
            value={orgRoleType.get('code')}
          />,
        );
      });
    }

    return (
      <SelectField
        {...others}
        ref="orgRoles"
        disabled={disabled}
        floatingLabelFixed={!!this.state.value}
        floatingLabelText={this.t('nTextOrgRoleType')}
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

const { getOrgRoleTypes } = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      getOrgRoleTypes,
      orgRoles: state.get('orgRoles'),
    };
  },
  null,
  null,
  {withRef: true}
)(DropDownOrganizationRolesInner);
