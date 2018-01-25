const domain = require('epui-domain');

module.exports = domain;

domain.register(require('./models/Account'));
domain.register(require('./models/Accounts'));
domain.register(require('./models/Config'));
domain.register(require('./models/CostItem'));
domain.register(require('./models/CostType'))
domain.register(require('./models/CostTypes'))
domain.register(require('./models/Country'));
domain.register(require('./models/Currencies'));
domain.register(require('./models/Currency'));
domain.register(require('./models/Enum'));
domain.register(require('./models/Event'));
domain.register(require('./models/Events'));
domain.register(require('./models/Favorite'));
domain.register(require('./models/Favorites'));
domain.register(require('./models/Feedback'));
domain.register(require('./models/Feedbacks'));
domain.register(require('./models/InvitationLetterType'));
domain.register(require('./models/InvitationLetterTypes'));
domain.register(require('./models/IssuingAuthorities'));
domain.register(require('./models/IssuingAuthority'));
domain.register(require('./models/OffLandingArticleType'));
domain.register(require('./models/OffLandingArticleTypes'));
domain.register(require('./models/Order'));
domain.register(require('./models/OrderEntry'));
domain.register(require('./models/OrderType'));
domain.register(require('./models/Orders'));
domain.register(require('./models/Organization'));
domain.register(require('./models/PayloadType'));
domain.register(require('./models/PayloadTypes'));
domain.register(require('./models/Port'));
domain.register(require('./models/Ports'));
domain.register(require('./models/Product'));
domain.register(require('./models/ProductConfig'));
domain.register(require('./models/ProductConfigProduct'));
domain.register(require('./models/ProductCostType'));
domain.register(require('./models/Products'));
domain.register(require('./models/PurchaseArticleType'));
domain.register(require('./models/PurchaseArticleTypes'));
domain.register(require('./models/SeaManClass'));
domain.register(require('./models/SeaManClasses'));
domain.register(require('./models/Ship'));
domain.register(require('./models/Ships'));
domain.register(require('./models/Tag'));
domain.register(require('./models/Chat'));
domain.register(require('./models/Chats'));
domain.register(require('./models/User'));
domain.register(require('./models/Users'));
domain.register(require('./models/UserGroup'));
domain.register(require('./models/UserGroups'));
domain.register(require('./models/UserPosition'));
domain.register(require('./models/VoyageSegment'));
domain.register(require('./models/VoyageSegmentSchedule'));
domain.register(require('./models/VoyageSegmentScheduleTimeDescriptor'));
domain.register(require('./models/VoyageSegmentScheduleTimePoints'));
domain.register(require('./models/VoyageSegments'));