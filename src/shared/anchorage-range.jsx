const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const TextFieldLocation = require('~/src/shared/text-field-location');
const Translatable = require('epui-intl').mixin;

const POINTS = ['point1', 'point2', 'point3', 'point4'];

const AnchorageRange = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    itemStyle: PropTypes.object,
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentWillUnmount() {
    clearTimeout(this.timeout);
  },

  isValid() {
    let valid = true, _this = this;

    for (let point of POINTS) {
      let el = this.refs[point];
      if (!el || !_.isFunction(el.isValid)) { continue; }
      let isValid = el.isValid();
      if (isValid) {
        isValid.then(res => {
          if(!res)
          valid = false;
        });
      }
    }

    this.__promise = new Promise((res, rej) => {
      _this.timeout = setTimeout(() => {
        res(valid);
      },500);
    }).then((res) => {
      return res;
    }).catch(err => {
      return rej(err);
    });

    return this.__promise;
  },

  getValue() {
    let value = [];

    for (let point of POINTS) {
      let el = this.refs[point];
      if (!el || !_.isFunction(el.getValue)) { continue; }
      let val = el.getValue();
      value.push(val);
    }

    return {
      points: value,
    }
  },

  getStyles() {
    let styles = {
      root: {},
      item: {
        margin: '5px',
        width: '230px',
      },
    };

    return styles;
  },

  render() {
    let { itemStyle, value} = this.props;

    let styles = this.getStyles();
    let points = value ? value.points ? value.points : '' : '';

    return (
      <div style={this.style('root')}>
        <TextFieldLocation
          ref="point1"
          style={Object.assign(styles.item, itemStyle)}
          defaultValue={points && points[0]}
        />
        <TextFieldLocation
          ref="point2"
          style={Object.assign(styles.item, itemStyle)}
          defaultValue={points && points[1]}
        />
        <TextFieldLocation
          ref="point3"
          style={Object.assign(styles.item, itemStyle)}
          defaultValue={points && points[2]}
        />
        <TextFieldLocation
          ref="point4"
          style={Object.assign(styles.item, itemStyle)}
          defaultValue={points && points[3]}
        />
      </div>
    );
  },
});

module.exports = AnchorageRange;
