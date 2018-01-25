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
const Chip = require('epui-md/Chip');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const { List, ListItem, MakeSelectable } = require('epui-md/List');
const PropTypes = React.PropTypes;

const SelectableList = MakeSelectable(List);
const apiAuth = global.api && global.api.auth;

const ListAccessRule = React.createClass({
  mixins: [AutoStyle, PureRenderMixin],

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.array,
    editing: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func,
  },

  getDefaultProps() {
    return {
      editing: false,
    };
  },

  getInitialState() {
    return {
      rules: {},
      filtered: false,
    };
  },

  componentWillMount() {
    if(!apiAuth) { return; }
    this.refresh();
  },

  componentWillReceiveProps(nextProps) {

  },

  componentDidUpdate() {
    // const list = findDOMNode(this._list);
    // if(!list) { return; }
    // list.scrollTop = 0;
  },

  getValue() {
    return this.state.rules
  },

  refresh() {
    this.setState({ loading: true });

    apiAuth.getAccessRules.promise().then(res => {
      const rules = this._normalize(res.response);
      this.setState({
        rules,
        loading: false
      });
    }).catch(e => {
      this.setState({
        loading: false,
      }, () => {
        if(this.props.onError) {
          this.props.onError('Fatal: failed fetching data');
        }
      });
    });
  },

  getStyles() {
    return {
      root: _.merge({
        display: 'inline-block',
        height: '100%',
        width: 'calc(100% - 350px)',
        boxSizing: 'border-box',
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
      headerButton: {
        width: 120,
        display: 'inline-block',
        position: 'absolute',
        right: 16,
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
      count: {
        root: {
          display: 'inline-block',
          marginLeft: 8
        },
        label: {
          lineHeight: '16px',
          paddingLeft: 10,
          paddingRight: 10,
          fontWeight: 'bold',
        }
      },

    };
  },

  renderList() {
    const { rules, filtered } = this.state;
    const { value, editing } = this.props;

    if(!rules) { return; }

    const items = [];

    const ordered = _(rules).keys().orderBy().value();

    _.forEach(ordered, res => {
      const arr = rules[res];

      let count = 0;

      let elRules = _.map(arr, rul => {
        if(rul.forIndividual) { return; }

        const yes = _.includes(value, rul._id);
        const icon = (yes && !editing) ? (<IconCheck color='#00FF00' />) : null;
        const toggle = editing ? (
          <Toggle
            toggled={yes}
            onToggle={(evt, toggled) => this._handleToggleRule(evt, rul._id, toggled)}
          />
        ) : null;

        if(yes) { count++; }

        return (
          <ListItem
            key={rul._id}
            primaryText={rul.name}
            secondaryText={rul.comment || '-'}
            rightIcon={icon}
            rightToggle={toggle}
          />
        );
      });

      elRules = _.compact(elRules);

      if(elRules.length <= 0 || count <= 0 && filtered) { return; }

      const elPrimary = (
        <span>
          {res}
          {this.renderCount(count, true)}
        </span>
      );

      items.push(
        <ListItem
          key={res}
          primaryTogglesNestedList={true}
          nestedItems={elRules}
          primaryText={elPrimary}
        />
      );
    });

    return (
      <List
        ref={ref => { this._list = ref; }}
        style={this.s('list')}
      >
        {items}
      </List>
    );
  },

  renderCount(count, autoHide) {
    count = _.isArray(count) ? count.length : count;
    count = _.isNumber(count) ? count : 0;

    if(count === 0 && autoHide) { return; }

    return (
      <Chip
        style={this.s('count.root')}
        labelStyle={this.s('count.label')}
      >
        {count}
      </Chip>
    )
  },

  renderHeaderButton() {
    const { editing, value } = this.props;
    const { filtered } = this.state;

    return (
      <Toggle
        style={this.s('headerButton')}
        label='Only Applied'
        toggled={filtered}
        onToggle={this._handleFilterToggle}
      />
    );
  },

  render() {
    const { value } = this.props;

    return (
      <div style={this.s('root')}>
        <div style={this.s('header')}>
          Rules
          {this.renderCount(value)}
          {this.renderHeaderButton()}
        </div>
        {this.renderList()}
      </div>
    );
  },

  _makeOrder(rules, value) {
    rules = rules || this.state.rules;
    value = value || this.props.value;

    if(!rules || !value) { return; }

    this.setState({
      ordered: _.chain(rules)
        .reduce((src, arr, res) => {
          src.push({
            resource: res,
            count: _.reduce(arr, (c, rule) => (_.includes(value, rule._id) ? ++c : c), 0)
          });
          return src;
        }, [])
        .orderBy(['count', 'resource'], ['desc', 'asc'])
        .value()
    });
  },

  _normalize(rules) {
    if(!rules || rules.length <= 0) { return {}; }

    return _.reduce(rules, (res, r) => {
      res[r.resource] = res[r.resource] || [];
      res[r.resource].push(r);
      return res;
    }, {});
  },

  _handleFilterToggle(evt, filtered) {
    this.setState({ filtered });
  },

  _handleToggleRule(evt, ruleId, yes) {
    let { value, onChange } = this.props;

    if(!onChange || !ruleId) { return; }

    value = value || [];

    if(yes) {
      if(_.includes(value, ruleId)) { return; }
      onChange(this, value.concat([ruleId]));
    } else {
      if(!_.includes(value, ruleId)) { return; }
      onChange(this, _.filter(value, r => r !== ruleId))
    }
  }
});

module.exports = ListAccessRule;
