let React = require('react');
let TextField = require('epui-md/TextField/TextField');
let RaisedButton = require('epui-md/RaisedButton');
let FlatButton = require('epui-md/FlatButton');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let ClearFix = require('epui-md/internal/ClearFix');
let DialogBase = require('./dialog-base');
let ServiceContent = require('./service-content');


let AddServiceDialog = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {

  },

  getDefaultProps() {
    return {

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
      contentStyle: {
        padding: 0,
      },
      footer: {
        button: {
          width: '82px',
        }
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      title,
      showClearIcon,
      ...other
    } = this.props;

    let footerRightNode = (
      <div>
        <FlatButton label='指定代理' secondary={true} style={styles.footer.button} />
        <FlatButton label='完成' secondary={true} style={styles.footer.button} />
      </div>
    );

    let contentNode = (
      <ServiceContent />
    );

    return (
      <DialogBase
       title={title}
       showClearIcon={showClearIcon}
       bodyStyle={{padding:'0'}}
       contentNode={contentNode}
       footerRightNode={footerRightNode} />
    );
  }
});

module.exports = AddServiceDialog;
