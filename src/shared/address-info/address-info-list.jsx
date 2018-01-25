const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DropDownCountries = require('../dropdown-countries');
const DropDownStates = require('../dropdown-states/dropdown-states');
const TextFieldProvince = require('../text-field-province');
const TextFieldCity = require('../text-field-city');
const TextFieldStreetAddress = require('../text-field-street-address');
const TextFieldPostCode = require('../text-field-post-code');

const AddressInfoList = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    country: PropTypes.string,
    state: PropTypes.object,
    value: PropTypes.object,
    options: PropTypes.object,
  },

  getValue() {
    return {
      country: this.refs.country.getValue(),
      state: this.refs.state.getValue(),
      city: this.refs.city.getValue(),
      line1: this.refs.streetAddress.getValue(),
      postCode: this.refs.postCode.getValue(),
    }
  },

  isValid() {
    return this.refs.postCode.isValid();
  },

  getStyles() {
    let styles = {
      root: {
        maxWidth: '780px',
      },
    };

    return styles;
  },

  render() {

    const {
      country,
      state,
      value,
      options,
    } = this.props;

    const cityValue = value && value.city;
    const line1Value = value && value.line1;
    const postCodeValue = value && value.postCode;
    const { countryOptions, stateOptions, cityOptions, streetAddressOptions, postCodeOptions} = this.props.options || {};

    return(
      <div style={this.style('root')}>
        <DropDownCountries
          ref='country'
          style={{margin:'0 2px'}}
          value={country}
          {...countryOptions}
        />
        <DropDownStates
          ref='state'
          value={state}
          {...stateOptions}
        />
        <TextFieldCity
          ref='city'
          defaultValue={cityValue}
          {...cityOptions}
        />
        <TextFieldStreetAddress
          ref='streetAddress'
          defaultValue={line1Value}
          {...streetAddressOptions}
        />
        <TextFieldPostCode
          ref='postCode'
          defaultValue={postCodeValue}
          {...postCodeOptions}
        />
      </div>
    )
  }

})

module.exports = AddressInfoList;
