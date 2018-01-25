const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const TextFieldAirDraft = require('./text-field-air-draft');
const TextFieldArriveDraft = require('./text-field-arrive-draft');
const TextFieldBeam = require('./text-field-beam');
const TextFieldBerthDraft = require('./text-field-berth-draft');
const TextFieldChannelDraft = require('./text-field-channel-draft');
const TextFieldDwt = require('./text-field-dwt');
const TextFieldLOA = require('./text-field-loa');
const Translatable = require('epui-intl').mixin;
const { ComposedForm, use } = require('epui-composer');

use(TextFieldAirDraft);
use(TextFieldBeam);
use(TextFieldBerthDraft);
use(TextFieldChannelDraft);
use(TextFieldDwt);
use(TextFieldLOA);
use(TextFieldArriveDraft);

const defs = [{
  component: 'Section',
  name: '',
  props: {},
  children: [{
      component: 'TextFieldAirDraft',
      name: 'maxAirDraft',
      props: {
        style: {
          marginRight: '10px',
        },
        defaultValue: '#maxAirDraft',
      },
    }, {
      component: 'TextFieldDwt',
      name: 'maxDWT',
      props: {
        style: {
          marginRight: '10px',
        },
        defaultValue: '#maxDWT',
      },
    }, {
      component: 'TextFieldBerthDraft',
      name: 'berthDraft',
      props: {
        style: {
          marginRight: '10px',
        },
        defaultValue: '#berthDraft',
      },
    }],
}, {
  component: 'Section',
  name: '',
  props: {},
  children: [{
    component: 'TextFieldLOA',
    name: 'maxLOA',
    props: {
      style: {
        marginRight: '10px',
      },
      defaultValue: '#maxLOA',
    },
  }, {
    component: 'TextFieldBeam',
    name: 'maxBeam',
    props: {
      style: {
        marginRight: '10px',
      },
      defaultValue: '#maxBeam',
    },
  }, {
    component: 'TextFieldChannelDraft',
    name: 'channelDraft',
    props: {
      style: {
        marginRight: '10px',
      },
      defaultValue: '#channelDraft',
    },
  }, {
    component: 'TextFieldArriveDraft',
    name: 'maxArriveDraft',
    props: {
      style: {
        marginRight: '10px',
      },
      defaultValue: '#maxArriveDraft',
    },
  }],
}];

const BerthRestrictions = React.createClass({
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

  getValue() {
    return this.form.getValue();
  },

  isChanged() {
    return this.form.isChanged();
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
    let { value } = this.props;
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

module.exports = BerthRestrictions;
