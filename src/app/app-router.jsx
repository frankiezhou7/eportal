const React = require('react');
const { syncHistoryWithStore } = require('react-router-redux');
const { Provider } = require('react-redux');
const AsyncLoader = require('./async-loader');
const { getSubPath } = global.tools;

const store = require('~/src/store');

const {
  Router,
  Route,
  Redirect,
  IndexRoute,
  IndexRedirect
} = require('react-router');

const history = syncHistoryWithStore(global.tools.history, store, {
  selectLocationState: (store) => (store.get && store.get('routing') || store.routing)
});

if(DEBUG) {
  history.listen(location => debug('地址栏变更', location));
}

const Master = require('./master');

/**
 * 基础页面
 */
const NotFoundScreen = require('promise?global!~/src/app/screens/notFoundScreen');
const NotImplementedScreen = require('promise?global!~/src/app/screens/notImplementedScreen');

/**
 * 首面板
 */
const DashboardScreen = require('promise?global!~/src/app/dashboard/');

/**
 * 用户界面
 */
const LoginScreen = require('promise?global!~/src/sections/user/loginScreen');
const RegScreen = require('promise?global!~/src/sections/user/regScreen');
const CompanyInfoScreen = require('promise?global!~/src/sections/user/companyInfoScreen');
const RegisterScreen = require('promise?global!~/src/sections/user/registerScreen');
const RetrievePasswordScreen = require('promise?global!~/src/sections/user/retrievePasswordScreen');
const ResetPasswordScreen = require('promise?global!~/src/sections/user/resetPasswordScreen');
const StatusScreen = require('promise?global!~/src/sections/user/statusScreen');
const SetPassword = require('promise?global!~/src/sections/user/setPassword');


/**
 * 账户管理界面
 */

 const AccountScreen = require('promise?global!~/src/sections/account/screen');
 const AccountUserProfile = require('promise?global!~/src/sections/account/user-profile');
 const AccountManagement = require('promise?global!~/src/sections/account/account-management');
 const AccountChangePassword = require('promise?global!~/src/sections/user/changePasswordForm');
 const AccountCompanyInfo = require('promise?global!~/src/sections/account/company-information');

/**
 * 消息提醒界面
 */

const NotificationScreen = require('promise?global!~/src/sections/notification/view');

/**
 * 帮助界面
 */
const FAQScreen = require('promise?global!~/src/shared/frequently-asked-questions/faq-screen');

/**
 * 船舶页
 */
const ShipScreen = require('promise?global!~/src/sections/ship/ship-screen');
const ShipVoyage = require('promise?global!~/src/sections/ship/ship-voyage');
const ShipRecord = require('promise?global!~/src/sections/ship/ship-record');
const ShipView = require('promise?global!~/src/sections/ship/ship-view-container');
const ExchangeView = require('promise?global!~/src/sections/order/exchange-rate-view');
const ShipRegister = require('promise?global!~/src/sections/ship/ship-register');
/**
 * 港口页
 */
const PortScreen = require('promise?global!~/src/sections/port/port-screen');
const PortView = require('promise?global!~/src/sections/port/port-view');

/**
 * 系统管理
 */
const ManageScreen = require('promise?global!~/src/sections/manage/screen');
const PanelManageAccRules = require('promise?global!~/src/sections/manage/acc-rules');
const PanelManageAccRoles = require('promise?global!~/src/sections/manage/acc-roles');
const ShipDataPanel = require('promise?global!~/src/sections/manage/ship');
const PortDataPanel = require('promise?global!~/src/sections/manage/port-data');
const OrganizationDataPanel = require('promise?global!~/src/sections/manage/organization-data');
const NewsDataPanel = require('promise?global!~/src/sections/manage/news-data');
const RegulationDataPanel = require('promise?global!~/src/sections/manage/regulation-data');
const HomepageDataPanel = require('promise?global!~/src/sections/manage/homepage-data');
const NewsConfigDataPanel = require('promise?global!~/src/sections/manage/news-config-data');
const RecommendationsPanel = require('promise?global!~/src/sections/manage/recommendations');
const AuditCompanyPanel = require('promise?global!~/src/sections/manage/auditCompany');
const SettingsPanel = require('promise?global!~/src/sections/manage/settings');
const ReportPanel = require('promise?global!~/src/sections/manage/report');

/**
 * 临时开发页面
 */
const DevPanel = require('promise?global!~/src/dev/panel');
const DemoPanel = require('promise?global!~/src/dev/demo');
// Hanping
const DuesPanel = require('promise?global!~/src/dev/tables/dues');
const LineUpPanel = require('promise?global!~/src/dev/tables/line-up');
const ShipFormPanel = require('promise?global!~/src/dev/ship-form');

// zwi：
// const MngmtUserPanel = require('promise?global!~/src/dev/management-user/');

debug(`网址前缀：${getSubPath('/')}`);

module.exports = (
  <Provider store={store}>
    <Router history={history}>
      <Route path={getSubPath('login')} getComponent={AsyncLoader(LoginScreen)} />
      <Route path={getSubPath('reg')} getComponent={AsyncLoader(RegScreen)} />
      <Route path={getSubPath('register')} getComponent={AsyncLoader(RegisterScreen)} />
      <Route path={getSubPath('reset')} getComponent={AsyncLoader(ResetPasswordScreen)} />
      <Route path={getSubPath('retrieve')} getComponent={AsyncLoader(RetrievePasswordScreen)} />
      <Route path={getSubPath('status')} getComponent={AsyncLoader(StatusScreen)} />
      <Route path={getSubPath('setPassword')} getComponent={AsyncLoader(SetPassword)} />

      <Route path={getSubPath('/')} component={Master}>
        <IndexRedirect to='dashboard' />
        <Route path='complete-company-information' getComponent={AsyncLoader(CompanyInfoScreen)} />
        <Route path='dashboard' getComponent={AsyncLoader(DashboardScreen)}>
          <Route path='quickOrder' getComponent={AsyncLoader(DashboardScreen)} />
        </Route>
        <Route path='notification' getComponent={AsyncLoader(NotificationScreen)} />
        <Route path='account' getComponent={AsyncLoader(AccountScreen)}>
        <IndexRedirect to='user-profile' />
          <Route path='user-profile' getComponent={AsyncLoader(AccountUserProfile)} />
          <Route path='account-management' getComponent={AsyncLoader(AccountManagement)} />
          <Route path='company-information' getComponent={AsyncLoader(AccountCompanyInfo)} />
          <Route path='change-password' getComponent={AsyncLoader(AccountChangePassword)} />
        </Route>
        <Route path='ship' >
          <IndexRedirect to='notfound' />
          { /*<Route path='register' getComponent={AsyncLoader(ShipRegister)} />*/}
          <Route path=':shipId' getComponent={AsyncLoader(ShipScreen)} >
            <IndexRedirect to='voyage' />
            <Route path='voyage(/:voyageId)(/:orderId)(/:orderEntryId)(/:page)' getComponent={AsyncLoader(ShipVoyage)} />
            <Route path='record(/:voyageId)' getComponent={AsyncLoader(ShipRecord)} />
            <Route path='particulars' getComponent={AsyncLoader(ShipView)} />
            <Route path='exchange' getComponent={AsyncLoader(ExchangeView)} />
            <Route path='notfound' getComponent={AsyncLoader(NotFoundScreen)} />
          </Route>
        </Route>
        <Route path='port'>
          <Route path=':portId' getComponent={AsyncLoader(PortScreen)} >
            <IndexRedirect to='info' />
            <Route path='info' getComponent={AsyncLoader(PortView)} />
          </Route>
        </Route>
        <Route path='manage' getComponent={AsyncLoader(ManageScreen)}>
          <IndexRedirect to='ships' />
          <Route path='ships' getComponent={AsyncLoader(ShipDataPanel)} />
          <Route path='ports' getComponent={AsyncLoader(PortDataPanel)} />
          <Route path='orgs' getComponent={AsyncLoader(OrganizationDataPanel)} />
          <Route path='report' getComponent={AsyncLoader(ReportPanel)} />
          <Route path='news' getComponent={AsyncLoader(NewsDataPanel)} />
          <Route path='homepage' getComponent={AsyncLoader(HomepageDataPanel)} />
          <Route path='newsConfig' getComponent={AsyncLoader(NewsConfigDataPanel)} />
          <Route path='regulations' getComponent={AsyncLoader(RegulationDataPanel)} />
          <Route path='recommendations' getComponent={AsyncLoader(RecommendationsPanel)} />
          <Route path='auditCompany' getComponent={AsyncLoader(AuditCompanyPanel)} />
          <Route path='users' getComponent={AsyncLoader(NotImplementedScreen)} />
          <Route path='acc-rules' getComponent={AsyncLoader(PanelManageAccRules)} />
          <Route path='acc-roles' getComponent={AsyncLoader(PanelManageAccRoles)} />
          <Route path='settings' getComponent={AsyncLoader(SettingsPanel)} />
        </Route>
        <Route path='user'>
          <Route path='reset-password' getComponent={AsyncLoader(ResetPasswordScreen)} />
        </Route>

        <Route path='dev'>
          <Route path='line-up' getComponent={AsyncLoader(LineUpPanel)} />
          <Route path='dues' getComponent={AsyncLoader(DuesPanel)} />
        </Route>
        <Route path='faq' getComponent={AsyncLoader(FAQScreen)} />
        <Route path='*' getComponent={AsyncLoader(NotFoundScreen)} />
        <Route path='404' getComponent={AsyncLoader(NotFoundScreen)} />
      </Route>

    </Router>
  </Provider>
);
