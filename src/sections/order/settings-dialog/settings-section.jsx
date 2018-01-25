const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const SettingsSection = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    style: PropTypes.object,
    children: PropTypes.array,
    title: PropTypes.string,
    note: PropTypes.string
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let palette = theme.palette;
    let styles = {
      base: {
        marginTop: 20,
        marginBottom: 20,
      },
      title: {
        fontSize: 16,
        color: '#000' || palette.primary1Color,
      },
      note: {
        color: '#9b9b9b' || palette.greyColor,
        paddingTop: 15,
        fontSize: 14,
        marginBottom: -10,
      }
    };

    styles.base = _.merge(styles.base, this.props.style);

    return styles;
  },

  render() {
    let { title, note } = this.props;

    let elNote = note ? (
      <div style={this.style('note')}>{note}</div>
    ) : null;

    return (
      <div style={this.style('base')}>
        <span style={this.style('title')}>{title}</span>
        {elNote}
        <div style={this.style('body')}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = SettingsSection;
