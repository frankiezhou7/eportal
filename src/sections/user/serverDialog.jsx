const React = require('react');
const _ = require('eplodash');
const Dialog = require('epui-md/ep/Dialog');
const ServiceContent = require('./serviceContentNew');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;

const ServerDialog = React.createClass({
  mixins: [AutoStyle],
  contextTypes: {
    muiTheme: PropTypes.object,
  },
  propTypes: {
    onCloseDialog: PropTypes.func,
    serverDialogShow: PropTypes.bool
  },
  getStyles() {
    let styles = {
      root: {},
      closeBtn:{
        position: 'absolute',
        top: 10,
        right: 10,
        width: 18,
        height: 18,
        fill:'#4d4d4d',
        cursor: 'pointer',
        zIndex: 2000,
      }
    }
    return styles;
  },
  render(){
    let styles = this.getStyles();
    return(
      <div>
        <Dialog
          ref="dialog"
          maxWidth={550}
          modal={true}
          open={this.props.serverDialogShow}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          repositionOnUpdate={true}
          setZIndex={1001}
          maxHeight={650}
          marginTop={-70}
        >
        <CloseButton style={styles.closeBtn} onClick={this._handleCloseDialog} />
        <ServiceContent />
        </Dialog>
      </div>
    )
  },
  _handleCloseDialog(){
    let { onCloseDialog } = this.props;
    if (_.isFunction(onCloseDialog)) { onCloseDialog(); }
  },
})

module.exports = ServerDialog
