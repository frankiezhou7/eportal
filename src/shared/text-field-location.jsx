const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldLocation = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Port/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    defaultValue: PropTypes.object,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    hintText: PropTypes.string,
    nTextLocation: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onTouchTap: PropTypes.func,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentWillUnmount() {
    clearTimeout(this.timeout);
  },

  getValue() {
    let { defaultValue } = this.props;
    let value = [{
      longitude: this.refs.longitude.getValue(),
      latitude: this.refs.latitude.getValue()
    }];

    if(defaultValue && defaultValue.points){
      return {
        points: value,
      }
    }else {
      return {
        longitude: this.refs.longitude.getValue(),
        latitude: this.refs.latitude.getValue()
      }
    }
  },

  isChanged() {
    return this.refs.longitude.isChanged() && this.refs.latitude.isChanged();
  },

  isValid() {
    let longitude = true, latitude = true, _this = this;
    this.refs.longitude.isValid().then(function(res){
      longitude = res;
    });
    this.refs.latitude.isValid().then(function(res){
      latitude = res;
    });
    this.__promise = new Promise((res, rej) => {
      _this.timeout = setTimeout(() => {
        res(longitude && latitude);
      },500);
    }).then((res) => {
      return res;
    }).catch(err => {
      return rej(err);
    });

    return this.__promise;
  },

  getStyles() {
    let styles = {
      root: {
        display: 'inline-block',
      },
      item: {
        verticalAlign: 'middle',
      }
    };

    return styles;
  },

  render() {
    let {
      defaultValue,
      disabled,
      errorText,
      floatingLabelText,
      hintText,
      onBlur,
      onChange,
      onFocus,
      onTouchTap,
      style,
      ...other,
    } = this.props;

    let styles = this.getStyles();
    let value = defaultValue ? defaultValue.points ? defaultValue.points[0] : defaultValue : '';
    return (
      <div style={this.style('root')}>
        <TextField
          ref="longitude"
          defaultValue={value && value.longitude}
          disabled={disabled}
          errorText={errorText}
          floatingLabelText={floatingLabelText || this.t('nTextLongitude')}
          hintText={hintText}
          onBlur={onBlur || this._handleBlur.bind(this, 'longitude')}
          onChange={onChange}
          onFocus={onFocus}
          onTouchTap={onTouchTap}
          style={Object.assign(styles.item, style)}
          checkOnBlur={true}
          validType='number'
          validError={this.t('nErrorTextIntegerIsRequired')}
        />
        <TextField
          ref="latitude"
          defaultValue={value && value.latitude}
          disabled={disabled}
          errorText={errorText}
          floatingLabelText={floatingLabelText || this.t('nTextLatitude')}
          hintText={hintText}
          onBlur={onBlur || this._handleBlur.bind(this, 'latitude')}
          onChange={onChange}
          onFocus={onFocus}
          onTouchTap={onTouchTap}
          style={Object.assign(styles.item, style)}
          checkOnBlur={true}
          validType='number'
          validError={this.t('nErrorTextIntegerIsRequired')}
        />
      </div>
    );
  },

  _handleBlur(name){
    let value = this.refs[name].getValue();
    if(name === 'longitude'){
      if(Number(value) > 180 || Number(value) < -180) {
        alert(this.t('nErrorLongitudeRange'));
      }
    }else{
      if(Number(value) > 90 || Number(value) < -90) {
        alert(this.t('nErrorLatitudeRange'));
      }
    }
  },
});

module.exports = TextFieldLocation;
