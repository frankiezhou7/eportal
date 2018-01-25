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

const FormAction = require('./form-action');

const { List, ListItem, MakeSelectable } = require('epui-md/List');
const PropTypes = React.PropTypes;

const SelectableList = MakeSelectable(List);

const ListAction = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    actions: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    mode: PropTypes.oneOf(['edit', 'view']),
    rule: PropTypes.object,
    style: PropTypes.object,
    onSave: PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
      loading: false,
      mode: 'view',
    };
  },

  getInitialState() {
    const { rule, actions } = this.props;

    return {
      actions: [].concat(actions),
      allowed: rule ? [].concat(rule.allowed) : [],
      errorText: null,
      selected: null,
    };
  },

  componentWillReceiveProps(nextProps) {
    const { rule, actions } = nextProps;

    this.setState({
      actions: [].concat(actions),
      allowed: rule ? [].concat(rule.allowed) : [],
    });
  },

  getValue() {
    return {
      allowed: this.state.allowed
    };
  },

  getStyles() {
    return {
      root: {
        display: 'inline-block',
        height: '100%',
        width: 'calc(100% - 500px)',
        overflowY: 'auto',
        boxSizing: 'border-box',
        position: 'relative',
      },
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
      topButton: {
        position: 'absolute',
        right: 0,
        top: 0,
      },
      form: {
        padding: 16,
        position: 'absolute',
        top: 48,
        width: '100%',
        boxSizing: 'border-box',
      }
    }
  },

  renderTopButton() {
    const { editing } = this.state;
    const { mode } = this.props;

    return editing ? (
      <IconButton  style={this.s('topButton')} onTouchTap={this._handleCancel}>
        <IconClose />
      </IconButton>
    ) : (mode === 'edit') ? (
      <IconButton  style={this.s('topButton')} onTouchTap={this._handleAdd}>
        <IconAdd />
      </IconButton>
    ) : null;
  },

  renderForm() {
    const { loading, rule } = this.props;
    const { errorText, selected } = this.state;

    const action = this._findAction(selected);

    return (
      <FormAction
        ref='form'
        style={this.s('form')}
        loading={loading}
        action={action}
        errorText={errorText}
        onChange={this._handleChange}
        onSave={this._handleSave}
      />
    );
  },

  renderList() {
    const { rule, loading, disabled, mode } = this.props;
    const { editing, allowed, actions } = this.state;

    const items = _.map(actions, act => {
      const action = this._findAction(act, allowed);
      const isAllowed = !!action;

      const toggle = mode === 'edit' ? (
        <Toggle
          toggled={isAllowed}
          disabled={loading}
          onToggle={(evt, toggled) => this._handleToggleAction(evt, act, toggled)}
        />
      ) : null;
      const icon = (mode === 'view' && isAllowed) ? (<IconCheck color='#00FF00' />) : null;
      const btn = mode === 'edit' ? (
        <IconButton onTouchTap={evt => this._handleEditAction(evt, act)}>
          <IconEdit />
        </IconButton>
      ) : null;

      return (
        <ListItem
          key={act}
          primaryText={act}
          rightToggle={toggle}
          rightIcon={icon}
        />
      );
    });

    return (
      <List style={this.s('list')}>
        {items}
      </List>
    );
  },

  render() {
    const { rule, loading, disabled, actions } = this.props;
    const { allowed, editing } = this.state;

    const content = editing ? this.renderForm() : this.renderList();

    let topButton, elCounter;
    if(rule) {
      const total = actions.length;
      const count = allowed.length;
      topButton = this.renderTopButton();
      elCounter = `(${count}/${total})`;
    }

    return (
      <div style={this.s('root')}>
        <div style={this.s('header')}>
          <span>Actions Allowed {elCounter}</span>
          {topButton}
        </div>
        {content}
      </div>
    );
  },

  _findAction(name, allowed) {
    const rule = this.props.rule;
    return _.find(allowed || rule && rule.allowed, { action: name });
  },

  _handleCancel(evt) {
    this.setState({
      editing: false,
      selected: false,
      errorText: null,
    });
  },

  _handleAdd(evt) {
    this.setState({ editing: true, selected: null });
  },

  _handleChange(evt) {
    const act = this.refs['form'].getValue();
    const { selected } = this.state;
    if(act.action === selected) { return; }

    const found = _.includes(this.props.actions, act.action);
    const errorText = found ? 'action has already been added' : null;

    this.setState({ errorText });
  },

  _handleSave(evt) {
    const act = this.refs['form'].getValue();
    const { allowed, actions } = this.state;

    _.remove(allowed, act);
    allowed.push(act);

    if(!_.includes(actions, act.action)) {
      actions.push(act.action);
    }

    this.setState({
      actions,
      allowed,
      editing: false,
      selected: null,
    });
  },

  _handleToggleAction(evt, name, toggled) {
    let { allowed } = this.state;
    if(!toggled) {
      _.remove(allowed, { action: name });
    } else {
      allowed.push({ action: name });
    }

    this.setState({ allowed });
  },

  _handleEditAction(evt, name) {
    const { mode } = this.props;
    if(mode !== 'edit') { return; }

    this.setState({
      editing: true,
      selected: name,
      errorText: null,
    });
  }
});

module.exports = ListAction;
