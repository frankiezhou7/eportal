const _ = require('eplodash');
const Base = require('./Base');


class Organizations extends alt.BasePageable {
  constructor() { super(); }
}
Organizations.modelName = 'Organizations';
Organizations.ENTRY_TYPE = 'Organization';

module.exports = Organizations;
