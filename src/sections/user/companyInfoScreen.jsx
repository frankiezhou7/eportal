const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const PropTypes = React.PropTypes;
const CompanyInformation = require('../account/company-information');
const ScreenMixin = require('~/src/mixins/screen');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;
const EpAppBar = require('~/src/shared/ep-app-bar');
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');
const { connect } = require('react-redux');

require('epui-intl/lib/locales/' + __LOCALE__);

const CompanyInfoScreen = React.createClass({
  mixins: [AutoStyle, Translatable, ScreenMixin],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/AuditCompany/${__LOCALE__}`),
  ],

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    account: PropTypes.object,
  },

  getDefaultProps() {
    return {
      locale: __LOCALE__,
    };
  },

  getInitialState() {
    return {};
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  componentWillMount() {
    let { account }= this.props;
    let isCompleted = _.get(account.toJS(), ['organization', 'type']) === 'ByComplete' || !_.get(account.toJS(), ['organization', 'type']) || account.isOther();
    this.setState({isCompleted});
    if(isCompleted) {
      global.tools.toSubPath('dashboard');
      return;
    }
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextCompleteCompanyInfo'));
  },

  getStyles() {
    let styles = {
      root: {
        backgroundImage: `url('${require('~/src/shared/pic/background.svg')}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50% 100%',
        overflowX: 'hidden',
        height: '100%',
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflowY: 'auto',
      },
      leftNode:{
        position: 'absolute',
        top: 16,
      },
      content: {
        width: '1024px',
        height: '100%',
        margin: 'auto',
      }
    };

    return styles;
  },

  render() {
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;
    return this.state.isCompleted ? null : (
      <div style={this.style('root')}>
        <EpAppBar
          showMenuIconButton={false}
          leftNode={logo}
          leftNodeStyles = {this.style('leftNode')}
        />
        <div style={this.style('content')}>
          <CompanyInformation {...this.props} mode='COMPLETE' style={{padding: '70px 0px 20px'}}/>
        </div>
      </div>
    );
  },
});

const {
  findOrganizationById,
  updateOrganizationById,
  createPerson,
  updatePersonById,
} = global.api.epds;

const {
  updateAccountById,
} = global.api.order;

module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
      account: state.getIn(['session', 'account']),
      findOrganizationById,
      updateOrganizationById,
      createPerson,
      updatePersonById,
      updateAccountById,
    };
  }
)(CompanyInfoScreen);
