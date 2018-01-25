const _ = require('eplodash');
const Base = require('./Base');

class FileStorage extends Base {
  _id = null;
  constructor() {
    super();
  }
}
FileStorage.modelName = 'FileStorage';
module.exports = FileStorage;
