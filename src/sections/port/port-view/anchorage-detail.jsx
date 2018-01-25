const React = require('react');
const Divider = require( 'epui-md/Divider');
const AnchorageInfo = require( 'epui-md/ep/port/AnchorageInfo');
const AnchorageRegion = require( 'epui-md/ep/port/AnchorageRegion');
const PortFunction = require( 'epui-md/ep/port/PortFunction');
const Loading= require('epui-md/ep/RefreshIndicator');
const { displayWithLimit } = require('epui-md/utils/methods');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const AnchorageDetail = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style : PropTypes.object,
    isFetching : PropTypes.bool,
    anchorage : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      anchorage: {},
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{
        padding: padding,
      },
      divider:{
        marginTop: padding,
        marginLeft: -padding,
        marginRight: -padding,
        marginBottom: padding,
      },
    }
    if(this.props.style){
      styles.root = Object.assign(styles.root,this.props.style);
    }
    return styles;
  },

  render() {
    const anchorage = this.props.anchorage;
    const dividerStyle = this.style('divider');
    const loadingElem = (<Loading />);
    const anchorageElem = this.props.isFetching ===true ? loadingElem : _.isEmpty(anchorage) ? null : (
      <div>
        <AnchorageInfo anchorage = {anchorage} />
        <Divider style = {dividerStyle} />
        <AnchorageRegion region = {anchorage.region} />
        <Divider style = {dividerStyle} />
        <PortFunction abilities = {anchorage.abilities} />
      </div>
    );
    return (
      <div style = {this.style('root')}>
        { anchorageElem }
      </div>
    );
  }
});

module.exports = AnchorageDetail;
