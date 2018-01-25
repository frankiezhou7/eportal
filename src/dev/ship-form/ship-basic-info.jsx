const React = require('react');
const _ = require('eplodash');

const DropDownShipTypes = require('~/src/shared/dropdown-ship-types');
const DropDownShipSizes = require('~/src/shared/dropdown-ship-sizes');
const DropDownShipStatus = require('~/src/shared/dropdown-ship-status');
const TextFieldShipName = require('~/src/shared/text-field-ship-name');
const TextFieldImo = require('~/src/shared/text-field-imo');
const { ComposedForm, use } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

use(DropDownShipTypes);
use(DropDownShipSizes);
use(DropDownShipStatus);
use(TextFieldShipName);
use(TextFieldImo);

require('epui-intl/lib/locales/' + __LOCALE__);

const defs = [{
  component: 'Section',
  name: '',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'DropDownShipTypes',
      name: 'type',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#type',
      },
    },
  {
    component: 'DropDownShipSizes',
    name: 'size',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      value: '#size',
    },
  },
  {
      component: 'TextFieldShipName',
      name: 'name',
      props: {
        style: {
          marginRight: '10px',
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
          float: 'left',
        },
        value: '#imo',
      },
  },
  {
      component: 'DropDownShipStatus',
      name: 'status',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#status',
      },
  }
 ],
}];

const ShipBasicInfo = React.createClass({
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
        imo: 0,
        type: '',
        size: '',
        status: ''
      }
    };
  },

  getStyles() {
    let styles = {
      root: {
        width: '100%',
        overflow: 'auto',
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

module.exports = ShipBasicInfo;
