const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const Snackbar = require('epui-md/Snackbar');
const PropTypes = React.PropTypes;

const InfoStack = React.createClass({
  mixins: [StylePropable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    open: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      open: false,
    };
  },

  getInitialState: function() {
    return {
      message: null,
      open: this.props.open,
    };
  },

  componentDidMount() {
    global.pushInfo = this.show;
    global.dismissInfo = this.dismiss;
  },

  show(message, duration) {
    this.setState({
      duration: duration || 5000,
      message: message,
      open: true,
    });
  },

  dismiss() {
    this.setState({
      open: false,
    });
  },

  getStyles() {
    return {};
  },

  render() {
    let styles = this.getStyles();

    return (
      <Snackbar
        ref='Snackbar'
        autoHideDuration={this.state.duration}
        message={this.state.message || '(empty)'}
        open={this.state.open}
      />
    );
  }
});

module.exports = InfoStack;
