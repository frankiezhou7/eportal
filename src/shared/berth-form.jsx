const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BerthView = require('~/src/shared/berth-view');
const Dialog = require('epui-md/Dialog');
const DoneIcon = require('epui-md/svg-icons/action/done');
const FlatButton = require('epui-md/FlatButton');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

const BerthForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    berthId: PropTypes.string,
    children: PropTypes.element,
    onRemove: PropTypes.func,
    onRequestCloseTips: PropTypes.func,
    showTips: PropTypes.bool,
    style: PropTypes.object,
    tips: PropTypes.string,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.form.getValue();
  },

  isValid() {
    return this.form.isValid();
  },

  handleConfirm() {
    const { onRequestCloseTips } = this.props;

    if (_.isFunction(onRequestCloseTips)) {
      onRequestCloseTips();
    }
  },

  handleRemove() {
    this.setState({
      open: false,
    }, () => {
      let { onRemove } = this.props;
      let { berthId } = this.state;

      if (_.isFunction(onRemove)) {
        onRemove(berthId);
      }
    });
  },

  handleTouchTapRemove(berthId) {
    this.setState({
      berthId,
      open: true,
    });
  },

  handleTouchTapCancel() {
    this.setState({
      berthId: null,
      open: false,
    });
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
        width: global.contentWidth,
        height: '100%',
        overflow: 'auto',
      },
      button: {
        display: 'table',
        margin: '50px auto',
      },
      floatingAction: {
        position: 'absolute',
        right: '50px',
        top: '120px',
      },
    };

    return styles;
  },

  renderAlertDialog() {
    const {
      showTips,
      tips,
    } = this.props;

    const actions = [
      <FlatButton
        label={this.t('nTextConfirm')}
        secondary
        onTouchTap={this.handleConfirm}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        model
        open={showTips}
      >
        {tips}
      </Dialog>
    );
  },

  renderConfirmDialog() {
    let { open } = this.state;

    let actions = [
      <FlatButton
        key="ok"
        label={this.t('nTextConfirm')}
        secondary
        onTouchTap={this.handleRemove}
      />,
      <FlatButton
        key="cancel"
        label={this.t('nTextClose')}
        secondary
        onTouchTap={this.handleTouchTapCancel}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        model
        open={open}
        title="Delete Berth"
      >
        All related information will be deleted, please do it carefully.
      </Dialog>
    );
  },

  renderRemoveEl(berthId, styles) {
    return (
      <RaisedButton
        ref={(ref) => this.remove = ref}
        backgroundColor="#e44d3c"
        label="Delete The Berth"
        labelColor="#ffffff"
        style={styles.button}
        onTouchTap={this.handleTouchTapRemove.bind(this, berthId)}
      />
    );
  },

  renderView(value) {
    return (
      <BerthView
        ref={(ref) => this.form = ref}
        value={value || {}}
      />
    );
  },

  render() {
    let {
      style,
      value,
    } = this.props;
    let berthId = value && value._id;
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        {this.renderView(value)}
        {this.renderAlertDialog()}
        {this.renderConfirmDialog()}
        {berthId && this.renderRemoveEl(berthId, styles)}
      </div>
    );
  },
});

module.exports = BerthForm;
