const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Flexible = require('epui-md/ep/Flexible');
const FormContainer = require('./form-container');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const PTCCConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
  },

  getDefaultProps() {
    return {
      order: null,
      orderEntry: null,
      productConfig: null,
    };
  },

  getInitialState() {
    return {};
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 10;
    let theme = this.getTheme();
    let styles = {
      root:{
        paddingBottom :padding,
      }
    };
    return styles;
  },

  getWrapped() {
    return this.refs.formContainer.getWrappedInstance();
  },

  isNotReadyToSave() {
    let wrapped = this.getWrapped();
    return wrapped.refs.form.isNotReadyToSave();
  },

  getDirtyFiles() {
    let wrapped = this.getWrapped();
    return wrapped.refs.form.getDirtyFiles();
  },

  getProductConfig() {
    let wrapped = this.getWrapped();
    return wrapped.refs.form.getProductConfig();
  },

  getCalculateConfig() {
    let wrapped = this.getWrapped();
    return wrapped.refs.form.getCalculateConfig();
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style={this.style('root')}>
        <FormContainer
          ref='formContainer'
          mode={this.props.mode}
          order={this.props.order}
          orderEntry={this.props.orderEntry}
          productConfig={this.props.productConfig}
        />
      </div>
    );
   },

});

module.exports = PTCCConfigForm;
