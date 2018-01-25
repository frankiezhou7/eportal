const _ = require('eplodash');
const React = require('react');
const Toggle = require('epui-md/Toggle');
const AutoStyle = require('epui-auto-style').mixin;
const IconError = require('epui-md/svg-icons/alert/error');
const IconCheck = require('epui-md/svg-icons/action/check-circle');
const IconAdd = require('epui-md/svg-icons/content/add');
const IconEdit = require('epui-md/svg-icons/editor/mode-edit');
const IconClose = require('epui-md/svg-icons/navigation/close');
const IconButton = require('epui-md/IconButton');
const FormAccessRole = require('./form-access-role');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const { List, ListItem, MakeSelectable } = require('epui-md/List');
const PropTypes = React.PropTypes;

const SelectableList = MakeSelectable(List);
const apiAuth = global.api && global.api.auth;


const ListAccessRole = React.createClass({
  mixins: [AutoStyle, PureRenderMixin],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    editing: PropTypes.bool,
    loading: PropTypes.bool,
    onAdd: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onEdit: PropTypes.func,
    onSave: PropTypes.func,
    roles: PropTypes.array,
    style: PropTypes.object,
    value: PropTypes.string,
    errorText: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
      editable: true,
      editing: false,
    };
  },

  componentWillMount() {
  },

  getStyles() {
    return {
      root: _.merge({
        display: 'inline-block',
        height: '100%',
        width: 350,
        boxSizing: 'border-box',
        borderRight: 'solid 1px #EAEAEA',
        position: 'relative',
      }, this.props.style),
      header: {
        width: '100%',
        height: 48,
        padding: 16,
        fontWeight: 'bold',
        cursor: 'default',
        borderBottom: '1px solid #EAEAEA',
        position: 'absolute',
        top: 0,
        background: '#FFFFFF',
        boxSizing: 'border-box',
      },
      list: {
        width: '100%',
        height: 'calc(100% - 48px)',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'absolute',
        top: 48
      },
      code: {
        fontSize: 12,
        color: 'grey',
        verticalAligh: 'top',
        marginLeft: 6
      },
      form: {
        width: '100%',
        boxSizing: 'border-box',
        height: 'calc(100% - 48px)',
        position: 'absolute',
        top: 48,
        padding: 12,
      },
      headerButton: {
        position: 'absolute',
        right: 0,
        top: 0,
      },
      error: {
        root: {
          height: '100%',
          width: '100%',
        },
        header: {
          position: 'absolute',
          top: 0,
          width: '100%',
          height: 48,
          boxSizing: 'border-box',
          paddingLeft: 50,
          paddingTop: 16,
          paddingBottom: 16,
          cursor: 'default',
          borderBottom: '1px solid #EAEAEA',
        },
        icon: {
          fill: '#FF0000',
          height: 24,
          width: 24,
          transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
          position: 'absolute',
          top: 0,
          margin: 12,
          left: 4,
        },
        text: {
          fontWeight: 'bold',
        }
      },
    };
  },

  renderError(err) {
    return (
      <div style={this.s('error.root')}>
        <div style={this.s('error.header')}>
          <IconError style={this.s('error.icon')} />
          <span style={this.s('error.text')}>
            {err}
          </span>
        </div>
      </div>
    );
  },

  renderList() {
    const { roles, value, editing } = this.props;

    const items = _.map(roles, r => {
      const elPrimary = (
        <span>
          <span>{r.name}</span>
          <span style={this.s('code')}>{r.code}</span>
        </span>
      );

      const elBtnEdit = (
        <IconButton onTouchTap={evt => { this._handleEditRole(evt, r._id); }}>
          <IconEdit />
        </IconButton>
      );

      return (
        <ListItem
          key={r._id}
          primaryText={elPrimary}
          secondaryText={r.comment || '-'}
          value={r._id}
          rightIconButton={elBtnEdit}
        />
      );
    });

    return (
      <SelectableList
        value={value}
        style={this.s('list')}
        onChange={this._handleSelectChange}
      >
        {items}
      </SelectableList>
    );
  },

  renderForm() {
    const { roles, value, loading } = this.props;

    const role = _.find(roles, { _id: value });

    return (
      <FormAccessRole
        style={this.s('form')}
        loading={loading}
        value={role}
        onSave={this._handleFormSave}
        validateName={this._validateRoleName}
        validateCode={this._validateRoleCode}
      />
    );
  },

  render() {
    const { loading, editing, value, editable, errorText } = this.props;

    if(errorText) {
      return this.renderError(errorText);
    }

    const content = editing ? this.renderForm() : this.renderList();
    const btnHeader = editing ? (
      <IconButton
        style={this.s('headerButton')}
        onTouchTap={this._handleTouchTapCancel}
        disabled={loading}
      >
        <IconClose />
      </IconButton>
    ) : editable ? (
      <IconButton
        style={this.s('headerButton')}
        onTouchTap={this._handleTouchTapAdd}
        disabled={loading}
      >
        <IconAdd />
      </IconButton>
    ) : null;

    return (
      <div style={this.s('root')}>
        <div style={this.s('header')}>
          <span>Roles</span>
          {btnHeader}
        </div>
        {content}
      </div>
    );
  },

  _validateRoleName(name, roleId) {
    const { roles } = this.props;
    return !_.find(roles, r => r.name === name && r._id !== roleId);
  },

  _validateRoleCode(code, roleId) {
    const { roles } = this.props;
    return !_.find(roles, r => r.code === code && r._id !== roleId);
  },

  _handleFormSave(ref, role) {
    if(this.props.onSave) {
      this.props.onSave(this, role);
    }
  },

  _handleTouchTapAdd(ref) {
    if(this.props.onAdd) {
      this.props.onAdd(this);
    }
  },

  _handleTouchTapCancel(ref) {
    if(this.props.onCancel) {
      this.props.onCancel(this);
    }
  },

  _handleSelectChange(evt, roleId) {
    if(this.props.onChange) {
      this.props.onChange(this, _.find(this.props.roles, { _id: roleId }));
    }
  },

  _handleEditRole(evt, roleId) {
    if(this.props.onEdit) {
      this.props.onEdit(this, _.find(this.props.roles, { _id: roleId }));
    }
  }
});

module.exports = ListAccessRole;
