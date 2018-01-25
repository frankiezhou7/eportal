const React = require('react');
const Dialog = require('epui-md/ep/Dialog/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const ReactElement = require('react/lib/ReactElement');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;

const PADDING = 64;
const HEADER_HEIGHT = global.appHeight;
const FOOTER_HEIGHT = 52;
const DEFAULT = {
  title: null,
  content: null,
  modal: true,
  disabled: false,
  conformDisabled: false,
  autoDismiss: true,
  buttonSecondaryLabel: null,
  buttonConfirmLabel: null,
  buttonCancelLabel: null,
  open: false,
  onTouchTapConfirm: null,
  onTouchTapCancel: null,
  onTouchTapSecondary: null,
};

const DialogConfirm = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/DialogConfirm/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    nButtonConfirm: PropTypes.string,
    nButtonNo: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return DEFAULT;
  },

  componentDidMount() {
    window.addEventListener('resize', this._handleViewPortResize);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleViewPortResize);
  },

  componentWillUpdate(nextProps, nextState) {
    nextState.contentMaxHeight = window.innerHeight - PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  },

  show(opt) {
    opt = _.defaults(opt, DEFAULT);
    opt = _.merge(opt, { open: true });
    this.setState(opt);
  },

  dismiss() {
    this.setState({
      open: false,
    });
  },

  disable() {
    this.setState({
      disabled: true,
      conformDisabled: true,
    });
  },

  enable() {
    this.setState({
      disabled: false,
      conformDisabled: false,
    });
  },

  getStyles() {
    let styles = {
      content: {
        width: '100%',
        maxHeight: this.state.contentMaxHeight || 360,
        overflowY: 'auto',
      }
    };

    return {
      content: this.mergeAndPrefix(styles.content)
    };
  },

  render() {
    let styles = this.getStyles();

    let {
      title,
      content,
      modal,
      buttonSecondaryLabel,
      buttonConfirmLabel,
      buttonCancelLabel,
      disabled,
      conformDisabled,
      autoDismiss,
      onTouchTapSecondary,
      open,
    } = this.state;

    if(!title) { return null; }
    let actions = [];
    actions.push(
      <FlatButton
        key='cancel'
        disabled={disabled}
        label={buttonCancelLabel || this.t('nButtonNo')}
        onTouchTap={this._handleCancel}
      />
    );

    if(buttonSecondaryLabel && onTouchTapSecondary) {
      actions.push(
        <FlatButton
          key='secondary'
          label={buttonSecondaryLabel}
          secondary={true}
          disabled={disabled}
          onTouchTap={this._handleSecondary}
        />
      );
    }

    actions.push(
      <FlatButton
        key='confirm'
        disabled={disabled || conformDisabled}
        label={buttonConfirmLabel || this.t('nButtonConfirm')}
        primary={true}
        onTouchTap={this._handleConfirm}
      />
    );

    if(React.isValidElement(content)) {
      content = new ReactElement.cloneElement(content);
    }

    return (
      <Dialog
        ref="dialog"
        style={{overflow:'auto'}}
        title={title}
        actions={actions}
        modal={modal}
        disabled={disabled}
        onDismiss={this._handleDialogDismiss}
        onShow={this._handleDialogShow}
        open={open}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        <div style={styles.content}>
          {content}
        </div>
      </Dialog>
    );
  },

  _handleViewPortResize(e) {
    this.setState({
      contentMaxHeight: e.target.innerHeight - PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT,
    })
  },

  _handleDialogDismiss() {

  },

  _handleDialogShow() {

  },


  _handleConfirm() {
    if(this.state.autoDismiss) {
      this.setState({
        open: false,
      });
    }

    let fn = this.state.onTouchTapConfirm;
    if(_.isFunction(fn)) { fn(); }
  },

  _handleCancel() {
    if(this.state.autoDismiss) {
      this.setState({
        open: false,
      });
    }

    let fn = this.state.onTouchTapCancel;
    if(_.isFunction(fn)) { fn(); }
  },

  _handleSecondary() {
    if(this.state.autoDismiss) {
      this.setState({
        open: false,
      });
    }

    let fn = this.state.onTouchTapSecondary;
    if(_.isFunction(fn)) { fn(); }
  }

});

module.exports = DialogConfirm;
