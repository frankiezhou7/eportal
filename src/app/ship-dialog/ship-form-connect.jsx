const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const ShipForm = require('./ship-form');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');
const { getSubPath } = require('~/src/utils');

const ShipFormConnect = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    getFavoriteShips: PropTypes.func,
    nTextCancel: PropTypes.string,
    nTextCreate: PropTypes.string,
    nTextCreateAndContinue: PropTypes.string,
    nTextSave: PropTypes.string,
    nTitleAddShip: PropTypes.string,
    onRequestClose: PropTypes.func,
    renderActions: PropTypes.func,
    shipId: PropTypes.string,
    ships: PropTypes.object,
    updateShipEssentialInfo: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    let {
      shipId,
    } = this.props;

    if (this.props.renderActions) {
      let actions = shipId ? [
          {
            ref: 'cancel',
            text: this.t('nTextCancel'),
            secondary: true,
            onTouchTap: this._handleTouchTapCancel,
          },
          {
            ref: 'save',
            text: this.t('nTextSave'),
            primary: true,
            onTouchTap: this._handleTouchTapSave,
          },
        ] :
        [
          {
            ref: 'cancel',
            text: this.t('nTextCancel'),
            secondary: true,
            onTouchTap: this._handleTouchTapCancel,
          },
          {
            ref: 'createAndContinue',
            text: this.t('nTextCreateAndContinue'),
            primary: true,
            onTouchTap: this._handleTouchTapCreateAndContinue,
          },
          {
            ref: 'save',
            text: this.t('nTextCreate'),
            primary: true,
            onTouchTap: this._handleTouchTapSave,
          },
        ];

      this.props.renderActions(actions);
    }

    if (this.props.onRequestClose) { this.props.onRequestClose(this._handleRequestClose); }
  },

  getStyles() {
    let styles = {};

    return styles;
  },

  render() {
    let {
      shipId,
      ships,
    } = this.props;

    let entries = ships && ships.toJS();
    let ship = _.find(entries, ['_id', shipId]);

    return (
      <ShipForm
        {...this.props}
        ref={(ref) => this.form = ref}
        loading={this.state.loading}
        ship={ship}
      />
    );
  },

  _handleTouchTapSave() {
    if (this.props.shipId) {
      this._updateShipEssentialInfo();
    } else {
      this._createShip();
    }
  },

  _handleTouchTapCancel() {
    let fn = this.props.close;
    if (_.isFunction(fn)) { fn(); }
  },

  _handleTouchTapCreateAndContinue() {
    this._createShip('createAndContinue');
  },

  _handleRequestClose() {
    return false;
  },

  _createShip(token) {
    let form = this.form;
    let ship = form.getValue();
    let { createShip } = global.api.epds;

    if (ship) {
      if (_.isFunction(createShip)) {
        this.setState({
          loading: true,
          ship: ship,
        }, () => {
          createShip
            .promise(ship, { addFavorite: true })
            .then(res => {
              let response = res.response;
              let id = response && response._id;
              if (id) {
                if (token === 'createAndContinue') {
                  let fn = this.props.getFavoriteShips;
                  if (_.isFunction(fn)) { fn(); }
                  let redirect = getSubPath(`ship/${id}/voyage/`);
                  global.tools.toSubPath(redirect);
                }

                let fn = this.props.getFavoriteShips;
                if (_.isFunction(fn)) { fn(); }

                this.props.close();
              }
            })
            .catch(err => {
              this.setState({
                doing: null,
                loading: false,
              });
            });
        });
      }
    }
  },

  _updateShipEssentialInfo() {
    let {
      close,
      shipId,
      updateShipEssentialInfo,
    } = this.props;
    let form = this.form;

    form
      .isValid()
      .then(valid => {
        if (!valid) { return; }
        let val = form.getValue();

        if (_.isFunction(updateShipEssentialInfo)) {
          updateShipEssentialInfo
            .promise(shipId, val)
            .then(res => {
              let response = res.response;
              let id = response && response._id;
              if (id) {
                const { findShipById } = global.api.epds;
                if (_.isFunction(findShipById)) {
                  findShipById(id);
                }
                const redirect = getSubPath(`ship/${id}/voyage/`);
                global.tools.toSubPath(redirect);
                if (_.isFunction(close)) {
                  close();
                }
              }
            })
            .catch(() => {});
        }
      });
  },
});

let {
  createShip,
  getFavoriteShips,
  updateShipEssentialInfo,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      createShip,
      getFavoriteShips,
      updateShipEssentialInfo,
      ships: state.getIn(['ships', 'list']),
    };
  }
)(ShipFormConnect);
