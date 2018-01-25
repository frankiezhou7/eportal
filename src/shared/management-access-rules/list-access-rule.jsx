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

const FormAccessRule = require('./form-access-rule');
const ListAction = require('./list-action');

const { List, ListItem, MakeSelectable } = require('epui-md/List');
const PropTypes = React.PropTypes;

const SelectableList = MakeSelectable(List);
const apiAuth = global.api && global.api.auth;

const ListAccessRule = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    editable: PropTypes.bool,
    disabled: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      editable: true,
      disabled: false,
    };
  },

  getInitialState() {
    return {
      error: !apiAuth ? 'Fatal: no auth API found' : null,
      resources: null,
      actions: null,
      rules: null,
      selectedResource: null,
      selectedRule: null,
      editorError: null,
      loading: false,
      editing: false,
    };
  },

  componentWillMount() {
    if(!apiAuth) { return; }
    this.refresh();
  },

  componentWillReceiveProps(nextProps) {
  },

  refresh() {
    this.setState({ loading: true });

    Promise.all([
      apiAuth.getKnownResourceActions.promise(),
      apiAuth.getAccessRules.promise(),
    ]).then(arr => {
      this.setData(arr[0].response, arr[1].response);
      this.setState({ loading: false });
    }).catch(e => {
      debug('获取AccessRules出错: ' + e.message);
      this.setState({
        error: 'Fatal: failed fetching data',
        loading: false,
      });
    });
  },

  setData(resources, rules) {
    let state = {};

    resources = _.mapValues(resources, acts => _.sortBy(acts));

    state.actions = resources;
    state.resources = _.sortBy(_.keys(resources));
    state.rules = {};

    debug('数据更新', state);

    _.reduce(rules, (state, r) => {
      state[r.resource] = state[r.resource] || [];
      state[r.resource].push(r);
      return state;
    }, state.rules);

    this.setState(state);
  },

  getStyles() {
    let styles = {
      root: _.merge({
        height: '100%',
        width: '100%',
        userSelect: 'none',
        position: 'relative',
        border: '1px solid #EAEAEA',
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
      headerButton: {
        position: 'absolute',
        right: 0,
        top: 0,
      },
      error: {
        header: {
          paddingLeft: 50,
          paddingTop: 16,
          paddingBottom: 16,
          position: 'relative',
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
      list: {
        width: '100%',
        height: 'calc(100% - 48px)',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'absolute',
        top: 48
      },
      resources: {
        display: 'inline-block',
        height: '100%',
        width: 250,
        boxSizing: 'border-box',
        borderRight: 'solid 1px #EAEAEA',
        position: 'relative',
      },
      rules: {
        display: 'inline-block',
        height: '100%',
        width: 250,
        overflowY: 'auto',
        boxSizing: 'border-box',
        borderRight: 'solid 1px #EAEAEA',
        position: 'relative',
      },
      editor: {
        padding: 16,
        position: 'absolute',
        top: 48
      }
    };

    return styles;
  },

  renderError(err) {
    return (
      <List style={this.s('root')}>
        <div style={this.s('error.header')}>
          <IconError style={this.s('error.icon')} />
          <span style={this.s('error.text')}>{err}</span>
        </div>
      </List>
    );
  },

  renderResourceList() {
    const items = _.map(this.state.resources, res => (
      <ListItem
        key={res}
        primaryText={res}
        value={res}
      />
    ));

    return (
      <div style={this.s('resources')}>
        <div style={this.s('header')}>Resources</div>
        <SelectableList
          style={this.s('list')}
          value={this.state.selectedResource}
          onChange={this._handleResourceChange}
        >
          {items}
        </SelectableList>
      </div>
    );
  },

  renderRuleEditor() {
    const res = this.state.selectedResource;
    const id = this.state.selectedRule;
    const rule = _.find(this.state.rules[res], { _id: id });

    return (
      <FormAccessRule
        style={this.s('editor')}
        resource={res}
        rule={rule}
        onChange={this._handleEditorChange}
        onDelete={this._handleEditorDelete}
        onSave={this._handleEditorSave}
        errorText={this.state.editorError}
        loading={this.state.loading}
      />
    );
  },

  renderRuleList() {
    const res = this.state.selectedResource;
    const editable = this.props.editable;
    const editing = this.state.editing;

    let content, topButton;
    if(editing) {
      content = this.renderRuleEditor();
      topButton = (
        <IconButton  style={this.s('headerButton')} onTouchTap={this._cancelEdit}>
          <IconClose />
        </IconButton>
      );
    } else {
      let rules = res ? this.state.rules[res] : [];
      rules = _.orderBy(rules, 'name');
      const items = res ? _.map(rules, rul => {
        const btn = editable ? (
          <IconButton onTouchTap={evt => { this._handleEditRule(evt, rul); }}>
            <IconEdit />
          </IconButton>
        ) : null;

        return (
          <ListItem
            key={rul._id}
            primaryText={rul.name}
            value={rul._id}
            rightIconButton={btn}
          />
        );
      }) : null;

      topButton = res && editable ? (
        <IconButton  style={this.s('headerButton')} onTouchTap={this._handleAddRule}>
          <IconAdd />
        </IconButton>
      ) : null;

      content = (
        <SelectableList
          style={this.s('list')}
          value={this.state.selectedRule}
          onChange={this._handleRuleChange}
        >
          {items}
        </SelectableList>
      );
    }

    return (
      <div style={this.s('rules')}>
        <div style={this.s('header')}>
          <span>Rules</span>
          {topButton}
        </div>
        {content}
      </div>
    )
  },

  renderActions() {
    const { editing, selectedRule, selectedResource, loading, actions } = this.state;

    const acts = actions && selectedResource ? actions[selectedResource] : [];
    const rul = this._findRule(selectedRule);

    return (
      <ListAction
        ref='actions'
        actions={acts}
        mode={editing ? 'edit' : 'view'}
        rule={rul}
        loading={loading}
      />
    );
  },

  render() {
    if(this.state.error) {
      return this.renderError(this.state.error);
    }

    return (
      <div style={this.s('root')}>
        {this.renderResourceList()}
        {this.renderRuleList()}
        {this.renderActions()}
      </div>
    );
  },

  _findRule(id) {
    if(!id) { return; }

    const { rules, selectedResource } = this.state;
    return _.find(rules && selectedResource ? rules[selectedResource] : [], { _id: id });
  },

  _updateRules(rule, remove) {
    const res = this.state.selectedResource;
    const rules = this.state.rules;
    const arr = rules[res] || [];

    _.remove(arr, { _id: rule._id });
    if(!remove) {
      arr.push(rule);
    }

    rules[res] = arr;

    this.setState({ rules });
  },

  _updateActions(allowed) {
    const { actions, selectedResource } = this.state;
    const names = _.map(allowed, 'action');
    const diff = _.difference(names, actions[selectedResource]);

    if(diff.length <= 0) { return; }

    actions[selectedResource] = actions[selectedResource].concat(diff);
    this.setState({ actions });
  },

  _cancelEdit() {
    this.setState({
      editing: false,
      editorError: null,
    });
  },

  _validateRule(rule) {
    const res = this.state.selectedResource;
    if(!rule || !res) { return false; }

    const rules = this.state.rules[res];
    let msg;

    if(!rule || _.isEmpty(rule.name)) {
      msg = 'name is required';
    } else if(_.reduce(rules, (exists, r) => exists || (r._id !== rule._id && r.name === rule.name), false)) {
      msg = 'name is occupied';
    }

    this.setState({
      editorError: msg
    });

    return !msg;
  },

  _handleResourceChange(evt, res) {
    const { editing, loading } = this.state;
    if(editing || loading) { return; }

    this.setState({ selectedResource: res, selectedRule: null });
    debug('resource改变为', res);
  },

  _handleRuleChange(evt, ruleId) {
    this.setState({ selectedRule: ruleId });
    debug('rule改变为', ruleId);
  },

  _handleAddRule(evt) {
    this.setState({ editing: true, selectedRule: null });
  },

  _handleEditRule(evt, rule) {
    this.setState({
      editing: true,
      selectedRule: rule._id,
    });
  },

  _handleEditorChange(evt, rule) {
    const valid = this._validateRule(rule);
    if(valid) { return; }
  },

  _handleEditorDelete(evt, rule) {
    if(!rule || !rule._id) { return; }

    this.setState({ loading: true });
    apiAuth.removeAccessRuleById.promise(rule._id, rule.__v).then(res => {
      this.setState({ loading: false });
      this._updateRules(res.response, true);
      this._cancelEdit();
      debug('成功删除rule', rule);
    }).catch(e => {
      debug('删除出错', e);
      this.setState({
        loading: false,
        editorError: 'failed to remove access rule.'
      });
    });
  },

  _handleEditorSave(evt, rule) {
    if(!this._validateRule(rule)) { return; }

    rule.allowed = this.refs.actions.getValue().allowed;

    this._updateActions(rule.allowed);

    this.setState({ loading: true });

    if(rule._id) {
      rule.__v = rule.__v || 0;

      apiAuth.updateAccessRuleById.promise(rule._id, rule).then(res => {
        this.setState({ loading: false });
        this._updateRules(res.response);
        this._cancelEdit();
      }).catch(e => {
        debug('更新出错', e);
        this.setState({
          loading: false,
          editorError: 'failed to update access rule.'
        });
      });
    } else {
      apiAuth.createAccessRule.promise(rule).then(res => {
        this.setState({ loading: false });
        this._updateRules(res.response);
        this._cancelEdit();
      }).catch(e => {
        debug('添加出错', e);
        this.setState({
          loading: false,
          editorError: 'failed to add access rule.'
        });
      });
    }
  },
});

module.exports = ListAccessRule;
