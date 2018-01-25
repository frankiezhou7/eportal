const React = require('react');
const ShipView = require('./ship-view');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;

const ShipViewContainer = React.createClass({
  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    ship : PropTypes.object.isRequired,
    shipTypes:PropTypes.object,
    shipStatusTypes:PropTypes.object,
    classifications:PropTypes.object,
    organizationRoles:PropTypes.object,
    piClubs:PropTypes.object,
    getPiClubs:PropTypes.func,
    getOrganizationsRoles:PropTypes.func,
    getShipStatusTypes:PropTypes.func,
    getShipTypes:PropTypes.func,
  },

  getDefaultProps() {
    return {
      ship: null,
      shipTypes:null,
      shipStatusTypes:null,
      classifications:null,
      organizationRoles:null,
      piClubs:null,
    };
  },

  getStyles() {
    return {};
  },

  componentWillMount() {
    if(!this.props.piClubs || this.props.piClubs.size ===0){
      this.props.getPiClubs();
    }
    if(!this.props.shipTypes || this.props.shipTypes.size ===0){
      this.props.getShipTypes();
    }
    if(!this.props.shipStatusTypes || this.props.shipStatusTypes.size ===0){
      this.props.getShipStatusTypes();
    }
    if(!this.props.organizationRoles || this.props.organizationRoles.size ===0){
      this.props.getOrganizationsRoles();
    }
  },


  render() {
    let basicTypes ={
      shipTypes: this.props.shipTypes && this.props.shipTypes.toJS(),
      shipStatusTypes: this.props.shipStatusTypes && this.props.shipStatusTypes.toJS(),
      classifications: this.props.classifications && this.props.classifications.toJS(),
      organizationRoles: this.props.organizationRoles && this.props.organizationRoles.toJS(),
      piclubs: this.props.piClubs && this.props.piClubs.toJS(),
    };
    return (
      <ShipView
        basicTypes = {basicTypes}
        ship = { this.props.ship && _.isFunction(this.props.ship.toJS) ? this.props.ship.toJS() : this.props.ship }
      />
    );
  }
});

module.exports = connect(
  (state, props) => {
    return {
      shipTypes: state.get('shipTypes'),
      shipStatusTypes:state.get('shipStatus'),
      classifications:state.get('classifications'),
      organizationRoles:state.get('orgRoles'),
      piClubs:state.get('piClubs'),
      getPiClubs: global.api.epds.getPiClubs,
      getOrganizationsRoles: global.api.epds.getOrgRoleTypes,
      getShipStatusTypes: global.api.epds.getShipStatusTypes,
      getShipTypes: global.api.epds.getShipTypes,
    };
  }
)(ShipViewContainer);
