const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BerthServiceAbility = require('epui-md/ep/BerthServiceAbility');
const MainCargos = require('~/src/shared/main-cargos');
const PropTypes = React.PropTypes;
const TextFieldTerminalName = require('~/src/shared/text-field-terminal-name');
const Translatable = require('epui-intl').mixin;
const { ComposedForm, use } = require('epui-composer');

use(BerthServiceAbility);
use(MainCargos);
use(TextFieldTerminalName);

const defs = [{
  component: 'Section',
  props: {
    style: {
      marginBottom: '20px',
    },
  },
  children: [{
    component: 'TextFieldTerminalName',
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
      },
    }],
  }];

const TerminalView = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
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
      value,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <ComposedForm
        ref={(ref) => this.form = ref}
        definitions={defs}
        value={value || {}}
      />
    );
  },
});

module.exports = TerminalView;
