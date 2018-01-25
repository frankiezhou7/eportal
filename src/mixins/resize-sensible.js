const React = require('react');
const ReactDOM = require('react-dom');
const ElementResizeEvent = require('element-resize-event');

module.exports = {
  componentDidMount() {
    this.updateSize();
    let node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    if (!node) { return; }

    ElementResizeEvent(node, () => {
      this.updateSize();
    });
  },

  updateSize() {
    let node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    if (!node) { return; }
    let width = node.clientWidth;
    let height = node.clientHeight;

    let {
      rootWidth,
      rootHeight,
    } = this.state;

    if (rootWidth === width && rootHeight === height) { return; }

    this.setState({
      rootWidth: width,
      rootHeight: height
    });

    let fn = this._handleResize;
    if(_.isFunction(fn)) {
      fn(width, height);
    }
  },
};
