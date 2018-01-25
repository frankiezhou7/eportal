const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownCargoTypes = require('../dropdown-cargo-types');
const PropTypes = React.PropTypes;
const TextFieldCapacity = require('../text-field-capacity');
const TextFieldDischargeRate = require('../text-field-discharge-rate');
const TextFieldLoadingRate = require('../text-field-loading-rate');
const TextFieldMaxVolume = require('../text-field-max-volume');
const TextFieldAcceptableBerth = require('~/src/shared/text-field-acceptable-berth');
const TextFieldAirDraft = require('~/src/shared/text-field-air-draft');
const TextFieldArriveDraft = require('~/src/shared/text-field-arrive-draft');
const TextFieldBeam = require('~/src/shared/text-field-beam');
const TextFieldBerthDraft = require('~/src/shared/text-field-berth-draft');
const TextFieldChannelDraft = require('~/src/shared/text-field-channel-draft');
const TextFieldDwt = require('~/src/shared/text-field-dwt');
const TextFieldLOA = require('~/src/shared/text-field-loa');
const Translatable = require('epui-intl').mixin;

const items = [
  'payloadType',
  'dischargeRate',
  'loadingRate',
  'maxCargoQuantityRestriction',
  'capacity',
  'acceptableBerth'
];

const restrictions = [
  'maxAirDraft',
  'maxDWT',
  'berthDraft',
  'maxLOA',
  'maxBeam',
  'channelDraft',
  'maxArriveDraft'
];

const MainCargosItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/StorageYard/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onAdd: PropTypes.func,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let value = {};
    let restrctionValue = {};

    for (let item of items) {
      let el = this[item];
      value[item] = el.getValue();
    }

    for (let restrction of restrictions){
      let el = this[restrction];
      restrctionValue[restrction] = el.getValue();
    }

    value.restrictions = restrctionValue;
    return value;
  },

  isValid() {
    if(this.__promise) { return this.__promise; }

    let results = [];
    let restrictionResults = [];

    for (let item of items) {
      let el = this[item];
      if (el && _.isFunction(el.isValid)) {
        results.push(el.isValid());
      }
    }

    for (let restrction of restrictions) {
      let el = this[restrction];
      if (el && _.isFunction(el.isValid)) {
        results.push(el.isValid());
      }
    }

    this.__promise = new Promise((res, rej) => {
      Promise.all(results).then(results => {
        this.__promise = null;
        return res(_.reduce(results, (b, r) => r && b, true));
      }).catch(err => {
        this.__promise = null;
        return rej(err);
      });
    });

    return this.__promise;
  },

  handleAdd() {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
  },

  getStyles() {
    let styles = {
      root: {},
      row: {
        marginBottom: '20px',
      },
      item: {
        width: '160px',
        marginRight: '10px',
      },
      restrictionItem: {
        width: '160px',
        marginRight: '10px',
        display: this.props.disabled ? 'none' : 'inline-block',
      },
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
    } = this.props;

    let dischargeRate = value && value.dischargeRate;
    let loadingRate = value && value.loadingRate;
    let maxCargoQuantityRestriction = value && value.maxCargoQuantityRestriction;
    let payloadType = value && value.payloadType;
    let capacity = value && value.capacity;
    let acceptableBerth = value && value.acceptableBerth;
    let maxAirDraft = value ? value.restrictions && value.restrictions.maxAirDraft : '';
    let maxDWT = value ? value.restrictions && value.restrictions.maxDWT : '';
    let berthDraft = value ? value.restrictions && value.restrictions.berthDraft : '';
    let maxLOA = value ? value.restrictions && value.restrictions.maxLOA : '';
    let maxBeam = value ? value.restrictions && value.restrictions.maxBeam : '';
    let channelDraft = value ? value.restrictions && value.restrictions.channelDraft : '';
    let maxArriveDraft = value ? value.restrictions && value.restrictions.maxArriveDraft : '';
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <div style={styles.row}>
          <DropDownCargoTypes
            key="payloadType"
            ref={(ref) => this.payloadType = ref}
            onChange={this.handleAdd}
            style={styles.item}
            value={payloadType}
          />
          <TextFieldDischargeRate
            key="dischargeRate"
            ref={(ref) => this.dischargeRate = ref}
            defaultValue={dischargeRate}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldLoadingRate
            key="loadingRate"
            ref={(ref) => this.loadingRate = ref}
            defaultValue={loadingRate}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldMaxVolume
            key="maxCargoQuantityRestriction"
            ref={(ref) => this.maxCargoQuantityRestriction = ref}
            defaultValue={maxCargoQuantityRestriction}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldCapacity
            key="capacity"
            ref={(ref) => this.capacity = ref}
            defaultValue={capacity}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldAcceptableBerth
            key="acceptableBerth"
            ref={(ref) => this.acceptableBerth = ref}
            defaultValue={acceptableBerth}
            onChange={this.handleAdd}
            style={styles.restrictionItem}
          />
        </div>
        <div style={styles.row}>
          <TextFieldAirDraft
            key="maxAirDraft"
            ref={(ref) => this.maxAirDraft = ref}
            defaultValue={maxAirDraft}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldDwt
            key="maxDWT"
            ref={(ref) => this.maxDWT = ref}
            defaultValue={maxDWT}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldBerthDraft
            key="berthDraft"
            ref={(ref) => this.berthDraft = ref}
            defaultValue={berthDraft}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldLOA
            key="maxLOA"
            ref={(ref) => this.maxLOA = ref}
            defaultValue={maxLOA}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldBeam
            key="maxBeam"
            ref={(ref) => this.maxBeam = ref}
            defaultValue={maxBeam}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldChannelDraft
            key="channelDraft"
            ref={(ref) => this.channelDraft = ref}
            defaultValue={channelDraft}
            onChange={this.handleAdd}
            style={styles.item}
          />
          <TextFieldArriveDraft
            key="maxArriveDraft"
            ref={(ref) => this.maxArriveDraft = ref}
            defaultValue={maxArriveDraft}
            onChange={this.handleAdd}
            style={styles.item}
          />
        </div>
      </div>
    );
  },
});

module.exports = MainCargosItem;
