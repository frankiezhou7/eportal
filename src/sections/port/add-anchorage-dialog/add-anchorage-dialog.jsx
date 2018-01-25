const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const AddAnchorageForm = require('./add-anchorage-form');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;

const AddAnchorageDialog = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/Anchorage/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    anchorage: PropTypes.object,
    createAnchorage: PropTypes.func,
    createAnchorageInMode: PropTypes.func,
    findAnchorageByIdInMode: PropTypes.func,
    nTextSave: PropTypes.string,
    nTextCancel: PropTypes.string,
    updateAnchorageById: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      anchorageId: undefined,
      doing: null,
      portId: undefined,
    };
  },

  componentWillReceiveProps(nextProps, nextState) {
    let baseModes = this.state.baseModes;
    let anchorage = nextProps.anchorage;
    let anchorageIdCreate = nextProps.anchorage.get('create') ? nextProps.anchorage.get('create').get('_id') : undefined;
    let anchorageIdUpdate = nextProps.anchorage.get('update') ? nextProps.anchorage.get('update').get('_id') : undefined;
    let anchorageId = anchorageIdUpdate ? anchorageIdUpdate : anchorageIdCreate;
    let doing = this.state.doing;
    let form = nextProps.form;
    let modes = nextProps.anchorage.get('modes');
    let __v_c = this.props.anchorage.get('update') ? this.props.anchorage.get('update').get('__v') : undefined;
    let __v_u = nextProps.anchorage.get('update') ? nextProps.anchorage.get('update').get('__v') : undefined;

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

    let loading = anchorage.get('create').getMeta('loading') || anchorage.get('update').getMeta('loading');

    if (loading) { return; }

    if (!anchorageId || (anchorageId === this.state.anchorageId && __v_c === __v_u)) {
      return;
    }

    if (doing === 'update' && anchorageIdUpdate) {
      this.dismiss();
      this._handleDialogDismiss(anchorageIdUpdate);
    } else if (doing === 'create' && anchorageIdCreate) {
      this.dismiss();
      this._handleDialogDismiss(anchorageIdCreate);
    }

    this.setState({
      doing: null,
    });
  },

  componentDidMount() {
    // 注册global事件提供dialog打开和关闭方法
    global.showAnchorageDialog = this.show;
    global.dismissAnchorageDialog = this.dismiss;
    global.isOpenAnchorageDialog = this.isOpen;
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

  show(portId, anchorageId, anchorage) {
    if (anchorage) {
      this.setState({
        __id: anchorage.__id,
        anchorage: anchorage,
        modes: this.state.baseModes,
      }, () => {
        this.refs.dialog.show();
      });
      return;
    }

    this.setState({
      __id: null,
      anchorageId: anchorageId,
      anchorage: null,
      portId: portId,
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
    let anchorage = this.state.anchorage;

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
          <AddAnchorageForm
            ref="anchorageForm"
            anchorage={anchorage}
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

  _handleDialogDismiss(anchorageId) {
    let __id = this.state.__id;
    let onDismiss = global.onDismissAnchorageDialog;

    if (_.isFunction(onDismiss)) {
      let anchorage = this.state.value;

      if (anchorageId) {
        anchorage._id = anchorageId;
      } else if (__id) {
        anchorage.__id = __id;
      }

      onDismiss(anchorage);
    }
  },

  _handleDialogShow() {
    if (this.state.anchorageId) {
      this.props.findAnchorageByIdInMode(this.state.anchorageId, 'edit');
    } else {
      let baseModes = this.state.baseModes;
      if (!baseModes) {
        this.props.createAnchorageInMode('edit');
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
    let anchorage = this.refs.anchorageForm.getValue();
    let anchorageId = this.state.anchorageId;
    let portId = this.state.portId;

    if (anchorageId) {
      anchorage._id = anchorageId;
      anchorage.__v = anchorage.__v ? anchorage.__v : 0;

      this.props.updateAnchorageById(this.state.anchorageId, anchorage);
    } else if (portId) {
      delete anchorage._id;
      anchorage.port = this.state.portId;

      this.props.createAnchorage(anchorage);
    }

    this.setState({
      doing: anchorageId ? 'update' : 'create',
      value: anchorage,
    }, () => {
      if (!portId) {
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

module.exports = AddAnchorageDialog;
