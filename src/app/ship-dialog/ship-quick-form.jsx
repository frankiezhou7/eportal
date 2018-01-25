const React = require('react');
const ShipRegister = require('~/src/sections/ship/ship-register');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');
const Dialog = require('epui-md/ep/Dialog/Dialog');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const ShipQuickFormDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    open: PropTypes.bool,
    onCloseDialog: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {
      reposition: false,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    return (
        <Dialog
          ref="dialog"
          title={this.t('nTitleAddShip')}
          maxWidth={global.contentWidth}
          modal={true}
          open={this.props.open}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          repositionOnUpdate={true}
          onRequestClose={this.props.onCloseDialog}
          setZIndex={1499}
          maxHeight={630}
          marginTop={-75}
          showTopClose={true}
          reposition={this.state.reposition}
        >
          <ShipRegister
            ref="form"
            onReposition={this._handleReposition}
          />
      </Dialog>
    );
  },

  _handleReposition(changed) {
    this.setState({reposition: changed})
  },
});

module.exports = ShipQuickFormDialog;
