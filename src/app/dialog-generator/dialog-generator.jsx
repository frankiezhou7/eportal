const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/ep/Dialog/Dialog');
const Pool = require('./pool');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DialogGenerator = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ErrorText/${__LOCALE__}`),

  propTypes: {
    nTextInternalError: PropTypes.string,
    nTextVersionConflictError: PropTypes.string,
    nTextRefresh: PropTypes.string,
  },

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  getInitialState() {
    return {
      zIndex: 1000,
      children: [],
    };
  },

  componentDidMount() {
    // register global dialog generator
    _.set(global, ['register', 'dialog', 'generate'], this.generate);
    // register global alert event
    _.set(global, 'alert', this._bindAlert2Global);
    // register global error alert event
    _.set(global, ['register', 'errorAlert'], this._bindErrorAlert2Global);
    // register global confirm event
    _.set(global, 'epConfirm', this._bindConfirm2Global);
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  generate(props, component, newZIndex) {
    let ref = this._generateRef();
    let { children, zIndex } = this.state;
    let newProps = _.isObject(props) ? props : {};
    zIndex = zIndex + 1;

    if(newZIndex){
      _.set(newProps, ['style', 'zIndex'], newZIndex);
    }else {
      _.set(newProps, ['style', 'zIndex'], zIndex);
    }

    // set overlay style
    if (children.length) {
      _.set(newProps, 'overlayStyle', {
        // backgroundColor: 'transparent',
      });
    }

    let child = {
      ref: ref,
      props: newProps,
      component: component,
    };

    children.push(child);

    this.setState({
      children,
      increase: true,
      zIndex,
    });
  },

  renderChildren() {
    let { children, increase } = this.state;
    let elements = [];
    let length = children.length;
    let top = children[length - 1];

    children.forEach((child, index) => {
      let ref = child.ref;
      let shouldComponentUpdate = ref === top.ref && increase;
      let props = child.props;
      let component = child.component;
      let componentName = component.name;
      let componentProps = component.props;
      let el = React.createElement(Pool[componentName], componentProps);
      let width = null;
      if(componentName === 'Alert') width = 900;
      elements.push(
        <Dialog
          {...props}
          ref={ref}
          key={ref}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          repositionOnUpdate={true}
          onRequestClose={this._handleRequestClose.bind(null, ref)}
          shouldComponentUpdate={shouldComponentUpdate}
          maxWidth={width ? width : 1005}
        >
          {el}
        </Dialog>
      );
    });

    return elements;
  },

  render() {
    return (
      <div
        ref='root'
        style={this.style('root')}
      >
        {this.renderChildren()}
      </div>
    );
  },

  _handleRequestClose(ref, buttonClicked) {
    let children = this.state.children;
    let top = children[children.length - 1];

    if (ref === top.ref) {
      let props = top.props;
      let fn = props ? props.onRequestClose : null;

      if (_.isFunction(fn)) {
        let res = fn();
        if (res) {
          this._handleClose(top.ref);
        }
      } else {
        this._handleClose(top.ref);
      }
    }
  },

  _handleClose(ref) {
    let children = this.state.children;

    _.remove(children, (child) => {
      if (child.ref === ref) {
        let props = child.props;
        let fn = props.onRequestClose;

        if (_.isFunction(fn)) {
          fn();
        }
      }

      return child.ref === ref;
    });

    this.setState({
      children,
      increase: false,
    });
  },

  _bindAlert2Global(content, title, onConfirm) {
    let props = {
      title: title,
      open: true,
      modal: true,
    };
    let component = {
      name: 'Alert',
      props: {
        children: content,
        onConfirm: onConfirm,
      },
    };

    this._generateDialog(props, component, 1500);
  },

  _bindErrorAlert2Global(err) {
    let status = err && err.status;
    let errorCode = err && err.code;
    let errorAction = err && err.action;
    // show different error message by status or error code
    switch (status) {
      case 500:
        let content = this.t('nTextInternalError');
        this._generateDialogWithContent(content);
        break;
      case 400:
        switch (errorCode) {
          case 'DOCUMENT_VERSION_CONFLICT':
            let confirmLabel = this.t('nTextRefresh');
            let content = this.t('nTextVersionConflictError');
            this._generateDialogWithContent(content, confirmLabel, this._refreshOrder);
            break;
        }
        break;
    }
  },

  _bindConfirm2Global(content, title, onConfirm, onCancel) {
    let props = {
      title: title,
      open: true,
      model: true,
    };
    let component = {
      name: 'Confirm',
      props: {
        children: content,
        onConfirm: onConfirm,
        onCancel: onCancel,
      },
    };
    this._generateDialog(props, component);
  },

  _generateDialog(props, component, zIndex) {
    let globalDialog = global.register.dialog;
    if (globalDialog) { globalDialog.generate(props, component, zIndex); }
  },

  _generateDialogWithContent(content, confirmLabel, confirmFn) {
    let props = {
      title: '',
      open: true,
      modal: true
    };
    let component = {
      name: 'Alert',
      props: {
        children: content,
        confirmLabel: confirmLabel,
        onConfirm: confirmFn
      }
    };
    this._generateDialog(props, component);
  },

  _generateRef() {
    this.__ref = this.__ref ? ++this.__ref : 1;

    return `dialog-${this.__ref}`;
  },

  _refreshOrder() {
    if (global.currentOrder) {
      global.currentOrder.refresh();
    } else if (global.currentProductConfig) {
      global.currentProductConfig.refresh();
    }
  },
});

module.exports = DialogGenerator;
