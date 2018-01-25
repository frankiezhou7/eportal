const React = require('react');
const _ = require('eplodash');
const ActionVisibility = require('epui-md/svg-icons/action/visibility');
const RaisedButton = require('epui-md/RaisedButton');
const IconButton = require('epui-md/IconButton');
const { formatDate } = require('~/src/utils');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const RecommendableItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/PortDialog/${__LOCALE__}`),
    require(`epui-intl/dist/OrganizationDialog/${__LOCALE__}`),
    require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    type: PropTypes.oneOf(['PORT','ORGANIZATION','NEWS','REGULATION']),
    item: PropTypes.object.isRequired,
    onTopBtnTouchTap: PropTypes.func,
    onRecommendBtnTouchTap: PropTypes.func,
    onRecommendPlusBtnTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      type: 'PORT',
      item: {}
    };
  },

  getInitialState() {
    return {
      disable: false,
      hovered: false
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        padding: 10,
        backgroundColor: this.state.hovered ? '#e9f8ff' : '#fff',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      name:{
        paddingLeft: 10,
        paddingRight: 10,
        flex: 3,
        maxHeight: 100,
        overflow: 'hidden',
      },
      type:{
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
      },
      time:{
        paddingLeft: 10,
        paddingRight: 10,
        flex: 2,
      },
      icon:{
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
      },
      iconBtn:{
        fill: theme.epColor.secondaryColor
      },
    };

    return styles;
  },

  handleMouseEnter(){
    if(!this.state.hovered) this.setState({hovered : true});
  },

  handleMouseLeave(){
    if(this.state.hovered) this.setState({hovered : false});
  },

  handleView(){
    let component = {};
    let title = '';
    switch (this.props.type) {
      case 'PORT':
        title = this.t('nTextPortInfo');
        component = {
          name: 'PortViewDialog',
          props: {
            portId: this.props.item._id
          },
        };
        break;
      case 'NEWS':
        title = this.t('nTextNewsInfo');
        component = {
          name: 'NewsViewDialog',
          props: {
            newsId: this.props.item._id
          },
        };
        break;
      case 'REGULATION':
        title = this.t('nTextRegulationInfo');
        component = {
          name: 'RegulationViewDialog',
          props: {
            regulationId: this.props.item._id
          },
        };
        break;
      case 'ORGANIZATION':
        title = this.t('nTextOrganizationInfo');
        component = {
          name: 'OrganizationViewDialog',
          props: {
            organizationId: this.props.item._id
          },
        };
        break;
      default:
    }

    let props = {
      title: title,
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleTopTouchTap(){
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureAddRecommendTop'), ()=>{
        if(this.props.onTopBtnTouchTap) this.props.onTopBtnTouchTap(this.props.item._id);
      });
    }
  },

  handleRecommendTouchTap(){
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureAddRecommend'), ()=>{
        if(this.props.onRecommendBtnTouchTap) this.props.onRecommendBtnTouchTap(this.props.item._id);
      });
    }
  },

  handleRecommendPlusTouchTap(){
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureAddRecommendPlus'), ()=>{
        if(this.props.onRecommendPlusBtnTouchTap) this.props.onRecommendPlusBtnTouchTap(this.props.item._id);
      });
    }
  },

  render() {
    const {item} = this.props;

    const viewIcon = (
      <IconButton
        iconStyle = {this.style('iconBtn')}
        onTouchTap = {this.handleView}
      >
        <ActionVisibility />
      </IconButton>
    );

    const topIcon = (
      <RaisedButton
        label = {this.t('nLabelOnTop')}
        backgroundColor = '#159008'
        labelColor = '#fff'
        onTouchTap = {this.handleTopTouchTap}
      />
    );

    const recommendIcon = (
      <RaisedButton
        label = {this.t('nLabelRecommend')}
        backgroundColor = '#4a90e2'
        labelColor = '#fff'
        onTouchTap = {this.handleRecommendTouchTap}
      />
    );

    const recommendPlusIcon = (
      <RaisedButton
        label = {this.t('nLabelRecommendPlus')}
        backgroundColor = '#159008'
        labelColor = '#fff'
        onTouchTap = {this.handleRecommendPlusTouchTap}
      />
    );

    return (
      <div
        style = {this.style('root')}
        onMouseEnter = {this.handleMouseEnter}
        onMouseLeave = {this.handleMouseLeave}
      >
        <span style = {this.style('name')}>{item.name}</span>
        <span style = {this.style('type')}>{this.props.type === 'PORT' ? item.code : item.type}</span>
        <span style = {this.style('time')}>{formatDate(item.dateUpdate)}</span>
        <span style = {this.style('icon')}>{viewIcon}</span>
        <span style = {this.style('icon')}>{recommendIcon}</span>
        {/*{this.props.type !== 'REGULATION' ? <span style = {this.style('icon')}>{recommendPlusIcon}</span> : null}*/}
      </div>
    );
  },
});

module.exports = RecommendableItem;
