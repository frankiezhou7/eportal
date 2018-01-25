const React = require('react');
const AssignAccountForm = require('./assign-account-form');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/ep/Dialog/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const TYPES = require('~/src/shared/constants').ACCOUNT_TYPE;

const AssignAccountDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Account/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    ship: PropTypes.object,
    type: PropTypes.oneOf(_.values(TYPES)),
    nTitleAssignConsigner: PropTypes.string,
    nTitleAssignConsignee: PropTypes.string,
    nButtonOk: PropTypes.string,
    nTextCancel: PropTypes.string,
    onCancel: PropTypes.func,
    onDismiss: PropTypes.func,
    onOK: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      open: false,
    };
  },

  getInitialState: function() {
    return {
      doing: null,
      open: this.props.open,
    };
  },

  componentWillReceiveProps(nextProps) {
    let doing = this.state.doing;
    let loading = this._isLoading(nextProps);

    if(!doing || loading) { return; }

    if(doing === 'ok') {
      this.setState({
        open: false,
      });
    }

    this.setState({
      doing: null
    });
  },

  getStyles() {
    return {
      content: {},
    };
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
    let { ship, type } = this.props;
    let loading = this._isLoading();

    let actions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        disabled={loading}
        onTouchTap={this._handleCancelTouchTap}
      />,
      <FlatButton
        key='ok'
        label={this.t('nButtonOk')}
        primary={true}
        disabled={loading}
        onTouchTap={this._handleOkTouchTap}
      />
    ];

    return (
      <Dialog
        ref="dialog"
        style={{overflow:'auto'}}
        title={type === TYPES.CONSIGNER ? this.t('nTitleAssignConsigner') : this.t('nTitleAssignConsignee')}
        actions={actions}
        contentStyle={styles.content}
        modal={loading}
        onRequestClose={this._handleDialogRequestClose}
        onShow={this._handleDialogShow}
        open={this.state.open}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        <AssignAccountForm
          ref='form'
          type={type}
          disabled={loading}
          ship={this.props.ship}
        />
      </Dialog>
    );
  },

  _isLoading(props) {
    //TODO: 判断loading值
    return false;
  },

  getValue() {
    let value = this.refs.form.getValue();
    return value;
  },

  _handleDialogRequestClose() {
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
    if(_.isFunction(this.props.onOK)) {
      let value = this.getValue();

      this.props.onOK(value);
    }

    this.dismiss();
  },
});

module.exports = AssignAccountDialog;
