const React = require('react');
const ShipFormCompleted = require('~/src/sections/ship/ship-form-completed');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const { connect } = require('react-redux');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const ShipFormCompletedDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    shipId: PropTypes.string,
    user: PropTypes.object,
  },

  getDefaultProps() {
    return {
      shipId: '',
    };
  },

  getInitialState() {
    return {
      ship: {},
      isFetching: this.props.shipId ? true : false,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  componentWillMount() {
    if(this.props.shipId) this.fetchShip();
  },

  componentDidMount() {
    let actions = [
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />,
      <FlatButton
        key="confirm"
        ref={(ref) => this.confirm = ref}
        label= {this.t('nTextSave')}
        secondary
        onTouchTap={this._handleConfirm}
      />,
    ];

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  fetchShip(){
    if(global.api.epds && global.api.epds.findShipById){
        global.api.epds.findShipById.promise(this.props.shipId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              ship: res.response
            },()=>{
              if(this.props.positionDialog) this.props.positionDialog();
            });
          }else{
            //todo: deal with error
          }
        }).catch(err=>{
          //todo: deal with err
        });
    }
  },

  createShip(ship){
    if(global.api.epds && global.api.epds.createShip){
        let user = this.props.user;
        user = user && user.toJS();
        ship.userCreate = user && user._id;
        global.api.epds.createShip.promise(ship).then((res)=>{
          if(res.status === 'OK'){
              alert(this.t('nTextCreateSuccessful'));
              this.props.close();
          }else{
            alert(this.t('nTextCreateFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextCreateFailed'));
          //todo: deal with err
        });
    }
  },

  updateShip(ship){
    if(global.api.epds && global.api.epds.updateShipById){
        global.api.epds.updateShipById.promise(this.props.shipId,ship).then((res)=>{
          if(res.status === 'OK'){
              this.setState({
                ship: res.response
              });
              alert(this.t('nTextUpdateSuccessful'));
          }else{
            alert(this.t('nTextUpdateFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextUpdateFailed')+ ' : '+err);
          //todo: deal with err
        });
    }
  },

  render() {
    return this.state.isFetching ? <Loading /> : (
      <ShipFormCompleted
        ref="form"
        ship={this.state.ship}
        isAdd = {this.props.shipId ? false : true}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleConfirm() {
    this.refs.form.isValid()
      .then((valid)=>{
        if(valid){
          let ship = this.refs.form.getValue();
          if(!this.props.shipId){
            this.createShip(ship);
          }else{
            this.updateShip(ship);
          }
        }else{
          alert(this.t('nTextValidationError'));
        }
      });
  },

});

module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
    };
  }
)(ShipFormCompletedDialog);
