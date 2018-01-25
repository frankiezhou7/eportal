const _ = require('eplodash');
const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Form = require('./form');
const Translatable = require('epui-intl').mixin;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;

const FormContainer = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    currencies: PropTypes.object,
    config: PropTypes.object,
    findCurrencies: PropTypes.func,
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    let {
      currencies,
      findCurrencies,
    } = this.props;

    let entries = currencies && currencies.get('entries');

    if(!entries || entries.size === 0) {
      if (_.isFunction(findCurrencies)) {
        findCurrencies({ size: 99 });
      }
    }
  },

  getStyles() {
    let rootStyle = {
      display: 'bolck',
    };
    if(this.props.style) {
      _.merge(rootStyle, this.props.style);
    }

    return {
      root: rootStyle,
    };
  },

  render() {
    let {
      config,
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;

    return (
      <Form
        {...this.props}
        ref='form'
        config={config}
        mode={mode}
        order={order}
        orderEntry={orderEntry}
        productConfig={productConfig}
        style={this.style('root')}
      />
    );
  },
});

// render() {
//   return (
//     <AltContainer
//       ref='container'
//       render={this.renderForm}
//       stores={[store]}
//       inject={{
//         currencies: this._getCurrencies
//       }}
//     />
//   );
// },

let {
  findCurrencies,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      currencies: state.getIn(['currency', 'list']),
      findCurrencies,
    };
  },
  null,
  null,
  {withRef: true},
)(FormContainer);
