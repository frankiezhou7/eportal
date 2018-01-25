const _ = require('eplodash');
const React = require('react');
const Toggle = require('epui-md/Toggle');
const AutoStyle = require('epui-auto-style').mixin;
const SearchBar = require('epui-md/ep/SearchBar');
const IconError = require('epui-md/svg-icons/alert/error');
const IconPerson = require('epui-md/svg-icons/social/person');
const IconGroup = require('epui-md/svg-icons/social/group');
const IconAdd = require('epui-md/svg-icons/content/add');
const IconEdit = require('epui-md/svg-icons/editor/mode-edit');
const IconClose = require('epui-md/svg-icons/navigation/close');
const IconButton = require('epui-md/IconButton');

const SimpleSection = require('../simple-section');

const { List, ListItem, MakeSelectable } = require('epui-md/List');
const PropTypes = React.PropTypes;

const SelectableList = MakeSelectable(List);
const apiAuth = global.api && global.api.auth;
const apiUser = global.api && global.api.user;

const ListAccessUser = React.createClass({
  mixins: [AutoStyle],

  propTypes: {
    style: PropTypes.object,
    disabled: PropTypes.bool,
    adding: PropTypes.bool,
    canAdd: PropTypes.bool,
    onChange: PropTypes.func,
    onAdd: PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
      adding: false,
      canAdd: true,
    }
  },

  getInitialState() {
    return {
      results: null,
      selected: null,
      error: !apiUser ? 'Fatal: API user not found' : null,
    };
  },

  refresh(query) {
    query = query || this.state.query;

    apiUser.searchUsersAndGroups.promise(query).then(res => {
      debug(`搜索用户或用户组成功`, res.response.length);
      this.setState({
        results: res.response
      });
    }).catch(e => {
      debug('搜索用户或用户组出错', e);
      this.setState({
        error: 'Fatal: failed searching users/groups'
      });
    })
  },

  getStyles() {
    return {
      search: {
        width: '100%',
        height: 52,
        padding: '6px 16px',
        borderBottom: '1px solid #EAEAEA',
        boxSizing: 'border-box',
      },
      list: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      },
      info: {
        width: '100%',
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center',
        padding: '16px 0'
      }
    }
  },

  renderSearch() {
    const { disabled } = this.props;

    return (
      <div style={this.s('search')}>
        <SearchBar
          disabled={disabled}
          style={{ width: '100%', maxWidth: 2000 }}
          inputPlaceHolder='Type in to search users and groups'
          onSearch={this._handleSearch}
        />
      </div>
    );
  },

  renderAdd() {
    const { disabled, canAdd } = this.props;

    if(disabled || !canAdd) { return; }

    return (
      <ListItem
        key='add'
        value='add'
        primaryText='Add New User or Group'
        secondaryText='create new user or group in system'
        leftIcon={<IconAdd />}
      />
    );
  },

  renderList() {
    const { disabled, adding } = this.props;
    const { results, selected } = this.state;

    let content;

    if(!results) {
      content = [];
    } else if(results.length <= 0) {
      content = [(
        <div key='info' style={this.s('info')}>Nothing Found</div>
      )];
    } else {
      const iconPerson = (<IconPerson />);
      const iconGroup = (<IconGroup />);

      const icon = it => it.type === 'user' ? iconPerson : iconGroup;
      const primary = it => it.type === 'user' ? it.fullname : it.name;
      const secondary = it => it.type === 'user' ? it.username : '-';

      content = _.map(results, it => (
        <ListItem
          key={it._id}
          primaryText={primary(it)}
          secondaryText={secondary(it)}
          leftIcon={icon(it)}
          value={adding ? 'add' : it._id}
        />
      ));
    }

    content.push(this.renderAdd());

    return (
      <SelectableList
        disabled={disabled}
        value={selected}
        onChange={this._handleSelectChange}
      >
        {content}
      </SelectableList>
    );
  },

  render() {
    return (
      <SimpleSection
        title='User/Group'
        style={this.props.style}
        errorText={this.state.error}
        secondaryHeader={this.renderSearch()}
      >
        {this.renderList()}
      </SimpleSection>
    );
  },

  _handleSearch(query) {
    this.refresh(query);
    this.setState({ query });
  },

  _handleSelectChange(ref, selected) {
    if(selected === 'add') {
      if(this.props.onAdd) {
        this.props.onAdd(this);
      }
      return;
    }
    
    debug(`选中用户或用户组`, selected);
    this.setState({ selected });
    if(this.props.onChange) {
      this.props.onChange(this, selected);
    }
  }
});

module.exports = ListAccessUser;
