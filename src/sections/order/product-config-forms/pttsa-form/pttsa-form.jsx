const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const FormContainer = require('./form-container');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const PTTSAConfigForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

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
      orderEntry:null,
      subProducts:null,
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
    let padding = 2;
    let theme = this.getTheme();
    let styles = {
      root:{
        marginLeft: padding * 5,
        paddingTop: padding * 5,
        paddingBottom: padding * 5,
        marginRight: padding * 6,
      },
    };
    return styles;
  },

  isNotReadyToSave() {
    let wrapper = this.refs.formContainer.getWrappedInstance();
    return wrapper.refs.form.isNotReadyToSave();
  },

  getDirtyFiles() {
    let wrapper = this.refs.formContainer.getWrappedInstance();
    return wrapper.refs.form.getDirtyFiles();
  },

  getProductConfig() {
    let wrapper = this.refs.formContainer.getWrappedInstance();
    return wrapper.refs.form.getProductConfig();
  },

  render() {
    let {
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;

    return (
      <FormContainer
        ref='formContainer'
        mode={mode}
        order={order}
        orderEntry={orderEntry}
        productConfig={productConfig}
        style={this.style('root')}
      />
    );
   },
});

module.exports = PTTSAConfigForm;
