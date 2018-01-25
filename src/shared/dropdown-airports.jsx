const React = require('react');
const _ = require('eplodash');
const AutoComplete = require('epui-md/ep/AutoComplete');
const AutoStyle = require('epui-auto-style').mixin;
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const SelectField = require('epui-md/SelectField');
const Translatable = require('epui-intl').mixin;
const { searchAirports } = global.api.epds;
const MIN_KEY_LENGTH = 2;
const MAX_KEY_LENGTH = 16;

const DropDownAirports = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownAirports/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    dataField: PropTypes.string,
    disabled: PropTypes.bool,
    displayField: PropTypes.string,
    floatingLabelText: PropTypes.string,
    floatingLabelStyle:PropTypes.object,
    hintText: PropTypes.string,
    label: PropTypes.string,
    nTextChooseAirports: PropTypes.string,
    nTextInputToFindAirports: PropTypes.string,
    nTextNoAirportsFound: PropTypes.string,
    nTextSuggestedAirports: PropTypes.string,
    nullItemText: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    underlineShow: PropTypes.bool,
    width: PropTypes.number,
    margin: PropTypes.number,
  },

  getDefaultProps() {
    return {
      dataField: '_id',
      disabled: false,
      displayField: 'name',
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

    if (this.shallowEqual(nextProps)) {
      this.setState({
        value: value,
      });
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = this.shallowEqual(nextProps);

    return shouldUpdate || nextState !== this.state;
  },

  shallowEqual(nextProps) {
    let {
      dataField,
      displayField,
    } = this.props;
    let cValue = this.state.value;
    let cVal = _.isObject(cValue) ? cValue[dataField] : cValue;
    let cText = _.isObject(cValue) && cValue[displayField];
    let nValue = nextProps.value;
    let nVal = _.isObject(nValue) ? nValue[dataField] : nValue;
    let nText = _.isObject(nValue) && nValue[displayField];
    let shouldUpdate = cValue !== nValue || cText !== nText;
  },

  clearValue() {
    this.setState({
      value: null,
    });
  },

  getValue() {
    let {
      dataField,
      displayField,
    } = this.props;

    let { value } = this.state;

    if (_.isObject(value)) {
      value = {
        [displayField]: value[displayField],
        [dataField]: value[dataField],
      };
    }

    return value;
  },

  getStyles() {
    let styles = {
      menu: {
        maxHeight: '300px',
      },
    };

    return styles;
  },

  render() {
    let {
      dataField,
      disabled,
      displayField,
      floatingLabelText,
      floatingLabelStyle,
      hintText,
      nullItemText,
      style,
      underlineShow,
      width,
      margin,
      ...other,
    } = this.props;

    let {
      entries,
      value,
    } = this.state;

    let styles = this.getStyles();

    let found = false;
    let val = _.isObject(value) && value[dataField] ? value[dataField] : value;

    let dataSource = [];
    _.forEach(entries, (e, i) => {
      if (val === e[dataField]) {
        found = true;
      }

      dataSource.push({
        text: e[displayField],
        value: e[dataField],
      });
    });

    if (_.isObject(value) && value[dataField] && value[displayField] && !found) {
      dataSource.push({
        text: value[displayField],
        value: value[dataField],
      });
    }

    return (
      <AutoComplete
        {...other}
        ref={(ref) => this.airport = ref}
        dataSource={dataSource}
        disabled={disabled}
        filter={this._filter}
        floatingLabelText={floatingLabelText || this.t('nLabelAirports')}
        hintText={hintText || this.t('nTextInputToFindAirports')}
        nullItemText={nullItemText || this.t('nTextChooseAirports')}
        onNewRequest={this._handleDropdownChange}
        onUpdateInput={this._handleQueryChange}
        showNullItem={true}
        menuStyle={styles.menu}
        value={_.isObject(value) ? value[dataField] : value}
        floatingLabelStyle={floatingLabelStyle}
        style={style}
        fullWidth={true}
        width={width}
        margin={margin}
        underlineShow={underlineShow}
      />
    );
  },

  _filter(searchText, key) {
    return true;
  },

  _handleDropdownChange(value) {
    let {
      dataField,
      displayField,
      onChange,
    } = this.props;

    if (_.isFunction(onChange)) {
      onChange(value);
    }

    this.setState({
      value: {
        [dataField]: value && value.value,
        [displayField]: value && value.text,
      },
    });
  },

  _handleQueryChange(qry) {
    if(qry.length < MIN_KEY_LENGTH || qry.length > MAX_KEY_LENGTH) { return; }
    if (_.isFunction(searchAirports)) {
      searchAirports
        .promise({
          query: qry,
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
        })
        .catch(err => {});
    }
  },
});

module.exports = DropDownAirports;
