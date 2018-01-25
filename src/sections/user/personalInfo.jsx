const React = require('react');
const _ = require('eplodash');
const PropTypes = React.PropTypes;
const RadioButton = require('epui-md/RadioButton');
const RadioButtonGroup = require('epui-md/RadioButton/RadioButtonGroup');
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField/TextField');
const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const Translatable = require('epui-intl').mixin;

const PersonalInfo = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/PersonalInfo/${__LOCALE__}`),

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    firstName: PropTypes.string,
    gender: PropTypes.oneOf(['male', 'female']),
    lastName: PropTypes.string,
    nErrorTextBirthDate: PropTypes.string,
    nErrorTextFirstName: PropTypes.string,
    nErrorTextLastName: PropTypes.string,
    nHintFirstName: PropTypes.string,
    nHintLastName: PropTypes.string,
    nLabelBirthDate: PropTypes.string,
    nTextDropDownMenuAutoCompleted: PropTypes.string,
    nTextDropDownMenuAutoCompletedItem: PropTypes.string,
    nLabelFirstName: PropTypes.string,
    nLabelGenderFemale: PropTypes.string,
    nLabelGenderMale: PropTypes.string,
    nLabelLastName: PropTypes.string,
    nLabelNationality: PropTypes.string,
    selectedName: PropTypes.string,
    selectedValue: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onSearchInputKeyUp: PropTypes.func,
    wrapperStyle: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {
        width: '380px',
        height: '357px',
      },
      radioButton: {
        display: 'inline-block',
        width: '100px',
      },
      radioButtonGroup: {
        display: 'inline-block',
        marginTop: '30px',
      },
      textField: {
        float: 'left',
        marginBottom: '10px',
      },
      countryCode: {
        root: {
          marginLeft: '-24px',
          width: '368px',
          maxHeight: '200px',
        },
        underlineStyle: {
          margin: '-1px 0',
        },
        dropDownMenuAutoCompleted: {
          marginLeft: '-24px',
          width: '368px',
          fontSize: '14px',
        },
      },
    };

    return styles;
  },

  getValue() {
    return {
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
    };
  },

  render() {
    let styles = this.getStyles();

    let {
      disabled,
      nLabelFirstName,
      nHintFirstName,
      nLabelLastName,
      nHintLastName,
      nLabelGenderMale,
      nLabelGenderFemale,
      nLabelBirthDate,
      nLabelNationality,

      firstName,
      nErrorTextFirstName,
      nErrorTextLastName,

      nErrorTextBirthDate,
      nTextDropDownMenuAutoCompleted,
      nTextDropDownMenuAutoCompletedItem,

      selectedValue,
      selectedName,

      wrapperStyle,
      ...other,
    } = this.props;

    return (
      <div style={this.mergeAndPrefix(styles.root, wrapperStyle)}>
        <TextField
          ref='firstName'
          defaultValue={firstName}
          errorText={nErrorTextFirstName}
          floatingLabelText={this.t('nLabelFirstName')}
          fullWidth={true}
          hintText={this.t('nHintFirstName')}
          isWarning={true}
          showIcon={true}
          style={styles.textField}
          onBlur={this._handleBlur.bind(null, 'firstName')}
        />
        <TextField
          ref='lastName'
          defaultValue={this.props.lastName}
          errorText={nErrorTextLastName}
          floatingLabelText={this.t('nLabelLastName')}
          fullWidth={true}
          hintText={this.t('nHintLastName')}
          isWarning={true}
          showIcon={true}
          style={styles.textField}
          onBlur={this._handleBlur.bind(null, 'lastName')}
        />
      </div>
    );
  },

  _handleBlur(ref, e) {
    let fn = this.props.onBlur;
    if (_.isFunction(fn)) {
      let val = this.getValue();
      fn(ref, val);
    }
  },
});

module.exports = PersonalInfo;
