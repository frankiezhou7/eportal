const array = [30,42,64,80];
const pics = [];
_.forEach(array,val=>{
  pics[val] = require(`./${val}`);
});
module.exports = pics;
