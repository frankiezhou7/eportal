module.exports = {
  componentName() {
    return this.__proto__.constructor.displayName;
  }
}
