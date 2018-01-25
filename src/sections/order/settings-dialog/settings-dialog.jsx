const React = require('react');
const Dialog = require('epui-md/ep/Dialog');
const EmailSettings = require('./email-settings');
const FlatButton = require('epui-md/FlatButton');
const OrderMixin = require('~/src/mixins/order');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;

const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;

const PADDING = 64;
const HEADER_HEIGHT = global.appHeight;
const FOOTER_HEIGHT = 52;

const SettingsDialog = React.createClass({
  mixins: [StylePropable, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  translations: [
    require(`epui-intl/dist/OrderSettings/${__LOCALE__}`),
    require(`epui-intl/dist/Order/${__LOCALE__}`),
  ],

  propTypes: {
    nTitleOrderNotificationSettings: PropTypes.string,
    nTitleOrderSettings: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextCancel: PropTypes.string,
    onCancel: PropTypes.func,
    onDismiss: PropTypes.func,
    onSave: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
    order: PropTypes.object,
    mode: PropTypes.oneOf(_.values(ORDER_MODE)),
  },

  getDefaultProps() {
    return {
      open: false,
    };
  },

  getInitialState: function() {
    return {
      busy: false,
      open: this.props.open,
    };
  },

  componentDidMount() {
    window.addEventListener('resize', this._handleViewPortResize);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleViewPortResize);
  },

  componentWillReceiveProps(nextProps) {
    let busy = this.state.busy;
    let loading = nextProps.order.isLoading();

    if(busy || !loading) {
      this.setState({
        busy: false,
      }, () => {
        this.dismiss();
      });
    }
  },

  componentWillUpdate(nextProps, nextState) {
    nextState.contentMaxHeight = window.innerHeight - PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;
  },

  getStyles() {
    let styles = {
      content: {
        width: '100%',
        minHeight: 420,
        maxHeight: this.state.contentMaxHeight || 360,
      }
    };

    return {
      content: this.mergeAndPrefix(styles.content)
    };
  },

  getValue() {
    let value = this.refs.form.getValue();
    return value;
  },

  clearValue() {
    if(!this.refs.form) { return; }
    this.refs.form.clearValue();
  },

  show() {
    this.setState({
      open: true,
    });
  },

  dismiss() {
    this.setState({
      open: false,
    });
  },

  isOpen() {
    return this.state.open;
  },

  render() {
    let styles = this.getStyles();

    let {
      order,
      mode,
    } = this.props;

    let {
      busy,
      open,
    } = this.state;

    let actions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        disabled={busy}
        onTouchTap={this._handleCancelTouchTap} />,
      <FlatButton
        key='save'
        label={this.t('nTextSave')}
        primary={true}
        disabled={busy}
        onTouchTap={this._handleOkTouchTap} />
    ];

    return (
      <Dialog
        ref="dialog"
        title={this.t('nTitleOrderNotificationSettings')}
        actions={actions}
        modal={busy}
        open={open}
        onDismiss={this._handleDialogDismiss}
        onShow={this._handleDialogShow}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        <div style={styles.content}>
          <EmailSettings
            order={order}
            mode={mode}
            ref='emailing'
            disabled={busy}
          />
        </div>
      </Dialog>
    );
  },

  _handleViewPortResize(e) {
    let dialog = this.refs.dialog;
    if(!dialog || !this.state.open) { return; }

    this.setState({
      contentMaxHeight: e.target.innerHeight - PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT,
    })
  },

  _handleDialogDismiss() {
    if (_.isFunction(this.props.onDismiss)) {
      this.props.onDismiss();
    }
  },

  _handleDialogShow() {
    if(_.isFunction(this.props.onShow)) {
      this.props.onShow();
    }
  },

  _handleCancelTouchTap() {
    this.dismiss();

    if (_.isFunction(this.props.onCancel)) {
      this.props.onCancel();
    }
  },

  _handleOkTouchTap() {
    let order = this.props.order;
    let emailing = this.refs.emailing.getValue();
    if(!emailing) return;
    if(!order.consignee) {
      alert(this.t('nTextShouldAssignConsignee'));
      return;
    };
    let settings = _.merge(emailing);

    this.setState({
      busy: true
    });

    this.props.order.updateNotificationSettings(settings);
  }
});

module.exports = SettingsDialog;
