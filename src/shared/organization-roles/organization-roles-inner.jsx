const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Chips = require('epui-md/ep/Chips/Chips');
const Dialog = require('epui-md/Dialog');
const DropDrownOranizationRoles = require('~/src/shared/dropdown-organization-roles');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

const OrganizationRolesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    getOrgRoleTypes: PropTypes.func,
    orgRoles: PropTypes.object,
    style: PropTypes.object,
    value : PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      open: false,
      value: [],
      isChanged: false,
    };
  },

  componentWillMount() {
    let {
      getOrgRoleTypes,
      orgRoles,
      value,
    } = this.props;

    if (!orgRoles || orgRoles.size === 0) {
      if (_.isFunction(getOrgRoleTypes)) {
        getOrgRoleTypes();
      }
    }
    if(value) this.setState({value});
  },

  getValue() {
    return _.uniq(this.state.value);
  },

  isChanged(){
    return this.state.isChanged;
  },

  handleCancel() {
    this.setState({
      open: false,
    });
  },

  handleChange() {},

  handleSubmit() {
    let { orgRoles } = this.props;
    let { value } = this.state;
    let val = this.role.getValue();
    orgRoles = orgRoles && orgRoles.toJS();
    if (!orgRoles || orgRoles.length === 0) return;

    let filtered = _.head(_.filter(orgRoles, ['code', val]));
    value.push(filtered.code)

    this.setState({
      open: false,
      value,
      isChanged: true,
    });
  },

  handleTouchTap() {
    this.setState({
      open: true,
    });
  },

  handleRequestDelete(code) {
    let newVal = _.filter(this.state.value, val => val !== code);

    this.setState({
      value:newVal,
      isChanged: true,
    });
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  renderItems(value, orgRoles, styles) {
    let chips = [];
    orgRoles = orgRoles && orgRoles.toJS();
    if (!orgRoles || orgRoles.length === 0) return;

    _.forEach(value, val => {
      let filtered = _.head(_.filter(orgRoles, ['code', val]));
      if(filtered){
        chips.push({
          id: filtered.code,
          label: filtered.name,
        });
      }
    });

    return (
      <Chips
        ref="chips"
        addButtonLabel="Add Organization Role"
        chips={chips}
        onAdd={this.handleTouchTap}
        onRequestDelete={this.handleRequestDelete}
        primary
        showAddButton
      />
    );
  },

  render() {
    let {
      orgRoles,
      style,
      ...other,
    } = this.props;

    let {
      open,
      selected,
      value,
    } = this.state;

    let styles = this.getStyles();

    const actions = [
      <FlatButton
        label={this.t("nTextCancel")}
        primary
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label={this.t("nButtonOk")}
        primary
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div style={Object.assign(styles.root, style)}>
        {this.renderItems(value, orgRoles, styles)}
        <Dialog
          ref={(ref) => this.dialog = ref}
          actions={actions}
          open={open}
          title="Add Organization Role"
        >
          <DropDrownOranizationRoles
            ref={(ref) => this.role = ref}
            onChange={this.handleChange}
            {...other}
          />
        </Dialog>
      </div>
    );
  },
});

module.exports = OrganizationRolesInner;
