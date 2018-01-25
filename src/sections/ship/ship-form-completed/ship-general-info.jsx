const React = require('react');
const _ = require('eplodash');

const DropDownPorts = require('~/src/shared/dropdown-ports');
const DropDownCountries = require('~/src/shared/dropdown-countries');
const DropDownPiClubs = require('~/src/shared/dropdown-pi-clubs');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const { ComposedForm, use } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

use(TextField);
use(DropDownPorts);
use(DropDownCountries);
use(DropDownPiClubs);

require('epui-intl/lib/locales/' + __LOCALE__);

const defs = [
{
  component: 'Section',
  name: '',
  props: {
    title: 'General Information',
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
      floatingLabelText:'Official No.',
      defaultValue: '#officialNo',
      checkOnBlur: 'true',
      maxLength: '12',
    },
  },{
    component: 'TextField',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      checkOnBlur: 'true',
      floatingLabelText:'Call No.',
      defaultValue: '#callNo',
    },
  },{
    component: 'TextField',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      checkOnBlur: 'true',
      validType: 'number',
      floatingLabelText:'MMSI No.',
      defaultValue: '#mmSINo',
    },
  },
  {
    component: 'DropDownCountries',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      type : 'Flag',
      value: '#nationality',
    },
  },{
    component: 'DropDownPorts',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      type: 'RegistryPort',
      value: '#portOfRegistry',
    },
  },{
    component: 'TextField',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      multiLine: true,
      floatingLabelText:'Classification',
      defaultValue: '#classNotation',
    },
  },{
    component: 'DropDownPiClubs',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      value:'#piClub'
    },
  }
 ]
 },
];

const ShipGeneralInfo = React.createClass({
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
         officialNo: '',
         callNo: '',
         mmSINo: '',
         nationality: '',
         portOfRegistry: { text: '', value: '' },
         registryCode: '',
         classNotation: '',
         piClub: ''
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

module.exports = ShipGeneralInfo;
