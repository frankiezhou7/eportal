const React = require('react');
const _ = require('eplodash');
const AutoStype = require('epui-auto-style').mixin;
const Dialog = require('epui-md/ep/Dialog/Dialog');
const FlatButton = require('epui-md/FlatButton');
const OrderTypeForm = require('./order-type-form');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const CreateOrderDialog = React.createClass({
  mixins: [AutoStype, Translatable],

  translations: require(`epui-intl/dist/CreateOrder/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    account: PropTypes.object,
    createOrder: PropTypes.func,
    nButtonCreate: PropTypes.string,
    nTextCancel: PropTypes.string,
    nTitleCreateOrder: PropTypes.string,
    open: PropTypes.bool,
    orders: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    user: PropTypes.object,
  },

  getDefaultProps() {
    return {
      open: false,
    };
  },

  getInitialState() {
    return {
      creating: null,
      open: this.props.open,
    };
  },

  componentWillReceiveProps(nextProps) {
    let creating = this.state.creating;
    let loading = this._isLoading(nextProps);
    let error = this._getError(nextProps);

    if(creating && loading && !error) { return; }

    this.setState({
      creating: false,
      open: false,
    });
  },

  getStyles() {
    let styles = {
      content: {
        maxWidth: 810,
      },
    };

    return styles;
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
      account,
    } = this.props;

    return {
      type: type,
      ship: ship._id,
      segment: segment._id,
    };
  },

  show() {
    this.setState({
      valid: false,
      open: true,
    });
  },

  dismiss() {
    this.setState({
      open: false,
    });
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      segment,
    } = this.props;
    let loading = this._isLoading();
    let {
      open,
      valid,
    } = this.state;

    let actions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        disabled={loading}
        onTouchTap={this._handleCancelTouchTap}
      />,
      <FlatButton
        key='save'
        label={this.t('nButtonCreateOrder')}
        primary={true}
        disabled={loading || !valid}
        onTouchTap={this._handleCreateTouchTap}
      />,
    ];

    return (
      <Dialog
        ref="dialog"
        actions={actions}
        contentStyle={styles.content}
        modal={loading}
        open={open}
        onShow={this._handleDialogShow}
        title={this.t('nTitleCreateOrder')}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        <OrderTypeForm
          ref="form"
          disabled={loading}
          onChange={this._handleFormChange}
        />
      </Dialog>
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

  _handleDialogShow() {},

  _handleCancelTouchTap() {
    this.dismiss();
  },

  _handleCreateTouchTap() {
    let fn = this.props.createOrder;
    if (_.isFunction(fn)) {
      fn(this.getValue());

      this.setState({
        creating: true
      });
    }
  },
});

module.exports = CreateOrderDialog;
