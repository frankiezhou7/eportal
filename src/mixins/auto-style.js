const Immutable = require('epimmutable');
const ImmutabilityHelper = require('./immutability-helper');
const invariant = require('fbjs/lib/invariant');
const React = require('react');
const shallowEqual = require('fbjs/lib/shallowEqual');
const Styles = require('./styles');
const warning = require('fbjs/lib/warning');
const ComponentName = require('./component-name');

const Map = Immutable.Map;
const List = Immutable.List;

function getPathValue(obj, path) {
  let root = obj;
  let subs = path.split('.');
  for (let sub of subs) {
    root = root[sub];
    if (!root) {
      return null;
    }
  }
  return root;
}

module.exports = {

  mixins: [ComponentName],

  propTypes: {
    style: React.PropTypes.object,
  },

  componentWillMount: function() {
    // console.log(`${this.componentName()}.auto-style.cwm`);
    invariant(this.getStyles, `${this.componentName()}.getStyles() must be implemented, if using auto-style mixin`);
    this.__render = this.render;
    this.render = (function() {
      this.__styles = this.getStyles();
      return this.__render();
    }).bind(this);
  },

  style() {
    return this.applyStyle.apply(this, arguments);
  },

  applyStyle() {
    let root = this.__styles;
    if (!root) {
      warning(!root, `${this.componentName()}.getStyles() is not triggered`);
      return;
    }

    if (!this.__style_cache) {
      this.__style_cache = Map();
    }
    if (!this.__style_merged) {
      this.__style_merged = Map();
    }


    // A. 逐一检查参数，并判断是否有参数所指的样式发生变化，如果有变化则更新样式缓存
    let styles = [];
    let changed = false;
    for (let i = 0, len = arguments.length; i < len; i++) {
      let arg = arguments[i];
      warning(_.isString(arg), `Check ${this.componentName()}.render(), only strings are acceptable by Auto-Style.style()`);
      if (!_.isString(arg)) {
        continue;
      }
      let obj = getPathValue(root, arg);
      if (!obj) {
        continue;
      }
      styles.push(obj);
      let cached = this.__style_cache.get(arg);
      if (!cached || !shallowEqual(obj, cached)) {
        this.__style_cache = this.__style_cache.set(arg, obj);
        changed = true;
      }
    }
    // B. 将参数列表作为索引，检索merged缓存，根据样式缓存变化更新/返回merged缓存
    let sig = List(arguments);
    let merged = this.__style_merged.get(sig);
    if (merged) {
      if (changed) {
        this.__style_merged = this.__style_merged.remove(sig);
      } else {
        return merged;
      }
    }

    // C. 如果没找到或有变更，则新merge并缓存
    let style = Styles.mergeAndPrefix.apply(this, styles);
    this.__style_merged = this.__style_merged.set(sig, style);
    return style;
  },

  //Moved this function to ImmutabilityHelper.merge
  mergeStyles() {
    return ImmutabilityHelper.merge.apply(this, arguments);
  },

  //Moved this function to /utils/styles.js
  mergeAndPrefix() {
    return Styles.mergeAndPrefix.apply(this, arguments);
  },
};
