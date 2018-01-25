const React = require('react');
const _ = require('eplodash');

const TextField = require('epui-md/TextField/TextField');
const { ComposedForm, use, createComponentPool } = require('epui-composer');
const Validatable = require('epui-md/HOC/Validatable');
const TextFieldWebsite = require('~/src/shared/text-field-website');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

use(TextFieldWebsite);

const BankInformation = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
    onChange: PropTypes.func,
  },

  getDefaultProps(){
    return{
      value:{},
    };
  },

  getStyles() {
    let styles = {
      root: {
        margin: '20px 0px -20px -20px',
      },
    };
    return styles;
  },

  getValue(){
    return this.refs.form.getValue();
  },

  isValid(){
    return this.refs.form.isValid();
  },

  isChanged() {
    return this.refs.form.isChanged();
  },

  getDefs() {
    let defs =  [{
      component: 'Section',
      props: {

      },
      children: [{
        component: 'TextFieldWebsite',
        name: 'name',
        props: {
          style: {
            width: global.contentWidth,
            marginRight: '10px',
            float: 'left',
          },
          floatingLabelText:'Bank',
          defaultValue: '#name',
          isUnderlineFocused: true,
        },
      },{
        component: 'TextFieldWebsite',
        name: 'beneficiary',
        props: {
          style: {
            width: global.contentWidth,
            marginRight: '10px',
            float: 'left',
          },
          floatingLabelText:'Beneficiary',
          defaultValue: '#beneficiary',
          isUnderlineFocused: true,
        },
      },{
        component: 'TextFieldWebsite',
        name: 'accountNo',
        props: {
          style: {
            width: '475px',
            marginRight: '10px',
            float: 'left',
          },
          floatingLabelText:'Account No.',
          defaultValue: '#accountNo',
          isUnderlineFocused: true,
        },
      },{
        component: 'TextFieldWebsite',
        name: 'bankCode',
        props: {
          style: {
            width: '475px',
            float: 'left',
          },
          floatingLabelText:'BIC/SWIFT',
          defaultValue: '#bankCode',
          isUnderlineFocused: true,
        },
      }]
    }];
    return defs;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style={this.style('root')}>
        <ComposedForm
          ref="form"
          definitions={this.getDefs()}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  },
});

module.exports = BankInformation;
