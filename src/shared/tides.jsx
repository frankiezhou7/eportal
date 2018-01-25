const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;
const {ComposedForm, use} = require('epui-composer');

use(TextField);

const Tides = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Berth/${__LOCALE__}`),
  ],

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
      root: {
        marginLeft: -20,
      },
    };

    return styles;
  },

  getDefs() {
    const defs = [{
      component: 'Section',
      name: '',
      props: {
        title: '',
      },
      children: [{
        component: 'TextField',
        name: 'highestTide',
        props: {
          floatingLabelText: this.t('nTextHighestTide'),
          style: {
            marginRight: '10px',
            verticalAlign: 'middle',
          },
          validType: 'number',
          defaultValue: '#highestTide',
        },
        layout: {},
      }, {
        component: 'TextField',
        name: 'lowestTide',
        props: {
          floatingLabelText: this.t('nTextLowestTide'),
          style: {
            marginRight: '10px',
            verticalAlign: 'middle',
          },
          validType: 'number',
          defaultValue: '#lowestTide',
        },
        layout: {},
      }],
    }, {
      component: 'Section',
      name: '',
      props: {
        title: '',
      },
      children: [{
        component: 'TextField',
        name: 'averageHighTide',
        props: {
          floatingLabelText: this.t('nTextAverageHighTide'),
          style: {
            marginRight: '10px',
            verticalAlign: 'middle',
          },
          validType: 'number',
          defaultValue: '#averageHighTide',
        },
      }, {
        component: 'TextField',
        name: 'averageLowTide',
        props: {
          floatingLabelText: this.t('nTextAverageLowTide'),
          style: {
            marginRight: '10px',
            verticalAlign: 'middle',
          },
          validType: 'number',
          defaultValue: '#averageLowTide',
        },
      }],
    }];

    return defs;
  },

  render() {
    let { value } = this.props;

    let styles = this.getStyles();

    const defs = this.getDefs();

    return (
      <div style={styles.root}>
        <ComposedForm
          ref={(ref) => this.form = ref}
          definitions={defs}
          value={value || {}}
        />
      </div>
    );
  },
});

module.exports = Tides;
