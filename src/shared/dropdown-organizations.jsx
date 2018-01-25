const React = require('react');
const AutoComplete = require('epui-md/ep/AutoComplete');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const ORGANIZATION_TYPE = require('~/src/shared/constants').ORGANIZATION_TYPE;
const Translatable = require('epui-intl').mixin;
const { searchOrganizations } = global.api.epds;
const MIN_KEY_LENGTH = 2;
const MAX_KEY_LENGTH = 16;

const DropDownOrganizations = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownOrganizations/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    type: PropTypes.oneOf(ORGANIZATION_TYPE),
    disabled: PropTypes.bool,
    nLabelOrganization: PropTypes.string,
    nTextInputToFindOrganization: PropTypes.string,
    nTextChooseOrganization: PropTypes.string,
    nTextNoOrganizationFound: PropTypes.string,
    nTextSuggestedOrganizations: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.object,
    onChange:PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
      value: {}
    };
  },

  getInitialState() {
    return {
      entries: [],
      value: this.props.value,
    };
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
      menu: {
        maxHeight: '300px',
      },
    };

    return styles;
  },

  render() {
    let {
      disabled,
      style,
      value,
      ...other,
    } = this.props;

    let { entries } = this.state;
    let styles = this.getStyles();

    let dataSource = [];
    _.forEach(entries, (e, i) => {
      dataSource.push({
        text: e.name,
        value: e._id,
      });
    });

    return (
      <AutoComplete
        {...other}
        ref="dropdown"
        dataSource={dataSource}
        disabled={disabled}
        filter={this._filter}
        floatingLabelText={this.props.type ? this.t('nText'+this.props.type) : this.t('nLabelOrganization')}
        hintText={this.t('nTextInputToFindOrganization')}
        menuStyle={styles.menu}
        nullItemText={this.t('nTextChooseOrganization')}
        onNewRequest={this._handleDropdownChange}
        onUpdateInput={this._handleQueryChange}
        showNullItem={true}
        style={Object.assign(styles.root, style)}
        value = {value.text}
      />
    );
  },

  _handleDropdownChange(selectedItem) {
    if(this.props.onChange) this.props.onChange(selectedItem);
    this.setState({
      value: selectedItem
    });
  },

  _handleQueryChange(qry) {
    if(qry.length < MIN_KEY_LENGTH || qry.length > MAX_KEY_LENGTH) { return; }

    if (_.isFunction(searchOrganizations)) {
      searchOrganizations
        .promise({
          query: {
            name: qry
          },
          sortby: {
            'name': -1,
          },
          size: 30,
        })
        .then((res, rej) => {
          let entries = res.response.entries;
          if (_.isArray(entries)) {
            this.setState({
              entries: entries,
            });
          }
        }).catch((err) => {
          alert(this.t('nTextFindOrgError'));
        });
    }
  },

  _filter(searchText, key) {
    return true;
  },
});

module.exports = DropDownOrganizations;
