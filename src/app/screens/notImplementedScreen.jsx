const React = require('react');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const NotFoundScreen = React.createClass({
  mixins: [Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {},

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {},

  componentWillUnmount() {},

  componentWillUpdate() {},

  getStyles() {
    return {};
  },

  render() {
    return (
      <h1 style={{ margin: '30px', textAlign: 'center' }}>
        开发中...
      </h1>
    );
  },
});

module.exports = NotFoundScreen;
