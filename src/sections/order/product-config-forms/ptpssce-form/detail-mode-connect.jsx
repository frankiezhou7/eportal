const React = require('react');
const _ = require('eplodash');
const DetailMode = require('./detail-mode');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;

const DetailModeConnect = React.createClass({

  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    articleTypes: PropTypes.object,
    config: PropTypes.object,
    getPurchaseArticleTypes: PropTypes.func,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    let {
      articleTypes,
      getPurchaseArticleTypes,
    } = this.props;

    if(!articleTypes || articleTypes.size === 0) {
      if (_.isFunction(getPurchaseArticleTypes)) {
        getPurchaseArticleTypes();
      }
    }
  },

  getStyles() {
    let rootStyle = {
      display: 'bolck',
    };

    if(this.props.style) {
      _.merge(rootStyle, this.props.style);
    }

    return {
      root: rootStyle,
    };
  },

  getValue() {
    return this.refs.detailMode.getValue();
  },

  render() {
    let {
      orderEntry,
      config
    } = this.props;

    return (
      <DetailMode
        {...this.props}
        ref='detailMode'
        config={config}
        orderEntry={orderEntry}
        style={this.style('root')}
      />
    );
  },

});

let { getPurchaseArticleTypes } = global.api.order;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      articleTypes: state.getIn(['articleType', 'purchaseArticleType']),
      getPurchaseArticleTypes,
    };
  },
  null,
  null,
  {withRef :true}
)(DetailModeConnect);
