const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BerthRestrictions = require('~/src/shared/berth-restrictions');
const BerthServiceAbility = require('epui-md/ep/BerthServiceAbility');
const LiftingWeight = require('~/src/shared/lifting-weight');
const MainCargos = require('~/src/shared/main-cargos');
const PropTypes = React.PropTypes;
const TextFieldBerthName = require('~/src/shared/text-field-berth-name');
const Translatable = require('epui-intl').mixin;
const { ComposedForm, use } = require('epui-composer');

use(BerthRestrictions);
use(BerthServiceAbility);
use(LiftingWeight);
use(MainCargos);
use(TextFieldBerthName);

const defs = [{
  component: 'Section',
  props: {
    style: {
      marginBottom: '20px',
    },
  },
  children: [{
    component: 'TextFieldBerthName',
    name: 'name',
    props: {
      required: true,
      style: {
        marginRight: '10px',
        float: 'left',
      },
      defaultValue: '#name',
    },
  }],
}, {
    component: 'Section',
    name: '',
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
        mode: 'port',
        style: {
          marginTop: '10px',
        },
        value: '#abilities',
      },
    }],
  }, {
    component: 'Section',
    name: '',
    props: {
      style: {
        marginBottom: '20px',
      },
      title: 'Main Cargo',
    },
    children: [{
      component: 'MainCargos',
      name: 'payloadTypes',
      props: {
        value: '#payloadTypes',
        disabled: 'true',
      },
    }],
  }, {
    component: 'Section',
    props: {
      style: {
        marginBottom: '20px',
      },
      title: 'Crane',
    },
    children: [{
      component: 'LiftingWeight',
      name: 'cranes',
      props: {
        value: '#cranes',
      },
    }],
  }];

const BerthView = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.form.getValue();
  },

  isValid() {
    return this.form.isValid();
  },

  getStyles() {
    let styles = {
      root: {
        width: global.contentWidth,
        height: '100%',
        overflow: 'auto',
      },
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
    } = this.props;

    let berthId = value && value._id;

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

module.exports = BerthView;
