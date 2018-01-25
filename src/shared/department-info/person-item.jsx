const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const Paper = require('epui-md/Paper');
const ContactInfo = require('../contact-info');
const TextField = require('epui-md/TextField');
const Clear = require('epui-md/svg-icons/content/clear');
const TextFieldEmail = require('~/src/shared/text-field-email');
const TextFieldMobile = require('~/src/shared/text-field-mobile');
const TextFieldPhone = require('~/src/shared/text-field-phone');

const PersonItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onRemoveItem: PropTypes.func,
    personId: PropTypes.number,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value } = this.props;
    return {
      show: true,
      __v: value ? value.__v ? value.__v : 0 : 0,
    };
  },

  getStyles() {
    let styles = {
      root: {
        width: 430,
        padding: '24px 0px 40px 24px',
        position: 'relative',
        display: this.state.show ? 'inline-block' : 'none',
        marginTop: 20,
        marginRight: 25,
        verticalAlign: 'top',
      },
      name:{

      },
      button:{
        position: 'absolute',
        width: 18,
        height: 18,
        fill: '#f5a623',
        top: 13,
        right: 13,
        cursor: 'pointer',
      }
    };

    return styles;
  },

  getValue() {
    return {
      fullName: this.refs.personName.getValue(),
      contactMethods: [
          {type: 'CMP', value: this.refs.telphone.getValue()},
          {type: 'CMM', value: this.refs.mobile.getValue()},
          {type: 'CME', value: this.refs.email.getValue()}
      ],
      __v: this.state.__v,
    }
  },

  renderContactInfo(value){
    return (
      <div>
        <div>
          <TextFieldPhone
            key='telphone'
            ref='telphone'
            style={this.style('name')}
            defaultValue={value ? value.contactMethods ? this.getValueByLabel(value.contactMethods, 'CMP') : '' : ''}
          />
        </div>
        <div>
          <TextFieldMobile
            key='mobile'
            ref='mobile'
            style={this.style('name')}
            defaultValue={value ? value.contactMethods ? this.getValueByLabel(value.contactMethods, 'CMM') : '' : ''}
          />
        </div>
        <div>
          <TextFieldEmail
            key='email'
            ref='email'
            style={this.style('name')}
            defaultValue={value ? value.contactMethods ? this.getValueByLabel(value.contactMethods, 'CME') : '' : ''}
          />
        </div>
      </div>
    )
  },

  render() {
    let styles = this.getStyles();
    const {
      value,
      personId,
    } = this.props;
    let contactMethods = value ? value.contactMethods : [];
    return (
      <Paper zDepth={1} style={this.style('root')}>
        <Clear style={this.style('button')} onClick={this._handleRemoveItem.bind(this,personId, this.state.__v)}/>
        <TextField
          key='personName'
          ref='personName'
          floatingLabelText={this.t('nLabelContactPerson')}
          style={this.style('name')}
          defaultValue={value ? value.fullName ? value.fullName : '' : 'Person'}
        />
        {this.renderContactInfo(value)}
      </Paper>
    );
  },

  _handleRemoveItem(personId, __v) {
    const {
      onRemoveItem,
    } = this.props;
    this.setState({
      show: false,
    });
    onRemoveItem(personId, __v);
  },

  getValueByLabel(methods,label) {
    let value = '';
    _.forEach(methods,(method)=>{
      if(method.type && method.type === label){
        value = method.value;
      }
    });
    return value;
  },
});

module.exports = PersonItem;
