let React = require('react');
let Router = require('react-router');
let TextField = require('epui-md/TextField/TextField');
let RaisedButton = require('epui-md/RaisedButton');
let FlatButton = require('epui-md/FlatButton');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let ClearFix = require('epui-md/internal/ClearFix');
let SwapVert = require('epui-md/svg-icons/action/swap-vert');


let AssignAgentItemService = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    svgIcon: React.PropTypes.element,
    serviceName: React.PropTypes.string,
    iconStyle: React.PropTypes.object,
    nameStyle: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      backgroundColor: Colors.indigo500,
      serviceName: '更换船员',
    };
  },

  getInitialState() {
    return {

    };
  },

  componentDidMount() {

  },

  getStyles() {
    let props = this.props;

    let styles = {
      root: {
        display: 'inline-block',
        width: '88px',
        height: '94px',
        overflow: 'hidden',
      },
      icon: {
        margin: '5px auto 7px auto',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: props.backgroundColor,
      },
      name: {
        textAlign: 'center',
        fontSize: '12px',
      },
      innerIconStyle: {
        width: '48px',
        height: '48px',
        fill: Colors.white,
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      svgIcon,
      serviceName,
      iconStyle,
      nameStyle,
      ...other
    } = this.props;

    svgIcon = svgIcon ? svgIcon : (
      <SwapVert style={styles.innerIconStyle} />
    );

    return (
      <div style={styles.root}>
        <div style={this.mergeAndPrefix(styles.icon, iconStyle)}>{svgIcon}</div>
        <div style={this.mergeAndPrefix(styles.name, nameStyle)}>{serviceName}</div>
      </div>
    );
  }
});

module.exports = AssignAgentItemService;
