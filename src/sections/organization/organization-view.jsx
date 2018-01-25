const React = require('react');
const Divider = require('epui-md/Divider');
const Paper = require('epui-md/Paper');
const Tags = require('epui-md/ep/Tags');
const OrganizationSummary = require('epui-md/ep/organization/OrganizationSummary');
const OrganizationRole = require('epui-md/ep/organization/OrganizationRole');
const Advantage = require('epui-md/ep/organization/Advantage');
const Certificate = require('epui-md/ep/organization/Certificate');
const MainPort = require('epui-md/ep/organization/MainPort');
const ContactUs = require('epui-md/ep/organization/ContactUs');
const { displayWithLimit } = require('epui-md/utils/methods');
const { FILES_URL } = require('~/src/gateway-urls');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const Organization = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    organization : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      organization: {},
    };
  },

  componentWillMount() {

  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      header:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
      },
      headerLeft:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: theme.epColor.primaryColor,
      },
      title:{
        fontSize: 24,
        fontWeight: 500,
        marginLeft: 18,
      },
      left:{
        maxWidth: '100%',
        marginRight: 20,
        width: '100%',
      },
      wraper:{
        marginTop: 21,
        paddingLeft: padding,
        paddingRight: padding,
      },
      divider:{
        marginTop: padding,
        marginLeft: -padding,
        marginRight: -padding,
        marginBottom: padding,
      },
    };
    return styles;
  },

  render() {
    const { organization } = this.props;
    const rootStyle = this.style('root');
    const leftStyle = this.style('left');
    const headerStyle = this.style('header');
    const titleStyle = this.style('title');
    const headerLeftStyle = this.style('headerLeft');
    const wrapperStyle = this.style('wraper');
    const dividerStyle = this.style('divider');

    return (
      <div style = {rootStyle}>
        <div style = {leftStyle}>
          <div style = {headerStyle} >
            <div style = {headerLeftStyle}>
              <span style = {titleStyle}>{organization.name}</span>
            </div>
            <Tags codes = {organization.roles}/>
          </div>
          <Paper style = {wrapperStyle}>
            <OrganizationSummary summary = {_.pick(organization,'description','address','contactMethods',)}/>
            <Divider style = {dividerStyle} />
            <Advantage advantages={organization.advantages} />
            <Divider style = {dividerStyle} />
            <Certificate
              certificates={organization.certificates}
              fileUrl = {FILES_URL}
            />
            <Divider style = {dividerStyle} />
            {/*<OrganizationRole orgRoles={organization.roles} />*/}
            {/*<Divider style = {dividerStyle} />*/}
            <MainPort mainPort={organization.ports}/>
            <Divider style = {dividerStyle} />
            <ContactUs infos = {_.pick(organization,'contactMethods','children','address', 'children')} />
          </Paper>
        </div>
      </div>
    );
  }
});

module.exports = Organization;
