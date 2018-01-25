const AutoPrefix = require('./auto-prefix');
const ImmutabilityHelper = require('./immutability-helper');

module.exports = {

  mergeAndPrefix() {
    let mergedStyles = ImmutabilityHelper.merge.apply(this, arguments);
    return AutoPrefix.all(mergedStyles);
  },

};
