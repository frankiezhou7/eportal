const React = require('react');
const PropTypes = React.PropTypes;
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const ClearFix = require('epui-md/internal/ClearFix');
const Paper = require('epui-md/Paper');

const CommonForm = React.createClass({

  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    content: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string,
    zDepth: PropTypes.number,
  },
  getStyles(){
    return {
      layout: {
        width: '500px',
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '70px',
        background: 'transparent',
      },
      title: {
        fontWeight: '500',
        marginBottom: '8px',
        textTransform: 'capitalize'
      },
      content: {
        width: '100%',
        height: 'auto'
      }
    }
  },
  renderTitle(title){
    return (
      <h2 style={this.style('title')}>{title}</h2>
    )
  },
  renderContent(content){
    return (
      <div style={this.style('content')}>{content}</div>
    )
  },
  render(){
    return(
      <ClearFix>
        <Paper style={this.style('layout')} zDepth={0}>
          {this.renderTitle(this.props.title)}
          {this.renderContent(this.props.content)}
        </Paper>
      </ClearFix>
    )
  }

});

module.exports = CommonForm;
