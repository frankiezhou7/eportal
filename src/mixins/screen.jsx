module.exports = {
  setPageTitle: function(title) {
    title = title ? title + ' - ' : '';
    document.title = title + this.t('nTitleGlobalPostfix');
  }
}
