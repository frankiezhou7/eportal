const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const ClearFix = require('epui-md/internal/ClearFix');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;

const BaseForm = React.createClass({

  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    content: PropTypes.object,
    contentStyle: PropTypes.object,
    footer: PropTypes.object,
    hideFooter: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string,
    zDepth: PropTypes.number,
  },

  getStyles() {
    let {
      contentStyle,
      style,
    } = this.props;
    let styles = {
      root: {
        width: '765px',
        height: '396px',
        backgroundColor: 'fbfbfb',
      },
      title: {
        width: '100%',
        height: '73px',
        backgroundColor: '#004588',
      },
      p: {
        display: 'inline-block',
        margin: '26px 40px',
        fontSize: '26px',
        fontWeight: '800',
        color: '#ffffff',
      },
      content: {
        width: '100%',
        height: '450px',
        marginTop: 10,
      },
      footer: {
        width: '765px',
        height: '36px',
        position: 'relative',
        top: '150px',
      },
    };

    styles.root = _.merge(styles.root, style);
    styles.content = _.merge(styles.content, contentStyle);

    return styles;
  },

  renderContent(content) {
    let el = (
      <div style={this.style('content')}>
        {content}
      </div>
    );

    return el;
  },

  renderFooter(footer) {
    let el = (
      <div style={this.style('footer')}>
        {footer}
      </div>
    );

    return el;
  },

  render() {
    let {
      content,
      footer,
      hideFooter,
      style,
      title,
      ...other,
    } = this.props;

    return (
      <div
        style={this.style('root')}
      >
        { this.renderContent(content) }
      </div>
    );
  },

});

module.exports = BaseForm;
