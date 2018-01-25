const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BerthServiceAbility = require('epui-md/ep/BerthServiceAbility');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const CheckboxIcePort = require('~/src/shared/checkbox-ice-port');
const ContactInfo = require('~/src/shared/contact-info');
const DoneIcon = require('epui-md/svg-icons/action/done');
const DropDownAirports = require('~/src/shared/dropdown-airports');
const DropDownPortTypes = require('~/src/shared/dropdown-port-types');
const RawDropDownCountries = require('~/src/shared/dropdown-countries');
const Validatable = require('epui-md/HOC/Validatable/Validatable');
const DropDownCountries = Validatable(RawDropDownCountries);
const DropDownTimeZone = require('epui-md/ep/DropDownTimeZone/DropDownTimeZone');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const MainCargos = require('~/src/shared/main-cargos');
const PilotStations = require('~/src/shared/pilot-stations');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const TextFieldLocation = require('~/src/shared/text-field-location');
const TextFieldPortCode = require('~/src/shared/text-field-port-code');
const TextFieldPortName = require('~/src/shared/text-field-port-name');
const TextFieldDescription = require('~/src/shared/text-field-description');
const TextFieldSeaMapCode = require('~/src/shared/text-field-sea-map-code');
const ThemeManager = require('~/src/styles/theme-manager');
const Tides = require('~/src/shared/tides');
const Tugs = require('~/src/shared/tugs');
const Translatable = require('epui-intl').mixin;
const { ComposedForm, use, createComponentPool } = require('epui-composer');

const pool = createComponentPool(
  BerthServiceAbility,
  CheckboxIcePort,
  ContactInfo,
  DropDownAirports,
  DropDownPortTypes,
  DropDownCountries,
  DropDownTimeZone,
  MainCargos,
  PilotStations,
  TextFieldLocation,
  TextFieldPortCode,
  TextFieldPortName,
  TextFieldSeaMapCode,
  TextFieldDescription,
  Tides,
  Tugs,
);

require('epui-intl/lib/locales/' + __LOCALE__);

const defs = [{
  component: 'Section',
  props: {},
  children: [{
    component: 'TextFieldPortName',
    name: 'name',
    props: {
      required: true,
      style: {
        marginRight: '10px',
        float: 'left',
      },
      defaultValue: '#name',
    },
  }, {
    component: 'TextFieldPortCode',
    name: 'code',
    props: {
      required: true,
      disabled: '#_id',
      style: {
        marginRight: '10px',
        float: 'left',
      },
      maxLength: '5',
      defaultValue: '#code',
    },
  }, {
      component: 'DropDownCountries',
      name: 'country',
      props: {
        required: true,
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#country',
      },
  }],
}, {
  component: 'Section',
  name: '',
  props: {},
  children: [{
    component: 'TextFieldLocation',
    name: 'location',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      defaultValue: '#region',
    }
  }, {
      component: 'TextFieldSeaMapCode',
      name: 'seaMapCode',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        defaultValue: '#seaMapCode.BA',
        floatingLabelText:'@nTextSeaMapCodeBA',
      },
  }, {
      component: 'TextFieldSeaMapCode',
      name: 'baSeaMapCode',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        defaultValue: '#seaMapCode.local',
      },
  }, {
    component: 'DropDownTimeZone',
    name: 'timeZone',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      value: '#timeZone',
    },
  }, {
    component: 'DropDownPortTypes',
    name: 'portType',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      value: '#type',
    },
  },{
    component: 'CheckboxIcePort',
    name: 'icePort',
    props: {
      style: {
        marginRight: '10px',
        marginBottom: '15px',
        float: 'left',
        width: '110px',
      },
      value: '#icePort',
    },
  }],
}, {
  component: 'Section',
  name: '',
  props: {
    style: {
      marginBottom: '20px',
    },
  },
  children: [{
    component: 'DropDownAirports',
    name: 'internationalAirport',
    props: {
      floatingLabelText: '@nTextInternationalAirport',
      style: {
        marginRight: '10px',
        width: '256px',
      },
      width : 350,
      value: '#internationalAirport',
    },
  }, {
    component: 'DropDownAirports',
    name: 'domesticAirport',
    props: {
      floatingLabelText: '@nTextDomesticAirport',
      style: {
        marginRight: '10px',
        width: '256px',
      },
      width : 350,
      value: '#domesticAirport',
    },
  }],
}, {
    component: 'Section',
    props: {
      title: 'Description',
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'TextFieldDescription',
      name: 'description',
      props: {
        style: {
          marginTop: '15px',
        },
        defaultValue: '#description',
      },
    }],
  }, {
    component: 'Section',
    props: {
      title: 'Function',
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'BerthServiceAbility',
      name: 'ability',
      props: {
        mode: 'port',
        style: {
          marginTop: '15px',
        },
        value: '#abilities',
      },
    }],
  }, {
    component: 'Section',
    name: '',
    props: {
      title: 'Main Cargo',
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'MainCargos',
      name: 'payloadTypes',
      props: {
        value: '#payloadTypes',
      },
    }],
  }, {
    component: 'Section',
    name: 'tides',
    props: {
      title: 'Tide',
      style: {},
    },
    children: [{
      component: 'Tides',
      name: 'tide',
      props: {
        value: '#tide',
      },
    }],
  }, {
    component: 'Section',
    props: {
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'TextField',
      name: 'waterDensity',
      props: {
        floatingLabelText: '@nTextWaterDensity',
        style: {
          marginRight: '10px',
          verticalAlign: 'middle',
        },
        validType: 'number',
        defaultValue: '#waterDensity',
      },
    }],
  }, {
    component: 'Section',
    name: '',
    props: {
      title: 'Pilot Station',
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'PilotStations',
      name: 'pilotStations',
      props: {
        value: '#pilotStations',
      },
    }],
  }, {
    component: 'Section',
    name: '',
    props: {
      title: 'Tug',
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'Tugs',
      name: 'tugs',
      props: {
        value: '#tugs',
      },
    }],
  }, {
    component: 'Section',
    props: {
      title: 'Contact Info',
      style: {
        marginBottom: '20px',
      },
    },
    children: [{
      component: 'ContactInfo',
      name: 'contactMethods',
      props: {
        value: '#contactMethods',
      },
    }],
  }];

const PortView = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Port/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
    style: PropTypes.object,
    value: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let port = this.form.getValue();

    if (!port.region) { delete port.region; }
    if (port.pilotStations.length === 0) { delete port.pilotStations; }

    return port;
  },

  isValid() {
    return this.form.isValid();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
    } = this.props;
    let styles = this.getStyles();

    return (
      <ComposedForm
        ref={(ref) => this.form = ref}
        definitions={defs}
        pool={pool}
        translate={this.t}
        value={value || {}}
      />
    );
  },
});

module.exports = PortView;
