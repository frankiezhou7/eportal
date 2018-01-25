const _ = require('eplodash');
const Base = require('./Base');

class Enum extends Base {
  type = undefined;
  name = undefined;
  code = undefined;
  value = undefined;
  category = undefined;
  abbreviation = undefined;
  comment = undefined;
  index = undefined;
  constructor() { super(); }
}
Enum.modelName = 'Enum';
module.exports = Enum;
