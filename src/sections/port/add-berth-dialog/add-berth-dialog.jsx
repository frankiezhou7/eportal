const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const AddBerthForm = require('./add-berth-form');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;

const AddBerthDialog = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/Berth/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    berth: PropTypes.object,
    createBerth: PropTypes.func,
    createBerthInMode: PropTypes.func,
    findBerthByIdInMode: PropTypes.func,
    nTextSave: PropTypes.string,
    nTextCancel: PropTypes.string,
    nButtonCreateAndContinue: string,
    updateBerthById: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      berthId: undefined,
      doing: null,
      terminalId: undefined,
    };
  },

  componentWillReceiveProps(nextProps, nextState) {
    let baseModes = this.state.baseModes;
    let berth = nextProps.berth;
    let berthIdCreate = nextProps.berth.get('create') ? nextProps.berth.get('create').get('_id') : undefined;
    let berthIdUpdate = nextProps.berth.get('update') ? nextProps.berth.get('update').get('_id') : undefined;
    let berthId = berthIdUpdate ? berthIdUpdate : berthIdCreate;
    let doing = this.state.doing;
    let form = nextProps.form;
    let modes = nextProps.berth.get('modes');
    let __v_c = this.props.berth.get('update') ? this.props.berth.get('update').get('__v') : undefined;
    let __v_u = nextProps.berth.get('update') ? nextProps.berth.get('update').get('__v') : undefined;

    if (form.getMeta('loading')) { return; }

    if (form && !form.isEmpty() && !baseModes) {
      this.setState({
        baseModes: form,
        modes: form,
      });
      return;
    }

    if (doing !== 'create' && doing !== 'update') {
      if (modes.getMeta('loading')) { return; }

      if (modes && !modes.isEmpty()) {
        this.setState({
          modes: modes,
        });
      }
    }

    let loading = berth.get('create').getMeta('loading') || berth.get('update').getMeta('loading');

    if (loading) { return; }

    if (!berthId || (berthId === this.state.berthId && __v_c === __v_u)) {
      return;
    }

    if (doing === 'update' && berthIdUpdate) {
      this.dismiss();
      this._handleDialogDismiss(berthIdUpdate);
    } else if (doing === 'create' && berthIdCreate) {
      this.dismiss();
      this._handleDialogDismiss(berthIdCreate);
    }

    this.setState({
      doing: null,
    });
  },

  componentDidMount() {
    // 注册global事件提供dialog打开和关闭方法
    global.showBerthDialog = this.show;
    global.dismissBerthDialog = this.dismiss;
    global.isOpenBerthDialog = this.isOpen;
  },

  getStyles() {
    let styles = {
      root: {
        height: '600px',
        maxHeight: '600px',
      },
      body: {
        height: '600px',
        maxHeight: '600px',
        overflowY: 'scroll',
      },
      content: {
        width: '1010px',
        height: '600px',
        maxWidth: '1010px',
        maxHeight: '600px',
      },
    };

    return styles;
  },

  dismiss() {
    this.refs.dialog.dismiss();
  },

  isOpen() {
    this.refs.dialog.isOpen();
  },

  show(terminalId, berthId, berth) {
    if (berth) {
      this.setState({
        __id: berth.__id,
        berth: berth,
        modes: this.state.baseModes,
      }, () => {
        this.refs.dialog.show();
      });
      return;
    }

    this.setState({
      __id: null,
      berthId: berthId,
      berth: null,
      terminalId: terminalId,
    }, () => {
      this.refs.dialog.show();
    });
  },

  renderActions(loading) {
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
        label={this.t('nTextSave')}
        primary={true}
        disabled={loading}
        onTouchTap={this._handleSaveTouchTap}
      />,
    ];

    return actions;
  },

  render() {
    let styles = this.getStyles();

    let loading = this._isLoading();
    let berth = this.state.berth;

    let modes = this.state.modes;

    return (
      <Dialog
        ref="dialog"
        actions={this.renderActions(loading)}
        autoDetectWindowHeight={false}
        autoScrollBodyContent={false}
        bodyStyle={this.style('body')}
        contentStyle={this.style('content')}
        modal={loading}
        style={this.style('root')}
        onDismiss={this._handleDismiss}
        onShow={this._handleDialogShow}
      >
          <AddBerthForm
            ref="berthForm"
            berth={berth}
            modes={modes}
          />
      </Dialog>
    );
  },

  _handleCancelTouchTap() {
    this.dismiss();
  },

  _handleDismiss() {
  },

  _handleDialogDismiss(berthId) {
    let __id = this.state.__id;
    let onDismiss = global.onDismissBerthDialog;

    if (_.isFunction(onDismiss)) {
      let berth = this.state.value;

      if (berthId) {
        berth._id = berthId;
      } else if (__id) {
        berth.__id = __id;
      }

      onDismiss(berth);
    }
  },

  _handleDialogShow() {
    if (this.state.berthId) {
      this.props.findBerthByIdInMode(this.state.berthId, 'edit');
    } else {
      let baseModes = this.state.baseModes;
      if (!baseModes) {
        this.props.createBerthInMode('edit');
      } else {
        this.setState({
          modes: baseModes,
        });
      }
    }
  },

  /**
   * 保存按钮事件
   * @return {[type]} [description]
   */
  _handleSaveTouchTap() {
    let berth = this.refs.berthForm.getValue();
    let berthId = this.state.berthId;
    let terminalId = this.state.terminalId;

    if (berthId) {
      berth._id = berthId;
      berth.__v = berth.__v ? berth.__v : 0;

      this.props.updateBerthById(this.state.berthId, berth);
    } else if (terminalId) {
      delete berth._id;
      berth.terminal = this.state.terminalId;

      this.props.createBerth(berth);
    }

    this.setState({
      doing: berthId ? 'update' : 'create',
      value: berth,
    }, () => {
      if (!terminalId) {
        this.dismiss();
        this._handleDialogDismiss();
      }
    });
  },

  _isLoading(props) {
    props = props || this.props;
    if(!props || !props.__loading) { return false; }
    return !!props.__loading;
  },

});

module.exports = AddBerthDialog;
