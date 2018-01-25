const Initial = require('~/src/store/initial');
const articleTypeReducer = require('./articleType');
const costTypeReducer = require('./costType');
const countryReducer = require('./country');
const currencyReducer = require('./currency');
const dashboardReducer = require('./dashboard');
const eventReducer = require('./event');
const favoriteReducer = require('./favorite');
const feedbackReducer = require('./feedback');
const invitationLetterTypeReducer = require('./invitationLetterType');
const issuingAuthorityReducer = require('./issuingAuthority');
const localReducer = require('./local');
const orderReducer = require('./order');
const payloadTypeReducer = require('./payloadType');
const productReducer = require('./product');
const routerReducer = require('./router');
const searchReducer = require('./search');
const segmentReducer = require('./segment');
const semanClassReducer = require('./seaman-class');
const sessionReducer = require('./session');
const shipReducer = require('./ship');
const shipTypeReducer = require('./shipType');
const shipSizeReducer = require('./shipSize');
const shipStatusReducer = require('./shipStatus');
const orgRoleReducer = require('./orgRole');
const piClubReducer = require('./piClub');
const portTypeReducer = require('./portType');
const clientReducer = require('./client');
const userGroupReducer = require('./userGroup');
const usersReducer = require('./users');
const chatReducer = require('./chat');
const { INITIALIZE } = require('~/src/store/actions/initial');

module.exports = function AppReducer(state, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case INITIALIZE: {
      return state.withMutations(s => {
        s.set('articleType', Initial.get('articleType'));
        s.set('client', Initial.get('client'));
        s.set('costTypes', Initial.get('costTypes'));
        s.set('country', Initial.get('country'));
        s.set('currency', Initial.get('currency'));
        s.set('favorites', Initial.get('favorites'));
        s.set('invitationLetterTypes', Initial.get('invitationLetterTypes'))
        s.set('issuingAuthorities', Initial.get('issuingAuthorities'))
        s.set('lastLogin', Initial.get('lastLogin'));
        s.set('orgRoles', Initial.get('orgRoles'));
        s.set('payloadType', Initial.get('payloadType'));
        s.set('piClubs', Initial.get('piClubs'));
        s.set('portTypes', Initial.get('portTypes'));
        s.set('routing', routerReducer(s.get('routing'), action));
        s.set('seaManClasses', Initial.get('seaManClasses'));
        s.set('session', Initial.get('session'));
        s.set('shipSizes', Initial.get('shipSizes'));
        s.set('shipStatus', Initial.get('shipStatus'));
        s.set('shipTypes', Initial.get('shipTypes'));
        s.set('ships', Initial.get('ships'));
      });
    }
    default: {
      return state.withMutations(s => {
        s.set('articleType', articleTypeReducer(s.get('articleType'), action));
        s.set('client', clientReducer(s.get('client'), action));
        s.set('costTypes', costTypeReducer(s.get('costTypes'), action));
        s.set('country', countryReducer(s.get('country'), action));
        s.set('currency', currencyReducer(s.get('currency'), action));
        s.set('dashboard', dashboardReducer(s.get('dashboard'), action));
        s.set('event', eventReducer(s.get('event'), action));
        s.set('favorites', favoriteReducer(s.get('favorites'), action));
        s.set('invitationLetterTypes', invitationLetterTypeReducer(s.get('invitationLetterTypes'), action))
        s.set('issuingAuthorities', issuingAuthorityReducer(s.get('issuingAuthorities'), action))
        s.set('lastLogin', localReducer(s.get('lastLogin'), action));
        s.set('orders', orderReducer(s.get('orders'), action));
        s.set('orgRoles', orgRoleReducer(s.get('orgRoles'), action));
        s.set('payloadType', payloadTypeReducer(s.get('payloadType'), action));
        s.set('piClubs', piClubReducer(s.get('piClubs'), action));
        s.set('portTypes', portTypeReducer(s.get('portTypes'), action));
        s.set('product', productReducer(s.get('product'), action));
        s.set('routing', routerReducer(s.get('routing'), action));
        s.set('seaManClasses', semanClassReducer(s.get('seaManClasses'), action));
        s.set('search', searchReducer(s.get('search'), action));
        s.set('session', sessionReducer(s.get('session'), action));
        s.set('shipSizes', shipSizeReducer(s.get('shipSizes'), action));
        s.set('shipStatus', shipStatusReducer(s.get('shipStatus'), action));
        s.set('shipTypes', shipTypeReducer(s.get('shipTypes'), action));
        s.set('ships', shipReducer(s.get('ships'), action));
        s.set('voyageSegments', segmentReducer(s.get('voyageSegments'), action));
        s.set('feedbacks', feedbackReducer(s.get('feedbacks'), action));
        s.set('userGroups', userGroupReducer(s.get('userGroups'), action));
        s.set('users', usersReducer(s.get('users'), action));
        s.set('chats', chatReducer(s.get('chats'), action));
      });
    }
  }
}
