const React = require('react');
const ShipView = require('~/src/sections/ship/ship-view-container');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const ShipViewDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    renderActions: PropTypes.func,
    close: PropTypes.func,
    positionDialog: PropTypes.func,
    shipId: PropTypes.string,
    show: PropTypes.array,
    verifyFinished: PropTypes.func,
    verifyStatus: PropTypes.number,
  },

  getDefaultProps() {
    return {
      shipId: '',
    };
  },

  getInitialState() {
    return {
      ship: {},
      isFetching:true,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  componentWillMount() {
    this.fetchShip();
  },

  mkCancelButton() {
    return (
      <FlatButton
        key="cancal"
        ref={ ref => this.cancal = ref }
        label= { this.t('nTextClose') }
        secondary
        onTouchTap={ this._handleCancel }
      />
    )
  },

  mkAcceptButton() {
    return (
      <FlatButton
        key="accept"
        ref={ ref => this.confirm = ref }
        label= { this.t('nTextAcceptVerify') }
        secondary
        onTouchTap={ this._handleAcceptVerify }
      />
    )
  },

  mkRefuseButton() {
    return (
      <FlatButton
        key="refused"
        ref={ ref => this.confirm = ref }
        label= { this.t('nTextRefusedVerify') }
        secondary
        onTouchTap={ this._handleRefusedVerify }
      />
    )
  },

  /**
   * type could be: 0(unverified), 1(verified), 2(refused)
   */
  mkActions(type) {
    switch (type) {
    case 0:
      return [ this.mkCancelButton(), this.mkAcceptButton(), this.mkRefuseButton() ]
    case 1:
      return [ this.mkCancelButton() ]
    case 2:
      return [ this.mkCancelButton(), this.mkAcceptButton() ]
    default:
      throw new Error(`"mkActions" invalid type: ${type}`)
    }
  },

  componentDidMount() {
    let { renderActions } = this.props;
    if (_.isFunction(renderActions))
      renderActions(this.mkActions(this.props.verifyStatus))
  },

  _handleCancel() {
    let { close } = this.props
    if (_.isFunction(close))
      close()
  },

  checkStatus(response) {
    if (response.status !== 'OK')
      throw new Error(`invalid res.status value: ${response.status}`)
    else
      return response
  },

  fetchShip(){
    if (!(global.api.epds && global.api.epds.findShipById)) {
      console.error('global.api.epds.findShipById is undefined')
      return
    }

    global.api.epds.findShipById
    .promise(this.props.shipId)
    .then(this.checkStatus)
    .then(res => {
      this.setState({ isFetching: false, ship: res.response }, () => {
        if (this.props.positionDialog)
          this.props.positionDialog()
      })
    })
    .catch(err => {
      alert(this.t('nTextIinitFailed') + err)
    })
  },

  _handleAcceptVerify() {
    if (!(global.api.epds && global.api.epds.updateVerifyStatus)) {
      console.error('global.api.epds.updateVerifyStatus is undefined')
      return
    }

    global.api.epds.updateVerifyStatus
    .promise(this.props.shipId, 1)
    .then(this.checkStatus)
    .then(res => {
      alert(this.t('nTextRequestSuccessful'))
      this.props.close()
      this.props.verifyFinished()
    })
    .catch(err => {
      alert(this.t('nTextRequestFailed'))
    })
  },

  _handleRefusedVerify() {
    if (!(global.api.epds && global.api.epds.updateVerifyStatus)) {
      console.error('global.api.epds.createShip is undefined')
      return
    }

    global.api.epds.updateVerifyStatus
    .promise(this.props.shipId, 2)
    .then(this.checkStatus)
    .then(res => {
      alert(this.t('nTextRequestSuccessful'))
      this.props.close()
      this.props.verifyFinished()
    })
    .catch(err => {
      alert(this.t('nTextRequestFailed'))
    })
  },

  render() {
    if (!this.state.isFetching)
      return <ShipView ref="form" ship={this.state.ship} />
    else
      return <Loading />
  },

});

module.exports = ShipViewDialog
