const _ = require('eplodash');
const { Map, List, Record } = require('epimmutable');
const utils = require('./utils');
const Base = require('./Base');

class BasePageable extends Base {
  entries = undefined;
  pagination = undefined;
  constructor() {
    super();
  }

  getEntry(entityId) {
    if (!this.entries || !entityId) {
      return;
    }
    return this.entries.find((entry) => {
      return entry._id === entityId || entry.code === entityId;
    });
  }

  count() {
    return this.entries ? this.entries.size : 0;
  }

  hasNext() {
    return this.pagination ? this.pagination.hasNext : false;
  }

  forEach() {
    if (!this.entries) {
      return;
    }
    return this.entries.forEach.apply(this.entries, arguments);
  }

  map() {
    if (!this.entries) {
      return;
    }
    return this.entries.map.apply(this.entries, arguments);
  }

  find() {
    if (!this.entries) {
      return;
    }
    return this.entries.find.apply(this.entries, arguments);
  }

  concat(obj) {
    let Type = this.__proto__.constructor.ENTRY_TYPE;
    return this.withMutations((self) => {
      let newEntries = this.domain.toList(obj.entries, Type);
      let entries = self.entries ? self.entries.concat(newEntries) : newEntries;
      let page = this.domain.toMap(obj.pagination)
      return self.set('entries', entries).set('pagination', page);
    });
  }

  push(obj) {
    let Type = this.__proto__.constructor.ENTRY_TYPE;
    return this.withMutations((self) => {
      let entry = this.domain.toModel(obj, Type);
      let entries = self.entries.push(entry);
      return self.set('entries', entries);
    });
  }

  unshift(obj) {
    let Type = this.__proto__.constructor.ENTRY_TYPE;
    return this.withMutations((self) => {
      let entry = this.domain.toModel(obj, Type);
      let entries = self.entries.unshift(entry);
      return self.set('entries', entries);
    });
  }

  remove(obj) {
    let Type = this.__proto__.constructor.ENTRY_TYPE;
    let idx = this.entries.findIndex((entry) => {
      return (entry._id === obj._id || entry.code === obj.code);
    });
    if (idx < 0) {
      return this;
    }

    return this.withMutations((self) => {
      let entries = self.entries.delete(idx);
      return self.set('entries', entries);
    });
  }

  delete(obj) {
    return this.remove(obj);
  }
}

BasePageable.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }

  let EntryType = this.ENTRY_TYPE;

  obj.entries = this.domain.toList(obj.entries, EntryType);
  obj.pagination = this.domain.toMap(obj.pagination)

  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

BasePageable.ENTRY_TYPE = 'Map';

module.exports = BasePageable;
