const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const AddOrganizationForm = require('./add-orgnization-form');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;

const AddOrgnizationDialog = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Organization/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    nTitleAddOrganization: PropTypes.string,
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
      doing: null
    };
  },

  componentWillReceiveProps(nextProps) {
    let doing = this.state.doing;
    let loading = this._isLoading(nextProps);

    if(!doing || loading) { return; }

    if(doing === 'ok') {
      this.dismiss();
    }

    this.setState({
      doing: null
    });
  },

  getStyles() {
    return {
      content: {}
    };
  },

  clearValue() {
    if(!this.refs.form) { return; }
    this.refs.form.clearValue();
  },

  show() {
    this.refs.dialog.show();
  },

  dismiss() {
    this.refs.dialog.dismiss();
  },

  isOpen() {
    return this.refs.dialog.isOpen();
  },

  render() {
    let styles = this.getStyles();

    let {
      ship
    } = this.props;

    let loading = this._isLoading();

    let actions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        disabled={loading}
        onTouchTap={this._handleCancelTouchTap} />,
      <FlatButton
        key='ok'
        label={this.t('nButtonOk')}
        primary={true}
        disabled={loading}
        onTouchTap={this._handleOkTouchTap} />
    ];

    return (
      <Dialog
        ref="dialog"
        title={this.t('nTitleAddOrganization')}
        actions={actions}
        contentStyle={styles.content}
        modal={loading}
        onDismiss={this._handleDialogDismiss}
        onShow={this._handleDialogShow}
        open={this.props.open}>
        <AddOrganizationForm
          ref='form'
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
    if(_.isFunction(this.props.onOK)) {
      let value = this.getValue();

      this.props.onOK(value);
    }

    this.dismiss();
  }
});

module.exports = AddOrgnizationDialog;
