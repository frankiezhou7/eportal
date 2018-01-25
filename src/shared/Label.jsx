const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const Label = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    subValueStyle: PropTypes.object,
    value: PropTypes.string,
    subValue: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  isValid() {

  },

  getValue() {

  },

  isChanged() {

  },

  getStyles() {
    let styles = {
      root: {
        fontSize: '14px',
        color: 'rgba(0,0,0,0.54)',
      },
      sub: {
        fontSize: '14px',
        color: '#f5a623',
        marginLeft: '3px',
      },
    };
    styles.root = _.merge(styles.root, this.props.style);
    styles.sub = _.merge(styles.sub, this.props.subValueStyle);
    return styles;
  },

  render() {
    let {
      value,
      subValue,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <div style={styles.root}>
        {value}<span style={styles.sub}>{subValue}</span>
      </div>
    );
  },
});

module.exports = Label;
