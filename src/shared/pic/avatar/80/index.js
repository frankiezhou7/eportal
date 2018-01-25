const array = [1,2,3,4,5];
const pics = [];
_.forEach(array,val=>{
  pics[val] = require(`./${val}.png`);
});
module.exports = pics;
