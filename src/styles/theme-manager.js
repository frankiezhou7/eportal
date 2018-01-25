const _ = require('eplodash');
const BaseMuiTheme = require('epui-md/styles/getMuiTheme');
const Colors = require('./colors');
const ColorManipulator = require('./color-manipulator');
const update = require('react-addons-update');

module.exports = {

  //get the MUI theme corresponding to a raw theme
  getMuiTheme: function (rawTheme) {
    let muiTheme = BaseMuiTheme(rawTheme);
    const {
      spacing,
      fontFamily,
      palette,
    } = muiTheme;

    let returnObj = {
      colors:Colors,
      tagColor:{
        defaultColor:'#004588',
        ORGA:'#e86f05',
        ORCA:'#e86f05',
        OROW:'#e86f05',
        ORCH:'#e86f05',
        ORSP:'#48ab3e',
        ORSR:'#727272',
        ORIN:'#20b0d6',
        ORWS:'#4a90e2',
        ORSM:'#8b572a',
        ORSH:'#004588',
        ORRC:'#e86f05',
        ORSO:'#f5a623',
        ORCT:'#48ab3e',
        PORT: '#004588',
      },
      epColor:{
        portColor: '#004588',
        shipColor: '#48ab3e',
        newsColor: '#8b572a',
        ownerColor: '#e86f05',
        sproColor: '#e86f05',
        shipperColor: '#e86f05',
        receiverColor: '#e86f05',
        chartererColor: '#e86f05',
        managementColor: '#e86f05',
        inspectionColor: '#20b0d6',
        sproColor: '#727272',
        workshopColor: '#ec8755',
        companyColor: '#e86f05',
        primaryColor: '#004588',
        clickedColor: Colors.pink900,
        whiteColor: '#FFFFFF',
        fontColor: '#4a4a4a',
        gridColor: '#858585',
        blackColor: '#000000',
        blueLabelColor: '#4a90e2',
        orangeColor: '#f5a623',
      },
      ship:{
        statusColor:{
          SSLC: '#4a90e2',
          SSIS: '#48ab3e',
          SSUC: '#8b572a',
          SSOS: '#e44d3c',
          SSUM: '#a363dc',
          SSKL: '#e86f05',
          SSCM: '#f5a623',
          SSAB: '#9b9b9b',
        },
        typeColor: '#20b0d6',
      },
      helpIcon:{
        color:'#f1b654',
      },
      appBar: {
        color: palette.primary4Color,
        textColor: Colors.darkWhite,
        height: spacing.desktopKeylineIncrement,
      },
      avatar: {
        borderColor: 'rgba(0, 0, 0, 0.08)',
      },
      button: {
        height: 36,
        minWidth: 88,
        iconButtonSize: spacing.iconSize * 2,
      },
      checkbox: {
        boxColor: palette.textColor,
        checkedColor: palette.primary1Color,
        requiredColor: palette.primary1Color,
        disabledColor: palette.disabledColor,
        labelColor: palette.textColor,
        labelDisabledColor: palette.disabledColor,
      },
      datePicker: {
        color: palette.primary4Color,
        textColor: Colors.white,
        calendarTextColor: palette.textColor,
        selectColor: palette.primary4Color,
        selectTextColor: Colors.white,
      },
      dropDownMenu: {
        accentColor: palette.borderColor,
      },
      flatButton: {
        color: palette.canvasColor,
        textColor: palette.textColor,
        primaryTextColor: palette.accent1Color,
        secondaryTextColor: palette.primary1Color,
      },
      floatingActionButton: {
        buttonSize: 56,
        miniSize: 30,
        color: palette.accent1Color,
        iconColor: Colors.white,
        secondaryColor: palette.primary1Color,
        secondaryIconColor: Colors.white,
        disabledTextColor: palette.disabledColor,
      },
      inkBar: {
        backgroundColor: palette.accent1Color,
      },
      leftNav: {
        header: {
          height: 196,
          padding: 8,
          marginLeft: 5,
          marginTop: 5,
        },
        margin: 5,
        transiWidth: 104,
        width: spacing.desktopKeylineIncrement * 4,
        color: Colors.white,
        primaryColor: palette.primary1Color,
        activeColor: palette.accent2Color,
        disActiveColor: Colors.white,
        activeTextColor: palette.primary2Color,
        accentColor: palette.greyColor,
        lightBorder: Colors.grey500,
        refreshIndicator: {
          size: 32,
        },
        logo: {
          height: 134,
          paddingTop: 5,
          paddingBottom:10,
        },
        logoImage: {
          height: 100,
        },
        searchBox: {
           backgroundColor: '#9BD2FF',
           height: 24,
           marginRight : 5,
           borderRadius: 2,
        },
        searchInput: {
          width: 120,
          fontSize: 15,
        },
        listItem: {
          starBorderColor : palette.primary1Color,
          innerDiv: {
            paddingTop : 5,
            paddingBottom: 5,
          },
          primaryTextColor: Colors.darkBlack,
        }
      },
      segmentList: {
        color: Colors.white,
        arrivalNameColor: palette.primary2Color,
        arrivalCodeColor: palette.greyColor,
        inactiveColor: Colors.white,
        activeColor: palette.accent4Color,
        hoverColor: ColorManipulator.lighten(palette.accent4Color, 0.1),
        inactiveEdgeColor: palette.greyColor,
        brokenEdgeColor: ColorManipulator.lighten(Colors.black, 0.6),
        activeEdgeColor: palette.accent5Color,
        secondaryPortColor: Colors.grey200,
      },
      listItem: {
        nestedLevelDepth: 18,
      },
      menu: {
        backgroundColor: Colors.white,
        containerBackgroundColor: Colors.white,
      },
      menuItem: {
        dataHeight: 32,
        height: 48,
        hoverColor: 'rgba(0, 0, 0, .035)',
        padding: spacing.desktopGutter,
        selectedTextColor: palette.accent1Color,
      },
      menuSubheader: {
        padding: spacing.desktopGutter,
        borderColor: palette.borderColor,
        textColor: palette.primary1Color,
      },
      paper: {
        backgroundColor: Colors.white,
      },
      radioButton: {
        borderColor:  palette.textColor,
        backgroundColor: Colors.white,
        checkedColor: palette.primary1Color,
        requiredColor: palette.primary1Color,
        disabledColor: palette.disabledColor,
        size: 24,
        labelColor: palette.textColor,
        labelDisabledColor: palette.disabledColor,
      },
      raisedButton: {
        color: Colors.white,
        textColor: palette.textColor,
        primaryColor: palette.accent1Color,
        primaryTextColor: Colors.white,
        secondaryColor: palette.primary1Color,
        secondaryTextColor: Colors.white,
      },
      refreshIndicator: {
        strokeColor: Colors.grey300,
        loadingStrokeColor: palette.primary1Color,
      },
      slider: {
        trackSize: 2,
        trackColor: Colors.minBlack,
        trackColorSelected: Colors.grey500,
        handleSize: 12,
        handleSizeDisabled: 8,
        handleSizeActive: 18,
        handleColorZero: Colors.grey400,
        handleFillColor: Colors.white,
        selectionColor: palette.primary3Color,
        rippleColor: palette.primary1Color,
      },
      snackbar: {
        textColor: Colors.white,
        backgroundColor: '#323232',
        actionColor: palette.accent1Color,
      },
      table: {
        backgroundColor: Colors.white,
      },
      tableHeader: {
        borderColor: palette.borderColor,
      },
      tableHeaderColumn: {
        textColor: Colors.lightBlack,
        height: 56,
        spacing: 24,
      },
      tableFooter: {
        borderColor: palette.borderColor,
        textColor: Colors.lightBlack,
      },
      tableRow: {
        hoverColor: Colors.grey200,
        stripeColor: ColorManipulator.lighten(palette.primary1Color, 0.55),
        selectedColor: Colors.grey300,
        textColor: Colors.darkBlack,
        borderColor: palette.borderColor,
      },
      tableRowColumn: {
        height: 48,
        spacing: 24,
      },
      timePicker: {
        color: Colors.white,
        textColor: Colors.primary4Color,
        accentColor: palette.primary1Color,
        clockColor: Colors.black,
        selectColor: palette.primary4Color,
        selectTextColor: Colors.white,
      },
      toggle: {
        thumbOnColor: palette.primary1Color,
        thumbOffColor: Colors.grey50,
        thumbDisabledColor: Colors.grey400,
        thumbRequiredColor: palette.primary1Color,
        trackOnColor: ColorManipulator.fade(palette.primary1Color, 0.5),
        trackOffColor: Colors.minBlack,
        trackDisabledColor: Colors.faintBlack,
        labelColor: palette.textColor,
        labelDisabledColor: palette.disabledColor,
      },
      toggleButton: {
        height: 36,
        minWidth: 88,
        color: Colors.white,
        textColor: palette.textColor,
        toggledBackgroundColor: palette.primary1Color,
        toggledLabelColor: Colors.white,
        disabledColor: palette.disabledColor,
      },
      toolbar: {
        backgroundColor: ColorManipulator.darken('#eeeeee', 0.05),
        height: 56,
        titleFontSize: 20,
        iconColor: 'rgba(0, 0, 0, .40)',
        separatorColor: 'rgba(0, 0, 0, .175)',
        menuHoverColor: 'rgba(0, 0, 0, .10)',
      },
      tabs: {
        backgroundColor: palette.primary1Color,
      },
      textField: {
        textColor: palette.textColor,
        hintColor: palette.disabledColor,
        floatingLabelColor: palette.textColor,
        disabledTextColor: palette.disabledColor,
        errorColor: Colors.red500,
        focusColor: palette.primary1Color,
        backgroundColor: 'transparent',
        borderColor: palette.borderColor,
      },
      statusBar:{
        titleColor: '#004588',
        textArrivalColor:'#00599A',
        textEstArrivalColor:'#989898',
      },
      voyageStatusBanner: {
        textColor: '#FFFFFF',
        disabledTextColor: '#989898',
        primaryColor: '#2196f3',
        secondaryColor: '#000000',
        statusColors: {
          '9999': '#FAFAFA',
          '300': Colors.amberA200,
          '700': Colors.lightGreen500,
          '1000': Colors.lightGreen700,
          '1500': '#FAFAFA',
          '3000': Colors.deepOrange500,
          '0': '#FAFAFA'
        }
      },
    };

    //add properties to objects inside 'returnObj' that depend on existing properties
    returnObj.flatButton.disabledTextColor = ColorManipulator.fade(returnObj.flatButton.textColor, 0.3);
    returnObj.raisedButton.disabledColor = ColorManipulator.darken(returnObj.raisedButton.color, 0.1);
    returnObj.raisedButton.disabledTextColor = ColorManipulator.fade(returnObj.raisedButton.textColor, 0.3);
    returnObj.toggleButton.disabledTextColor = ColorManipulator.fade(returnObj.toggleButton.textColor, 0.3);
    returnObj.toggle.trackRequiredColor = ColorManipulator.fade(returnObj.toggle.thumbRequiredColor, 0.5);

    //append the raw theme object to 'returnObj'
    returnObj.rawTheme = rawTheme;

    //append palette spacing etc. object to 'returnObj'
    returnObj.colors = Colors;
    returnObj.palette = palette;
    returnObj.spacing = spacing;
    returnObj.contentFontFamily = rawTheme.fontFamily;

    //set 'static' key as true (by default) on return object. This is to support the ContextPure mixin.
    returnObj.static = true;

    _.merge(muiTheme, returnObj);

    return muiTheme;
  },

};
