const React = require('react');
const _ = require('eplodash');

const ShipBasicInfo = require('./ship-basic-info');
const ShipGeneralInfo = require('./ship-general-info');
const ShipBeam = require('./ship-beam');
const ShipHeight = require('./ship-height');
const ShipLOA = require('./ship-loa');
const ShipTonnage = require('./ship-tonnage');
const ShipDisplacement = require('./ship-displacement');
const ShipEngine = require('./ship-engine');
const ShipSpeed = require('./ship-speed');
const ShipContact = require('./ship-contact');
const ShipManagements = require('~/src/shared/ship-managements');
const LiftingWeight = require('~/src/shared/lifting-weight');
const LoadLineTable = require('~/src/shared/LoadlineTable');
const HoldTable = require('~/src/shared/HoldTable');

const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');

const FlatButton  = require('epui-md/FlatButton');

const ThemeManager = require('~/src/styles/theme-manager');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const { ComposedForm, use } = require('epui-composer');

const TextFieldUnit = Validatable(RawTextFieldUnit);
const TextField = Validatable(RawTextField);
const PropTypes = React.PropTypes;

use(ShipBasicInfo);
use(ShipGeneralInfo);
use(ShipBeam);
use(ShipHeight);
use(ShipLOA);
use(ShipTonnage);
use(ShipDisplacement);
use(ShipEngine);
use(ShipSpeed);
use(ShipContact);
use(ShipManagements);
use(LiftingWeight);
use(TextField);
use(TextFieldUnit);
use(LoadLineTable);
use(HoldTable);
use(FlatButton);

require('epui-intl/lib/locales/' + __LOCALE__);

const defs = [{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipBasicInfo',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#baiscInfo',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    title: 'Management',
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipManagements',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#managements',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipGeneralInfo',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#generalInfo',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipBeam',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#breadth',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipHeight',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#height',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipLOA',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#length',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipTonnage',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#tonnage',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'LoadLine',
    style:{
      marginTop: 20,
    }
  },
  children: [{
    component: 'LoadLineTable',
    props: {
      value:'#loadLines',
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipDisplacement',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#displacement',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'Tons Per Centimeter Immersion',
    style:{
      marginTop: 20,
    }
  },
  children: [{
    component: 'TextFieldUnit',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      unitLabelText: 't/cm',
      floatingLabelText:'Tons Per Centimeter Immersion',
      defaultValue : '#tpc',
      validType:'number',
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipEngine',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#engine',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'Propeller',
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
      floatingLabelText:'Propeller Type',
      value:'#propeller'
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipSpeed',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#speed',
      },
    }
 ],
},
{
  component: 'Section',
  props: {
    title: 'LoadLine',
    style:{
      marginTop: 20,
    }
  },
  children: [{
    component: 'HoldTable',
    props: {
      value : '#holds',
    },
  }]
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'Crane',
    style:{
      marginTop: 20,
    }
  },
  children: [{
    component: 'LiftingWeight',
    props: {
      value: '#crane',
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipContact',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#contact',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props:{
    style:{
      textAlign: 'center',
      marginTop: 20,
    }
  },
  children: [{
    component: 'FlatButton',
    name: 'type',
    props: {
      label: 'Delete This Ship',
      backgroundColor: 'red',
      labelStyle:{color: 'white'}
    },
  }]
},
];

const ShipForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getStyles() {
    let styles = {
      root: {
        padding: '50px',
        width: '100%',
        height: 'calc(100% - 100px)',
        overflow: 'auto',
      },
    };
    return styles;
  },

  handleTouchTap(){
    this.refs.form.isValid()
      .then((valid)=>{
        console.log('valid....',valid);
      });
    console.log(require('util').inspect(this.refs.form.getValue(), { depth: null }));
  },

  render() {
    return (
      <div style={this.style('root')}>
        <ComposedForm
          ref="form"
          definitions={defs}
          value = {{
            baiscInfo:{
              name: 'ship name',
              imo: 7890567,
              type: 'STRS',
              size: 'SSTHM',
              status: 'SSAB'
            },
            managements: [
              { role: 'OROP',
                organization: {
                  text: 'Mercuria Energy Trading Pte Ltd',
                  value: '563886e51920abd8e88d562b'
                }
              },
              { role: 'ORSO',
                organization: {
                  text: 'EDF Trading Markets Ltd',
                  value: '563886e51920abd8e88d5619'
                }
              }
            ],
            generalInfo: {
              officialNo: '123',
              callNo: '1213121',
              mmSINo: '21312131',
              nationality: '563886dc1920abd8e88d54f5',
              portOfRegistry: {
                text: 'ADAK',
                value: '5638885ab0e1042701c2aa2e'
              },
              registryCode: '213121',
              classNotation: 'swewe sd sd s ds ',
              piClub: 'PINOAG'
            },
            breadth: {
              moulded: 'abc',
              extreme: '12'
            },
            height: {
              toTopMast: 'abc',
              toTopOfHatch: '123',
              toDesk: '123'
            },
            length: {
              overall: 'abc',
              registered: '123',
              betweenPerpendiculars: '123',
              atWaterLine: '123',
              bowToBridge: '123',
              bridgeToAft: '123'
            },
            tonnage: {
              grtIctm69: 'abc',
              nrtIctm69: '123',
              grtIuez: '123',
              nrtIuez: '123'
            },
            loadLines:[
              { mark: 'Mark_1',
                freeBoard: 1,
                draft: 1,
                dwt: 1,
                displacement: 1
              },
              { mark: 'Mark_2',
                freeBoard: 2,
                draft: 2,
                dwt: 2,
                displacement: 2
              },
              { mark: 'Mark_3',
                freeBoard: 3,
                draft: 3,
                dwt: 3,
                displacement: 3
              },
              { mark: 'Mark_4',
                freeBoard: 4,
                draft: 4,
                dwt: 4,
                displacement: 4
              },
              { mark: 'Mark_5',
                freeBoard: 5,
                draft: 5,
                dwt: 5,
                displacement: 5
              }
            ],
            displacement: {
              lightShip: 'avc',
        			fullLoad: 123
            },
            tpc: 'abc',
            engine:{
              mainEngineType:'asjafioe',
              mainEnginePower:'abc',
              auxEngineType:'asfeeeee',
              auxEnginePower:3000
            },
            propeller: 'ajdiosjafoiew',
            speed:{
              max: 'abc',
              average: 300
            },
            holds: [
             { no: 'No._1',
               maxCargoWeight: 1,
               cubicCapacity: 1,
               maxPermitLoad: 1,
               hatchLength: 1,
               hatchBreadth: 1,
               ballastTanksCapacity: 1
             },
             { no: 'No._2',
               maxCargoWeight: 2,
               cubicCapacity: 2,
               maxPermitLoad: 2,
               hatchLength: 2,
               hatchBreadth: 2,
               ballastTanksCapacity: 2
             },
             { no: 'No._3',
               maxCargoWeight: 3,
               cubicCapacity: 3,
               maxPermitLoad: 3,
               hatchLength: 3,
               hatchBreadth: 3,
               ballastTanksCapacity: 3
             },
             { no: 'No._4',
               maxCargoWeight: 4,
               cubicCapacity: 4,
               maxPermitLoad: 4,
               hatchLength: 4,
               hatchBreadth: 4,
               ballastTanksCapacity: 4
             },
             { no: 'No._5',
               maxCargoWeight: 5,
               cubicCapacity: 5,
               maxPermitLoad: 5,
               hatchLength: 5,
               hatchBreadth: 5,
               ballastTanksCapacity: 5
             }
             ],
            contact:{
              satfb: '098-08990',
              satc: '000-08990',
              email: '111@11.com'
            },
            crane:[{
              maximumLoad: '123',
              amount: '231'
            },
            {
              maximumLoad: '123',
              amount: '123'
            }],
          }}
        />
       <FlatButton
         label ={'get Value'}
         style = {{marginTop: 20}}
         onTouchTap = {this.handleTouchTap}
       />
      </div>
    );
  },
});

module.exports = ShipForm;
