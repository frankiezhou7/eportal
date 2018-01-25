const cache = require('~/src/cache');
const domain = require('./domain');
const { Map, fromJS } = require('epimmutable');

module.exports = Map({
  articleType: Map({
    purchaseArticleType: domain.create('List<PurchaseArticleType>', cache.get(cache.PURCHASE_ARTICLE_TYPE)),
    offLandingArticleType: domain.create('List<OffLandingArticleType>', cache.get(cache.OFF_LANDING_ARTICLE_TYPE)),
  }),
  country: Map({
    list: domain.create('List<Country>', cache.get(cache.COUNTRY_LIST)),
    entries: domain.create('Map', cache.get(cache.COUNTRY_ENTRIES))
  }),
  costTypes: domain.create('List<CostType>', cache.get(cache.COST_TYPE_LIST)),
  currency: Map({
    list: domain.create('Currencies', cache.get(cache.CURRENCY_LIST)),
  }),
  device: Map(cache.get('device')),
  enums: Map(domain.create('List<Enum>', cache.get('enums'))),
  invitationLetterTypes: domain.create('List<InvitationLetterType>', cache.get(cache.INVITATION_LETTER_TYPES)),
  issuingAuthorities: domain.create('List<IssuingAuthority>', cache.get(cache.ISSUING_AUTHORITY)),
  lastLogin: Map(cache.get('lastLogin')),
  favorites: domain.create('Favorites'),
  client: fromJS({
    navigation: {
      left: {
        open: false,
        mode: 'navigate'
      },
      right: {
        open: false,
        show: true,
      },
    }
  }),
  payloadType: Map({
    list: domain.create('List<PayloadType>', cache.get(cache.PAYLOAD_TYPE_LIST)),
  }),
  products: null,
  seaManClasses: domain.create('List<SeaManClass>', cache.get(cache.SEAMAN_CLASSES)),
  session: Map(cache.get('session')),
  ships: Map({
    list: domain.create('List<Ship>', null),
  }),
  shipTypes: domain.create('List<Enum>', cache.get(cache.SHIP_TYPES)),
  shipSizes: domain.create('List<Enum>', cache.get(cache.SHIP_SIZES)),
  shipStatus: domain.create('List<Enum>', cache.get(cache.SHIP_STATUS)),
  orgRoles: domain.create('List<Enum>', cache.get(cache.ORG_ROLES)),
  piClubs: domain.create('List<Enum>', cache.get(cache.PI_CLUBS)),
  portTypes: domain.create('List<Enum>', cache.get(cache.PORT_TYPES)),
});
