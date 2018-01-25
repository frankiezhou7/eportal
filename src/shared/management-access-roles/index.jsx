const _ = require('eplodash');
const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;

const ListAccessRole = require('./list-access-role');
const ListAccessRule = require('./list-access-rule');

const PropTypes = React.PropTypes;
const apiAuth = global.api && global.api.auth;

const AccessRoles = React.createClass({
  mixins: [AutoStyle],

  propTypes: {
    style: PropTypes.object
  },

  getInitialState() {
    return {
      role: null,
      roles: null,
      rules: null,
      editing: false,
      loading: false,
      errorText: !apiAuth ? 'Fatal: no local api found' : null,
    }
  },

  componentWillMount() {
    this.refresh();
  },

  getStyles() {
    return {
      root: _.merge({
        width: '100%',
        height: '100%',
        border: '1px solid #EAEAEA',
        position: 'relative',
        overflow: 'hidden'
      }, this.props.style)
    };
  },

  cancelEdit() {
    this.setState({
      editing: false,
      role: null,
      rules: null,
    });
  },

  refresh() {
    this.setState({ loading: true });

    apiAuth.getAccessRoles.promise().then(res => {
      this.setState({
        roles: res.response,
        loading: false
      });
    }).catch(e => {
      this.setState({
        errorText: 'Fatal: failed fetching access roles',
        loading: false,
      });
    });
  },


  render() {
    const { role, roles, rules, editing, loading, errorText } = this.state;

    const roleId = role && role._id;
    const ordered = _.orderBy(roles, 'name');
    const elListRules = errorText ? null : (
      <ListAccessRule
        ref='rules'
        value={rules}
        editing={editing}
        loading={loading}
        onChange={this._handleRuleChange}
      />
    );

    return (
      <div className='root' style={this.s('root')}>
          <ListAccessRole
            roles={ordered}
            value={roleId}
            editing={editing}
            loading={loading}
            errorText={errorText}
            onAdd={this._handleRoleAdd}
            onChange={this._handleRoleChange}
            onEdit={this._handleRoleEdit}
            onSave={this._handleRoleSave}
            onCancel={this._handleRoleCancel}
          />
          {elListRules}
      </div>
    );
  },

  _updateRole(role, remove) {
    const roles = this.state.roles;

    _.remove(roles, { _id: role._id });

    if(!remove) {
      roles.push(role);
    }

    this.setState({ roles });
  },

  _handleRoleAdd(ref) {
    this.setState({
      role: null,
      rules: null,
      editing: true,
    });
  },

  _handleRoleSave(ref, role) {
    role.rules = this.state.rules || [];

    this.setState({
      loading: true
    });

    const p = role._id
      ? apiAuth.updateAccessRoleById.promise(role._id, role)
      : apiAuth.createAccessRole.promise(role);

    p.then(res => {
      this._updateRole(res.response);
      this.cancelEdit();
      this.setState({
        loading: false
      });
    }).catch(e => {
      this.setState({
        errorText: 'Fatal: failed creating or updating role',
        loading: false,
      })
    });
  },

  _handleRoleCancel(ref) {
    this.cancelEdit();
  },

  _handleRoleChange(ref, role) {
    this.setState({
      role: role,
      rules: _.filter(_.map(role.rules, '_id'))
    });
  },

  _handleRuleChange(ref, rules) {
    this.setState({ rules });
  },

  _handleRoleEdit(ref, role) {
    this.setState({
      role: role,
      rules: _.filter(_.map(role.rules, '_id')),
      editing: true
    });
  }
});

module.exports = AccessRoles;
