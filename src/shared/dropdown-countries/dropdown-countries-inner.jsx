const React = require('react');
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');
const MIN_KEY_LENGTH = 2;

const DropDownCountriesInner = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/DropDownCountries/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    countries: PropTypes.object,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    floatingLabelText: PropTypes.string,
    floatingLabelStyle:PropTypes.object,
    listCountries: PropTypes.func,
    nTextChooseCountries: PropTypes.string,
    nTextNoCountriesFound: PropTypes.string,
    nTextSuggestedCountries: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    onChange:PropTypes.func,
    type : PropTypes.oneOf(['Nationality','Flag']),
    menuStyle: PropTypes.object,
    keyLabel: PropTypes.string,
    keyLabelStyle: PropTypes.object,
    required: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disabled: false,
      type: 'Nationality',
    };
  },

  getInitialState() {
    return {
      query: null,
      value: this.props.value,
    };
  },

  componentWillMount() {
    let countries = this.props.countries;
    if (!countries || countries.size <= 0) {
      this.props.listCountries();
    }
  },

  componentWillReceiveProps(nextProps) {
    // if(nextProps.value === undefined) return;
    // let { value } = nextProps;
    // if (this.state.value !== value) {
    //   this.setState({
    //     value: value,
    //   });
    // }
  },

  isValid() {
    let valid = true;
    if(this.props.required && !this.state.value) { valid = false };
    return new Promise((res, rej) => {
      res(valid);
    });
  },

  isChanged() {
    return this.country.isChanged();
  },

  clearValue() {
    this.setState({
      value: null,
    });
  },

  getValue() {
    return this.state.value;
  },

  getStyles() {
    let styles = {
      root: {
        float: 'left',
      },
    };

    styles.menu = _.merge(styles.menu, this.props.menuStyle);
    return styles;
  },

  render() {
    let {
      countries,
      disabled,
      label,
      style,
      type,
      keyLabel,
      keyLabelStyle,
      floatingLabelText,
      ...other,
    } = this.props;

    let {
      query,
      value,
    } = this.state;

    let styles = this.getStyles();
    let dataSource = [], filteredCountries = [];

    if(countries.size > 0) {
      let found = false;

      if(query) {
        filteredCountries = countries.filter(c => {
          return _.startsWith(c.name.toLowerCase(), query.toLowerCase()) && c._id !== value;
        }).toJS();

        filteredCountries.forEach((country, index) => {
          found = (value && value === country._id) ? true : false;

          dataSource.push({
            text: country.name,
            value: country._id,
          });
        });
      }

      if (value && !found) {
        let filtered = _.find(countries.toJS(), ['_id', value]);
        if (filtered) {
          dataSource.push({
            text: filtered.name,
            value: filtered._id,
          });
        }
      }
    }

    return (
      <AutoComplete
        {...other}
        ref={(ref) => this.country = ref}
        dataSource={dataSource}
        disabled={disabled}
        filter={this._filter}
        floatingLabelText={floatingLabelText || this.t(`nText${type}`)}
        keyLabel={keyLabel}
        keyLabelStyle={keyLabelStyle}
        foundText={this.t('nTextChooseCountries')}
        initialText={this.t('nTextChooseCountries')}
        notFoundText={this.t('nTextNoCountriesFound')}
        nullItemText={this.t('nTextChooseCountries')}
        onNewRequest={this._handleNewRequest}
        onUpdateInput={this._handleUpdateInput}
        showNullItem={true}
        style={Object.assign(styles.root, style)}
        value={value}
      />
    );
  },

  _handleNewRequest(chosenRequest, index, value) {
    if(this.props.onChange) this.props.onChange(chosenRequest, index, value);
    if (value !== this.state.value) {
      this.setState({
        value,
      });
    }
  },

  _handleUpdateInput(qry) {
    if(qry.length < MIN_KEY_LENGTH) { return; }
    this.setState({ query: qry });
  },

  _filter() {
    return true;
  },
});


const { listCountries } = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      countries: state.getIn(['country', 'list']),
      listCountries,
    };
  },
  null,
  null,
  {withRef: true},
)(DropDownCountriesInner);
