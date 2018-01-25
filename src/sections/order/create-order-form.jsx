const React = require('react');
const _ = require('eplodash');
const AutoStype = require('epui-auto-style').mixin;
const OrderTypeForm = require('./order-type-form');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

const CreateOrderForm = React.createClass({
  mixins: [AutoStype, Translatable],

  translations: require(`epui-intl/dist/CreateOrder/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    ship: PropTypes.object,
    segment: PropTypes.object,
    orders: PropTypes.object,
    user: PropTypes.object,
    createOrder: PropTypes.func,
  },

  getDefaultProps() {
    return { };
  },

  getInitialState: function() {
    return {
      creating: null
    };
  },

  componentWillReceiveProps(nextProps) {
    let creating = this.state.creating;
    let loading = this._isLoading(nextProps);
    let error = this._getError(nextProps);

    if(creating && loading && !error) { return; }

    this.setState({
      creating: false
    });
  },

  getStyles() {
    return {
      tip: {
        textAlign: 'center',
        margin: '30px 0',
        color: '#989898'
      },
      bar: {
        'textAlign': 'center',
        'margin': '10px 0',
      }
    };
  },

  clearValue() {
    if(!this.refs.form) { return; }
    this.refs.form.clearValue();
  },

  getValue() {
    let type = this.refs.form.getValue();
    if(!type) { return; }

    let {
      ship,
      segment,
      user,
    } = this.props;

    return {
      type: type,
      ship: ship._id,
      segment: segment._id,
    };
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      segment,
    } = this.props;

    let loading = this._isLoading();
    let valid = this.state.valid;

    return (
      <div>
        <div style={this.style('tip')}>
          {this.t('nTextGuideToCreateOrder')}
        </div>
        <OrderTypeForm
          ref="form"
          disabled={loading}
          onChange={this._handleFormChange}
        />
        <div style={this.style('bar')}>
          <RaisedButton
            key='save'
            label={this.t('nButtonCreateOrder')}
            primary={true}
            capitalized='capitalize'
            disabled={loading || !valid}
            onTouchTap={this._handleCreateTouchTap} />
        </div>
      </div>
    );
  },

  _isLoading(props) {
    props = props || this.props;
    if(!props.orders) { return false; }
    return props.orders.getMeta('loading');
  },

  _getError(props) {
    props = props || this.props;
    if(!props.orders) { return false; }
    return props.orders.getMeta('error');
  },

  _handleFormChange(type) {
    this.setState({
      valid: !!type
    });
  },

  _handleCreateTouchTap() {
    let fn = this.props.createOrder;

    if (_.isFunction(fn)) {
      fn(this.getValue());

      this.setState({
        creating: true,
      });
    }
  },
});

module.exports = CreateOrderForm;
