const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translation = require('epui-intl').mixin;
const PropTypes = React.PropTypes;


const RecordContainer = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: require(`epui-intl/dist/SegmentDetails/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    title : PropTypes.string,
    children: PropTypes.element,
  },

  getDefaultProps() {
    return {
      title: '',
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      title:{
        height: 39,
        backgroundColor: '#E8E8E8',
        fontSize: 15,
        color: '#4A4A4A',
        paddingLeft: 24,
        lineHeight: 3,
        textAlign: 'left',
      },
      child:{

      },
    };

    return styles;
  },

  render() {
    return (
      <div style={this.style('root')}>
        <div style = {this.style('title')}>{this.props.title}</div>
        <div style = {this.style('child')}>{this.props.children}</div>
      </div>
    );
  },

});

module.exports = RecordContainer;
