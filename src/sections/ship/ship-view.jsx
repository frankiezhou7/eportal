const React = require('react');
const Divider = require('epui-md/Divider');
const Paper = require('epui-md/Paper');
const ShipManagement = require('epui-md/ep/ship/ShipManagement');
const GeneralInformation = require('epui-md/ep/ship/GeneralInformation');
const BeamHeightDepth = require('epui-md/ep/ship/BeamHeightDepth');
const LoadWaterLines = require('epui-md/ep/ship/LoadWaterLines');
const Hold = require('epui-md/ep/ship/Hold');
const MainEngine = require('epui-md/ep/ship/MainEngine');
const DisplacementTPC = require('epui-md/ep/ship/DisplacementTPC');
const SpeedPropeller = require('epui-md/ep/ship/SpeedPropeller');
const LOA = require('epui-md/ep/ship/LOA');
const Tonnage = require('epui-md/ep/ship/Tonnage');
const Crane = require('epui-md/ep/ship/Crane');
const ContactInfo = require('epui-md/ep/ship/ContactInfo');
const { getNameByCode } = require('epui-md/utils/methods');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const _ = require('eplodash');

const PropTypes = React.PropTypes;

const ShipView = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/ShipForm/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
    basicTypes: PropTypes.object,
    nLabelImo : PropTypes.string,
    ship : PropTypes.object.isRequired,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      nLabelImo: 'IMO : ',
      basicTypes: {},
      ship: {}
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const shipTheme = theme.ship;
    const ship = this.props.ship;
    const statusColor = ship.status ? shipTheme.statusColor[ship.status] : theme.epColor.primaryColor;
    const padding = 24;
    let styles = {
      root:{
        width: '100%',
        maxWidth: global.contentWidth,
        margin: 'auto',
      },
      header:{
        marginTop: 20,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      headerLeft:{
        color: theme.epColor.primaryColor,
      },
      title:{
        display: 'block',
        fontSize: 24,
        fontWeight: 500,
        color: theme.epColor.primaryColor,
      },
      subTitle:{
        marginTop: 10,
        display: 'block',
        fontSize: 18,
        fontWeight: 400,
        color: theme.epColor.fontColor,
      },
      left:{
        minWidth: 900,
        width: '100%',
      },
      right:{
        marginTop: 10,
        width: 336,
      },
      wraper:{
        marginTop: 21,
        padding: padding,
        paddingTop: 40,
      },
      branch:{
        marginTop: 20,
      },
      name:{
        fontSize: 16,
        fontWeight: 500,
        color:theme.epColor.primaryColor,
      },
      content:{
      },
      summaryCard:{
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
      },
      tag:{
        marginLeft: 165,
        color: 'white',
        backgroundColor: shipTheme.typeColor,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 500,
        fontSize: 16,
        borderRadius: 2,
      },
      status:{
        marginLeft: 33,
        color: 'white',
        backgroundColor: statusColor,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 500,
        fontSize: 16,
        borderRadius: 2,
      },
      divider:{
        marginTop: padding,
        marginLeft: -padding,
        marginRight: -padding,
        marginBottom: padding,
      },
      specialDivider:{
        marginTop: 0,
        marginLeft: -padding,
        marginRight: -padding,
        marginBottom: padding,
      }
    };
    return styles;
  },

  render() {
    const ship = this.props.ship;
    const basicTypes = this.props.basicTypes;
    const shipTypes = basicTypes && basicTypes.shipTypes;
    const shipStatusTypes = basicTypes && basicTypes.shipStatusTypes;
    const classifications = basicTypes && basicTypes.classifications;
    const organizationRoles = basicTypes && basicTypes.organizationRoles;
    const piclubs = basicTypes && basicTypes.piclubs;

    //prepare Styles
    const rootStyle = this.style('root');
    const leftStyle = this.style('left');
    const headerStyle = this.style('header');
    const titleStyle = this.style('title');
    const subTitleStyle = this.style('subTitle');
    const branchStyle = this.style('branch');
    const nameStyle = this.style('name');
    const contentStyle = this.style('content');
    const headerLeftStyle = this.style('headerLeft');
    const statusStyle = this.style('status');
    const tagStyle = this.style('tag');
    const wraperStyle = this.style('wraper');
    const dividerStyle = this.style('divider');
    const specialDividerStyle = this.style('specialDivider');

    const shipTypeElem = ship.type ? (
      <span style = {tagStyle}>{getNameByCode(shipTypes,ship.type).toUpperCase()}</span>
    ): null;

    const shipStatusElem = ship.status ? (
      <span style = {statusStyle}>{getNameByCode(shipStatusTypes,ship.status).toUpperCase()}</span>
    ): null;

    return (
      <div style = {rootStyle}>
        <div style = {leftStyle}>
          <div style = {headerStyle} >
            <div style = {headerLeftStyle}>
              <div style = {titleStyle}>{ship.name}</div>
              <div style = {subTitleStyle}>{this.props.nLabelImo + ship.imo}</div>
            </div>
            {shipTypeElem}
            {shipStatusElem}
          </div>
          <Paper style = {wraperStyle}>
            <ShipManagement
              managements = {ship.managements}
              organizationRoles = {organizationRoles}
            />
          <Divider style = {dividerStyle} />
            <GeneralInformation ship = {_.pick(ship,'contactMethods','nationality','portOfRegistry','officialNo','piClub','classNotation')}
              classifications = {classifications}
              piclubs = {piclubs}
            />
          <Divider style = {dividerStyle} />
            <BeamHeightDepth ship = {_.pick(ship,'depth','height','breadth')}/>
            <Divider style = {specialDividerStyle} />
            <LOA shipLength = {ship.length}/>
            <Divider style = {dividerStyle} />
            <Tonnage ship = {_.pick(ship,'grt','nrt')}/>
            <Divider style = {dividerStyle} />
            <LoadWaterLines loadLines = {ship.loadLines}/>
            <Divider style = {dividerStyle} />
            <DisplacementTPC ship = {_.pick(ship,'tpc','displacement')}/>
            <Divider style = {dividerStyle} />
            <MainEngine ship = {_.pick(ship,'mainEngine','auxEngines')}/>
            <Divider style = {dividerStyle} />
            <SpeedPropeller ship = {_.pick(ship,'speed','propeller')}/>
            <Divider style = {dividerStyle} />
            <Hold holds = {ship.holds}/>
            <Divider style = {dividerStyle} />
            <Crane crane = {ship.crane}/>
            <Divider style = {dividerStyle} />
            <ContactInfo contactMethods = {ship.contactMethods}/>
          </Paper>
        </div>
      </div>
    );
  }
});

module.exports = ShipView;
