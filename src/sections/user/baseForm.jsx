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
        width: '540px',
        height: '590px',
        margin: '100px auto',
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
        width: '460px',
        height: '420px',
        padding: '20px 40px 0 40px',
      },
      footer: {
        width: '460px',
        height: '36px',
        padding: '20px 40px',
      },
    };

    styles.root = _.merge(styles.root, style);
    styles.content = _.merge(styles.content, contentStyle);

    return styles;
  },

  renderTitle(title) {
    let el = (
      <div style={this.style('title')}>
        <p style={this.style('p')}>
          {title}
        </p>
      </div>
    );

    return el;
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
      zDepth,
      ...other,
    } = this.props;

    zDepth = zDepth || 3;

    return (
      <ClearFix>
        <Paper
          {...other}
          style={this.style('root')}
          zDepth={zDepth}
        >
          { this.renderTitle(title) }
          { this.renderContent(content) }
          { !hideFooter && this.renderFooter(footer) }
        </Paper>
      </ClearFix>
    );
  },

});

module.exports = BaseForm;
