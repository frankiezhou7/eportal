const _ = require('eplodash');
const warning = console.warn || console.log;

module.exports = function(model, status) {
  _.forEach(status, (val, key) => {
    let name = _.upperFirst(_.camelCase(key));

    model[`is${name}`] = function() {
      return this.status === val;
    };

    if(_.isNumber(val)) {
      model[`beyond${name}`] = function() {
        return this.status > val;
      };
      model[`within${name}`] = function() {
        return this.status < val;
      };
    }

    model[`set${name}`] = function(partial) {
      if(!_.isFunction(this.setStatus)) {
        warning(`${model.__name} should implement setStatus method`);
        return;
      }

      if(_.isFunction(this.canSetStatus) && !this.canSetStatus(val)) {
        //TODO: throw a error
        return;
      }

      this.setStatus(val, partial);
    };

    model.STATUS = status;
  });
};
