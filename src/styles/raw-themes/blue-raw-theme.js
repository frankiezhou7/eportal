let Colors = require('../colors');
let ColorManipulator = require('epui-md/utils/colorManipulator');
let Spacing = require('../spacing');

module.exports = {
  colors: Colors,
  spacing: Spacing,
  // fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#00599A',
    primary2Color: Colors.blueA400,
    primary3Color: Colors.blue100,
    primary4Color: '#004588',
    accent1Color: '#F5A623',
    accent2Color: Colors.amberA200,
    accent3Color: Colors.ambergulp500,
    accent4Color: '#F9DBAA',
    accent5Color: '#F39800',
    textColor: Colors.darkBlack,
    canvasColor: Colors.white,
    basicColor: '#F0F0F0',
    borderColor: Colors.grey300,
    greyColor: Colors.grey600,
    grey1Color: '#9B9B9B',
    grey2Color: '#E7E7E7',
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    errorColor: Colors.red900,
    warningColor: Colors.yellow900,
    infoColor: Colors.blue500
  },
};
