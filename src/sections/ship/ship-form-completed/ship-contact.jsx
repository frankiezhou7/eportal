const React = require('react');
const _ = require('eplodash');

const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const { ComposedForm, use } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

use(TextField);

const defs = [
  {
    component: 'Section',
    name: '',
    props: {
      title: 'Ship\'s Contact Details',
      style:{
        marginTop: 20,
      }
    },
    children: [{
      component: 'TextField',
      props: {
        floatingLabelText: 'Phone SAT-FB',
        style: {
          marginRight: '10px',
          verticalAlign: 'middle'
        },
        defaultValue:'#satfb',
      },
    },{
      component: 'TextField',
      props: {
        floatingLabelText: 'SAT-C',
        style: {
          marginRight: '10px',
          verticalAlign: 'middle'
        },
        defaultValue:'#satc',
      },
    },{
      component: 'TextField',
      props: {
        floatingLabelText: 'E-Mail',
        style: {
          marginRight: '10px',
          verticalAlign: 'middle'
        },
        defaultValue:'#email',
        validType: 'email'
      },
    }]
  },
];

const ShipContact = React.createClass({
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
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps(){
    return{
      value:{
        satfb: '',
  			satc: '',
  			email: '',
      }
    };
  },

  getStyles() {
    let styles = {
      root: { width: '100%' },
    };
    return styles;
  },

  getValue(){
    return this.refs.form.getValue();
  },

  isValid(){
    return this.refs.form.isValid();
  },

  render() {
    return (
      <div style={this.style('root')}>
        <ComposedForm
          ref="form"
          definitions={defs}
          value={this.props.value}
        />
      </div>
    );
  },
});

module.exports = ShipContact;
