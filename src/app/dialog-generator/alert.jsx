const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const _ = require('eplodash');

const Alert = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/DialogGenerator/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    close: PropTypes.func,
    confirmLabel : PropTypes.string,
    nButtonOk: PropTypes.string,
    onConfirm: PropTypes.func,
    renderActions: PropTypes.func,
  },

  getDefaultProps() {
    return {
      confirmLabel: ''
    };
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    let {
      confirmLabel,
      renderActions,
    } = this.props;

    let actions = [{
      ref: 'confirm',
      text: this.props.confirmLabel || this.t('nButtonOk'),
      onTouchTap: this._handleTouchTap,
    }];

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  dismiss() {
    let fn = this.props.close;

    if (_.isFunction(fn)) {
      fn();
    }
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    return(
      <div style={this.style('root')}>
        {this.props.children}
      </div>
    );
  },

  _handleTouchTap() {
    let {
      close,
      onConfirm,
    } = this.props;

    if (_.isFunction(close)) {
      close();
    }

    if (_.isFunction(onConfirm)) {
      onConfirm();
    }
  },
});

module.exports = Alert;
