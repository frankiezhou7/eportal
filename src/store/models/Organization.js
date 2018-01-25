const _ = require('eplodash');
const Base = require('./Base');

class Organization extends Base {
  __v = undefined;
  _id = undefined;
  name = undefined;
  type = undefined;
  verifyStatus = undefined;
  constructor() { super(); }
}
Organization.modelName = 'Organization';
module.exports = Organization;
