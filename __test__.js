var context = require.context('./src/__test__/', true, /\.js?$/);
context.keys().forEach(context);
module.exports = context;
