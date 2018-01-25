const React = require('react');
const _ = require('eplodash');

const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Validatable = require('epui-md/HOC/Validatable');
const { ComposedForm, use } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;
const TextFieldUnit = Validatable(RawTextFieldUnit);

use(TextFieldUnit);

const defs = [
  {
    component: 'Section',
    name: '',
    props: {
      title: 'Speed',
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
        unitLabelText: 'knot',
        floatingLabelText:'The fastest speed',
        validType: 'number',
        defaultValue:'#max',
      },
    },{
      component: 'TextFieldUnit',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        unitLabelText: 'knot',
        floatingLabelText:'The average speed',
        validType: 'number',
        defaultValue:'#average',
      },
    }]
  }
];

const ShipSpeed = React.createClass({
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
        max: 0,
  			average: 0,
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

module.exports = ShipSpeed;
