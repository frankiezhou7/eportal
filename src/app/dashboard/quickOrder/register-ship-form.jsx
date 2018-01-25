const React = require('react');
const _ = require('eplodash');

const DropDownShipTypes = require('~/src/shared/dropdown-ship-types');
const DropDownCountries = require('~/src/shared/dropdown-countries');
const TextFieldShipName = require('~/src/shared/text-field-ship-name');
const TextFieldImo = require('~/src/shared/text-field-imo');
const { ComposedForm, use } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

use(DropDownShipTypes);
use(DropDownCountries);
use(TextFieldShipName);
use(TextFieldImo);

require('epui-intl/dist/Dashboard/' + __LOCALE__);

const RegisterShip = React.createClass({
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
    return {
      value: {
        name: '',
        imo: '',
        type: '',
      },
    };
  },

  getStyles() {
    let styles = {
      root: {
        width: '100%',
        overflow: 'auto',
        marginLeft: -18,
      },
      hint: {
        fontSize: 14,
        margin: '0 0 -10px 20px',
        display: 'block',
      },
      title: {
        fontSize: 16,
        color: '#4a4a4a',
        display: 'block',
        margin: '10px 0px 20px 20px',
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

  render() {
    let disabled = this.props.value.imo ?  true : false ;
    const defs = [{
      component: 'Section',
      name: '',
      props:{
        style:{
        }
      },
      children: [
      {
          component: 'TextFieldShipName',
          name: 'name',
          props: {
            style: {
              marginRight: '10px',
              marginBottom: '-20px',
              float: 'left',
            },
            value: '#name',
          },
      },
      {
        component: 'TextFieldImo',
        name: 'imo',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          value: '#imo',
          disabled : disabled
        },
      },
      {
        component: 'DropDownCountries',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          type : 'Flag',
          value: '#nationality',
        },
      },
      {
        component: 'DropDownShipTypes',
        name: 'type',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          value: '#type',
        },
      },
      {
        component: 'TextFieldUnit',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          unitLabelText: 'm',
          floatingLabelText:'LOA',
          defaultValue: '#length.overall',
          validType: 'number',
        },
      },
      {
        component: 'TextFieldUnit',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          unitLabelText: 'm',
          floatingLabelText:'Beam',
          defaultValue: '#breadth.moulded',
          validType:'number'
        },
      },
      {
        component: 'TextFieldUnit',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          unitLabelText: 't',
          floatingLabelText:'GRT',
          defaultValue:'#grt.ictm69',
          validType: 'number',
        },
      },
      {
        component: 'TextFieldUnit',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          unitLabelText: 't',
          floatingLabelText:'NRT',
          defaultValue:'#nrt.ictm69',
          validType: 'number',
        },
      },
      {
        component: 'TextFieldUnit',
        props: {
          style: {
            marginRight: '10px',
            marginBottom: '-20px',
            float: 'left',
          },
          unitLabelText: 't',
          floatingLabelText:'DWT',
          defaultValue:'#dwt',
          validType: 'number',
        },
      },
     ],
    }];

    return (
      <div style={this.style('root')}>
        <span style={this.style('title')}>
          {this.t('nTextRegisterVessel')}
        </span>
        <span style={this.style('hint')}>
          {this.t('nTextFillInfo')}
        </span>
        <ComposedForm
          ref="form"
          definitions={defs}
          value={this.props.value}
        />
      </div>
    );
  },
});

module.exports = RegisterShip;
