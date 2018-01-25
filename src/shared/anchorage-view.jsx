const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const AnchorageBelongTo = require('~/src/shared/anchorage-belong-to');
const AnchorageRange = require('~/src/shared/anchorage-range');
const BerthServiceAbility = require('epui-md/ep/BerthServiceAbility');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const PropTypes = React.PropTypes;
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;
const TextFieldAnchorageName = require('~/src/shared/text-field-anchorage-name');
const TextFieldAirDraft = require('~/src/shared/text-field-air-draft');
const TextFieldAnchorageDescription = require('~/src/shared/text-field-anchorage-description');
const { ComposedForm, use } = require('epui-composer');

use(AnchorageBelongTo);
use(AnchorageRange);
use(BerthServiceAbility);
use(TextFieldAirDraft);
use(TextFieldAnchorageDescription);
use(TextFieldAnchorageName);

require('epui-intl/lib/locales/' + __LOCALE__);

const defs = [{
  component: 'Section',
  props: {
    style: {
      marginBottom: '20px',
    },
  },
  children: [{
    component: 'TextFieldAnchorageName',
    props: {
      required: true,
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#name',
    },
  }, {
    component: 'TextFieldAirDraft',
    props: {
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#maxDraft',
    },
  }],
}, {
    component: 'Section',
    props: {
      style: {
        marginBottom: '20px',
      },
      title: 'Belong to',
    },
    children: [{
      component: 'AnchorageBelongTo',
      props: {
        style: {
          marginTop: '15px',
        },
        terminals: '#items',
        value: '#terminals',
      },
    }],
  }, {
    component: 'Section',
    props: {
      style: {
        marginBottom: '20px',
      },
      title: 'Anchorage Range',
    },
    children: [{
      component: 'AnchorageRange',
      props: {
        style: {},
        value: '#region',
      },
    }],
  }, {
    component: 'Section',
    props: {
      style: {
        marginBottom: '20px',
      },
      title: 'Anchorage Description',
    },
    children: [{
      component: 'TextFieldAnchorageDescription',
      props: {
        style: {
          width: '520px',
        },
        defaultValue: '#description',
      },
    }],
  }, {
    component: 'Section',
    props: {
      style: {
        marginBottom: '20px',
      },
      title: 'Function',
    },
    children: [{
      component: 'BerthServiceAbility',
      name: 'abilities',
      props: {
        mode: 'anchorage',
        style: {
          marginTop: '10px',
        },
        value: '#abilities',
      },
    }],
  }];

const AnchorageView = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
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

  isValid() {
    return this.form.isValid();
  },

  getValue() {
    return this.form.getValue();
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
      <div style={Object.assign(styles.root, style)}>
        <ComposedForm
          ref={(ref) => this.form = ref}
          definitions={defs}
          value={value || {}}
        />
      </div>
    );
  },
});

module.exports = AnchorageView;
