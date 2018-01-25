const React = require('react');
const ReactDOM = require('react-dom');
const StylePropable = require('~/src/mixins/style-propable');
const AutoPrefix = require('epui-md/utils/autoPrefix');
const PropTypes = React.PropTypes;
const Transitions = require("epui-md/styles/transitions");

const UploadCircularProgress = React.createClass({
  mixins: [StylePropable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes : {
    color: PropTypes.string,
    innerStyle: PropTypes.object,
    max: PropTypes.number,
    min: PropTypes.number,
    mode: PropTypes.oneOf(["determinate", "indeterminate"]),
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
    style: PropTypes.object,
    value: PropTypes.number,
  },

  _getRelativeValue() {
    let value = this.props.value;
    let min = this.props.min;
    let max = this.props.max;

    let clampedValue = Math.min(Math.max(min, value), max);
    let rangeValue = max - min;
    let relValue = Math.round(clampedValue / rangeValue * 10000) / 10000;
    return relValue * 100;
  },

  componentDidMount() {
    let wrapper = this.refs.wrapper;
    let path = this.refs.path;

    this._scalePath(path);
    this._rotateWrapper(wrapper);
  },

  _scalePath(path, step) {
    step = step || 0;
    step %= 3;

    setTimeout(this._scalePath.bind(this, path, step + 1), step ? 750 : 250);

    if (this.props.mode !== "indeterminate") return;

    if (step === 0) {
      path.style.strokeDasharray = "1, 200";
      path.style.strokeDashoffset = 0;
      path.style.transitionDuration = "0ms";
    }
    else if (step === 1) {
      path.style.strokeDasharray = "89, 200";
      path.style.strokeDashoffset = -35;
      path.style.transitionDuration = "750ms";
    }
    else {
      path.style.strokeDasharray = "89,200";
      path.style.strokeDashoffset = -124;
      path.style.transitionDuration = "850ms";
    }
  },

  _rotateWrapper(wrapper) {
    setTimeout(this._rotateWrapper.bind(this, wrapper), 10050);

    if (this.props.mode !== "indeterminate") return;

    AutoPrefix.set(wrapper.style, "transform", null);
    AutoPrefix.set(wrapper.style, "transform", "rotate(0deg)");
    wrapper.style.transitionDuration = "0ms";

    setTimeout(() => {
      AutoPrefix.set(wrapper.style, "transform", "rotate(1800deg)");
      wrapper.style.transitionDuration = "10s";
      AutoPrefix.set(wrapper.style, "transitionTimingFunction", "linear");
    }, 50);
  },

  getDefaultProps() {
    return {
      max: 100,
      min: 0,
      mode: "determinate",
      size: 50,
      strokeWidth: 2,
      value: 0,
    };
  },

  getTheme() {
    return this.context.muiTheme.palette;
  },

  getStyles(zoom) {
    let size = zoom + 'px';
    let styles = {
      root: {
        position: "relative",
        display: "inline-block",
        width: `${size}px`,
        height: `${size}px`,
      },
      wrapper: {
        width: `${size}px`,
        height: `${size}px`,
        display: "inline-block",
        transition: Transitions.create("transform", "20s", null, "linear"),
      },
      svg: {
        height: size,
        position: "relative",
        transform: "rotate(-90deg)",
        width: size,
      },
      path: {
        strokeDashoffset: 1,
        stroke: this.props.color || this.getTheme().primary1Color,
        strokeLinecap: "round",
        transition: Transitions.create("all", "1.5s", null, "ease-in-out"),
      },
    };

    AutoPrefix.set(styles.wrapper, "transitionTimingFunction", "linear");

    if (this.props.mode === "determinate"){
      let relVal = this._getRelativeValue();
      let strokeWidth = this.props.strokeWidth || 2;
      let r = zoom / 2 - strokeWidth;
      styles.path.transition = Transitions.create("all", "0.3s", null, "linear");
      styles.path.strokeDasharray = Math.round(relVal * 3.1415926535 * 2 * r / 100) + ",40000";
    }

    return styles;
  },

  render() {
    let {
      style,
      innerStyle,
      size,
      strokeWidth,
      ...other,
    } = this.props;

    size = size || 50;
    strokeWidth = strokeWidth || 2;
    let cx = size / 2;
    let r = cx - strokeWidth;
    let styles = this.getStyles(size);

    return (
      <div
        {...other}
        style={this.mergeAndPrefix(styles.root, style)}
      >
        <div ref="wrapper" style={this.mergeAndPrefix(styles.wrapper, innerStyle)}>
          <svg style={this.mergeAndPrefix(styles.svg)}>
            <circle
              ref="path"
              cx={cx}
              cy={cx}
              fill="none"
              r={r}
              strokeMiterlimit="10"
              strokeWidth={strokeWidth}
              style={this.mergeAndPrefix(styles.path)}
            />
          </svg>
        </div>
      </div>
    );
  },
});

module.exports = UploadCircularProgress;
