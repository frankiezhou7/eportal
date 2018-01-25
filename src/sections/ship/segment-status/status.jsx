const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Colors = require('epui-md/styles/colors');

const Status = React.createClass({
  mixins: [AutoStyle],

  propTypes: {
    style: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    position: React.PropTypes.any,
    onClickPosition: React.PropTypes.func
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getTheme() {
    return this.context.muiTheme.voyageStatusBanner;
  },

  getStyles() {

    let palette = this.context.muiTheme.palette;
    let theme = this.getTheme();

    let styles = {
      root: _.merge({
        display: 'inline-block',
        padding: '15px 0px',
        width: '165px',
        height: '42px',
        verticalAlign: 'middle',
        lineHeight: '72px',
      }, this.props.style),
      title: {
        margin: '0 auto',
        color: palette.accent1Color,
        textAlign: 'center',
        fontSize: '20px',
        // fontWeight: 'bold',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
        width: '90%',
        lineHeight: (this.props.position ? '100%' : '42px'),
      },
      position: {
        margin: 0,
        color: '#3F51B5',
        textAlign: 'center',
        fontSize: '12px'
      }
    };

    return styles;
  },

  render() {
    let {
      title,
      position,
      onClickPosition,
      ...other
    } = this.props;

    let titleElement = (
      <p style={this.style('title')}>
        {title}
      </p>
    );

    let posElement = position ? (
      <p
        onTouchTap={onClickPosition}
        style={this.style('position')}
      >
        {position}
      </p>
    ) : null;

    return (
      <div style={this.style('root')}>
        {titleElement}
        {posElement}
      </div>
    );
  },
});

module.exports = Status;
