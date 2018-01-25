const React = require('react');
const _ = require('eplodash');

const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const { ComposedForm, use } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;
const TextFieldUnit = Validatable(RawTextFieldUnit);
const TextField = Validatable(RawTextField);

use(TextFieldUnit);

const defs = [
  {
    component: 'Section',
    name: '',
    props: {
      title: 'Main Engine',
      style:{
        marginTop: 20,
      }
    },
    children: [{
      component: 'TextField',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        floatingLabelText:'Main Engine Type',
        defaultValue: '#mainEngineType',
      },
    },{
      component: 'TextFieldUnit',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        unitLabelText: 'PRM',
        floatingLabelText:'Main Engine Power',
        validType: 'number',
        defaultValue: '#mainEnginePower',
      },
    },{
      component: 'TextField',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        floatingLabelText:'Aux Engine Type',
        defaultValue: '#auxEngineType',
      },
    },{
      component: 'TextFieldUnit',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        unitLabelText: 'PRM',
        floatingLabelText:'Aux Engine Power',
        validType: 'number',
        defaultValue: '#auxEnginePower',
      },
    }]
  }
];

const ShipEngine = React.createClass({
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
        mainEngineType:'',
        mainEnginePower:0,
        auxEngineType:'',
        auxEnginePower:0
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

module.exports = ShipEngine;
