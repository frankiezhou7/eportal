const _ = require('eplodash');
const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const IconError = require('epui-md/svg-icons/alert/error');

const PropTypes = React.PropTypes;

const SimpleSection = React.createClass({
  mixins: [AutoStyle],

  propTypes: {
    style: PropTypes.object,
    children: PropTypes.any,
    title: PropTypes.string,
    secondaryHeader: PropTypes.element,
    errorText: PropTypes.string,
  },

  getStyles() {
    return {
      root: _.merge({
        display: 'inline-block',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }, this.props.style),
      header: {
        title: {
          width: '100%',
          height: 48,
          padding: 16,
          fontWeight: 'bold',
          cursor: 'default',
          borderBottom: '1px solid #EAEAEA',
          position: 'relative',
          top: 0,
          background: '#FFFFFF',
          boxSizing: 'border-box',
        },
        secondary: {
          height: 48,
          padding: 16,
          borderBottom: '1px solid #EAEAEA',
          boxSizing: 'border-box',
        }
      },
      content: {
        width: '100%',
        height: 'calc(100% - 100px)',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'absolute',
        top: 100
      },
      error: {
        root: {

        },
        icon: {

        },
        text: {

        }
      }
    }
  },

  renderError() {
    const { errorText } = this.props;
    if(!errorText) { return; }

    return (
      <div style={this.s('error.root')}>
        <IconError style={this.s('error.icon')} />
        <span style={this.s('error.text')}>{errorText}</span>
      </div>
    );
  },

  render() {
    const { title, children, secondaryHeader } = this.props;

    return (
      <div style={this.s('root')}>
        <div style={this.s('header')}>
          <div style={this.s('header.title')}>{title}</div>
          {secondaryHeader}
          {this.renderError()}
        </div>
        <div style={this.s('content')}>
          {children}
        </div>
      </div>
    );
  },
});

module.exports = SimpleSection;
