const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;
const IMO_REGEX = /^\d{7}$/;

const { IMOExists } = global.api.epds;

const TextFieldImo = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  translations: [
    require(`epui-intl/dist/ShipParticulars/${__LOCALE__}`),
  ],

  propTypes: {
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    nTextIMO: PropTypes.string,
    nTextImoExists: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      disabled: this.props.disabled,
      errorText: this.props.errorText,
      loading: false,
      value: this.props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;

    if (value !== this.state.value) {
      this.setState({
        value: value,
      });
    }
  },

  isValid() {
    let { disabled } = this.props;
    return disabled || this._checkImo(this.state.value);
  },

  getValue() {
    let {
      disabled,
      errorText,
      loading,
      value,
    } = this.state;
    value = !loading && !errorText ? _.trim(value) : null;

    return value;
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      disabled,
      errorText,
      loading,
      value,
      ...other,
    } = this.state;

    let {
      floatingLabelText,
      style,
    } = this.props;

    let styles = this.getStyles();

    return(
      <TextField
        {...other}
        ref="imo"
        disabled={disabled || loading}
        errorText={errorText}
        floatingLabelText={this.t('nTextIMO')}
        onBlur={this._handleBlur}
        onChange={this._handleChange}
        style={Object.assign(styles.root, style)}
        value={value}
        maxLength={7}
      />
    );
  },

  _handleBlur(e, value) {
    if(value.length === 0) return;
    this._checkImo(value);
  },

  _handleChange(e, value) {
    this.setState({
      value: value,
    });
  },

  _checkImo(imo) {
    imo = _.trim(imo);
    let len = imo ? imo.length : 0;

    if (!IMO_REGEX.test(imo) || len === 0) {
      this.setState({
        errorText: this.t('nTextImoIsRequired'),
      });

      return new Promise((resolve, reject) => {
        resolve(false);
      });
    } else {
      this.setState({
        errorText: null,
      });

      if (_.isFunction(IMOExists)) {
        this.setState({
          loading: true,
        });

        return new Promise((resolve, reject) => {
          IMOExists
            .promise(imo)
            .then(res => {
              let response = res.response;
              let exists = response.exists;
              let errorText = exists ? this.t('nTextImoExists') : null;

              this.setState({
                errorText: errorText,
                loading: false,
              }, () => {
                resolve(!exists);
              });
            })
            .catch(err => {
              this.setState({
                loading: false,
              }, reject);
            });
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      }
    }
  },
});

module.exports = TextFieldImo;
