const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const React = require('react');
const Translatable = require('epui-intl').mixin;
const NavigationArrowForward = require('epui-md/svg-icons/navigation/arrow-forward');
const moment = require('moment');

const PropTypes = React.PropTypes;

const ContentItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Notification/${__LOCALE__}`),
    require(`epui-intl/dist/Order/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    item: PropTypes.object,
  },

  getDefaultProps() {
    return { };
  },

  getInitialState() {
    return {
      hover: false,
    };
  },

  getStyles() {
    let { hover } = this.state;
    let { item: { read }, item: { subtype }, item } = this.props;
    // let id = _.get(item, ['orderEntry','id'], null);
    // if(subtype === 'Event' || subtype === 'Change'){
    //   read = !read ? id ? false : true : true;
    // }
    return {
      root: {
        width: 740,
        height: 58,
        boxShadow: '0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24)',
        padding: '20px 24px',
        backgroundColor: hover ? read ? '#E8E8E8' : '#FFF2DC' : '#fafafa',
        cursor: hover ? 'pointer' : 'none',
        marginBottom: 15,
      },
      header: {
        voyage: {
          fontSize: 16,
          color: read ? '#9b9b9b' : '#4a4a4a',
          textTransform: 'uppercase',
          textAlign: 'left',
          fontWeight: 500,
        },
        order: {
          fontSize: 16,
          color: read ? '#9b9b9b' : '#f5a623',
          float: 'right',
          marginLeft: 12,
          fontWeight: 500,
        },
        container: {
          minHeight: 20,
          marginBottom: 16,
        }
      },
      content: {
        container: {
          display: 'inline-block',
          marginTop: -5,
        },
        event: {
          fontSize: 15,
          color: read ? '#9b9b9b' : '#4a4a4a',
          minHeight: 21,
        },
        info: {
          display: 'inline-block',
          float: 'right',
        },
        infoText: {
          fontSize: 15,
          color: read ? '#9b9b9b' : '#4a4a4a',
          float: 'right',
          marginLeft: 12,
        },
        orderPrev: {
          minWidth: 70,
          height: 32,
          backgroundColor: read ? '#9b9b9b' : '#f5a623',
          borderRadius: 2,
          textAlign: 'center',
          lineHeight: '32px',
          fontSize: 15,
          fontWeight: 500,
          color: '#fff',
          display: 'inline-block',
          verticalAlign: 'middle',
          padding: '0px 18px',
        },
        orderNext: {
          fontSize: 15,
          color: read ? '#9b9b9b' : '#f5a623',
          display: 'inline-block',
          verticalAlign: 'middle',
        },
        arrow: {
          margin: '0px 43px',
          display: 'inline-block',
          verticalAlign: 'middle',
          fill: read ? '#9b9b9b' : '#000',
        },
        voyage: {
          minWidth: 162,
          height: 18,
          backgroundColor: read ? '#9b9b9b' : '#f8e5c4',
          padding: '2px 5px',
          fontSize: 15,
          lineHeight: '18px',
          color: read ? '#fff' : '#f5a623',
          display: 'inline-block',
          textAlign: 'center',
          marginRight: 10,
        },
        voyageChanged: {
          textDecoration: 'line-through',
        }
      }
    };
  },

  renderHeader(item) {
    if(!item) return;
    if(item.type === 'Voyage'){
      if(!_.has(item,['voyage','port'])) return (<div style={this.s('header.container')}></div>);
      return (
        <div style={this.s('header.container')}>
          <span style={this.s('header.voyage')}>{item.voyage.port}</span>
        </div>
      );
    }else {
      if(!_.has(item,['voyage','port'])) return (<div style={this.s('header.container')}></div>);
      return (
        <div style={this.s('header.container')}>
          <span style={this.s('header.voyage')}>{item.voyage.port}</span>
          <span style={this.s('header.order')}>{`No. ${item.order.orderNumber}`}</span>
          <span style={this.s('header.order')}>{item.order.type}</span>
        </div>
      );
    }
  },

  renderArrow(state){
    if(state === 'CloseOrder' || state === 'Cancel') return null;
    return (
      <NavigationArrowForward style={this.s('content.arrow')}/>
    );
  },

  renderContent(item) {
    if(!item) return;
    if(item.type === 'Voyage'){
      let voyagePrevType = this.getVoyageTag(item.subtype).prev;
      let voyageNextType = this.getVoyageTag(item.subtype).next;
      if(!_.has(item,['data', 'old']) && _.has(item,['data', 'new'])){
        return (
          <div>
            <div style={this.s('content.voyage')}>{voyageNextType + ' ' + moment(item.data.new).format('DD/MMM/YYYY HH:mm')}</div>
            {this.renderBottom(item)}
          </div>
        );
      }
      return (
        <div>
          <div style={Object.assign({},this.s('content.voyage'),this.s('content.voyageChanged'))}>{voyagePrevType + ' ' + moment(item.data.old).format('DD/MMM/YYYY HH:mm')}</div>
          <div style={this.s('content.voyage')}>{voyageNextType + ' ' + moment(item.data.new).format('DD/MMM/YYYY HH:mm')}</div>
          {this.renderBottom(item)}
        </div>
      );
    }else if(item.subtype === 'OPState'){
      if(!_.has(item,['data','state'])){
        return (
          <div>
            <span style={this.s('content.event')}></span>
            {this.renderBottom(item)}
          </div>
        );
      }
      return (
        <div>
          <div style={this.s('content.container')}>
            <div style={this.s('content.orderPrev')}>{this.getOPState(item.data.state).old}</div>
            {this.renderArrow(item.data.state)}
            <div style={this.s('content.orderNext')}>{this.getOPState(item.data.state).new}</div>
          </div>
          {this.renderBottom(item)}
        </div>
      );
    }else if(item.subtype === 'Event'){
      if(!_.has(item,['orderEntry','product'])){
        return (
          <div>
            <span style={this.s('content.event')}>{this.t('nTextServiceRemoved')}</span>
            {this.renderBottom(item)}
          </div>
        );
      }
      return (
        <div>
          <span style={this.s('content.event')}>{`"${item.orderEntry.product}" ` + this.t('nTextReportUpdate')}</span>
          {this.renderBottom(item)}
        </div>
      );
    }else if(item.subtype === 'Change'){
      if(!_.has(item,['orderEntry','product'])){
        return (
          <div>
            <span style={this.s('content.event')}>{this.t('nTextServiceRemoved')}</span>
            {this.renderBottom(item)}
          </div>
        );
      }
      return (
        <div>
          <span style={this.s('content.event')}>{`"${item.orderEntry.product}" ` + this.t('nTextServiceUpdate')}</span>
          {this.renderBottom(item)}
        </div>
      );
    }else if(item.subtype === 'FeedBack'){
      return (
        <div>
          <span style={this.s('content.event')}>{this.t('nTextMessageUpdate')}</span>
          {this.renderBottom(item)}
        </div>
      );
    }
  },

  renderBottom(item){
    return (
      <div style={this.s('content.info')}>
        <span style={this.s('content.infoText')}>{_.has(item, ['creator', 'id']) ? item.creator.name : '-'}</span>
        <span style={this.s('content.infoText')}>{moment(item.date).format('DD/MMM/YYYY HH:mm')}</span>
      </div>
    )
  },

  render() {
    let { item } = this.props;
    return (
      <div
        style={this.s('root')}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        onTouchTap = {this._handleTouchTap}
      >
        {this.renderHeader(item)}
        {this.renderContent(item)}
      </div>
    );
  },

  getVoyageTag(subtype){
    let prev = '', next = '';
    switch(subtype){
      case 'ETAChange' :
        prev = next = 'ETA';
      break;
      case 'ETBChange' :
        prev = next = 'ETB';
      break;
      case 'ETDChange' :
        prev = next = 'ETD';
      break;
      case 'ATAChange' :
        prev = next = 'ATA';
      break;
      case 'ATBChange' :
        prev = next = 'Berthed';
      break;
      case 'ATDChange' :
        prev = next = 'Sailed';
      break;
      case 'ETAToATA' :
        prev = 'ETA';
        next = 'ATA';
      break;
      case 'ETBToATB' :
        prev = 'ETB';
        next = 'Berthed';
      break;
      case 'ETDToATD' :
        prev = 'ETD';
        next = 'Sailed';
      break;
      default:
      break;
    }
    return { prev, next };
  },

  getOPState(state){
    switch (state) {
      case 'ConfirmOrder':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforQuotation')
        }
        break;
      case 'ConfirmNewOrderEntry':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforNewQuotation')
        }
        break;
      case 'QuotedAll':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforConfirm')
        }
        break;
      case 'QuotedNewOrderEntry':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforNewConfirm')
        }
        break;
      case 'AcceptAll':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforOperation')
        }
        break;
      case 'AcceptNewOrderEntry':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforOperation')
        }
        break;
      case 'RejectAll':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforNewQuotation')
        }
        break;
      case 'RejectNewOrderEntry':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforNewQuotation')
        }
        break;
      case 'ExecutingAll':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextInProcess')
        }
        break;
      case 'ExecutingNewOrderEntry':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextInProcess')
        }
        break;
      case 'ExecutedAll':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforBill')
        }
        break;
      case 'ExecutedNewOrderEntry':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: this.t('nTextWaitingforBill')
        }
        break;
      case 'CloseOrder':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: ''
        }
        break;
      case 'Cancel':
        return {
          old: this.t(`nLabelOrderAction${state}`),
          new: ''
        }
        break;
      default:
        return {
          old: '',
          new: ''
        }
        break;
    }
  },

  _handleTouchTap(){
    if(this.props.item.read) return;
    this.getRoute();
  },

  getRoute(){
    let { item } = this.props;
    switch(item.type){
      case 'Order':
        switch(item.subtype){
          case 'OPState':
            if(_.get(item,['order','status']) === 999 || _.get(item,['order','status']) === 1000){
              if(_.isFunction(global.api.message.clearUnreadStatusById)){
                global.api.message.clearUnreadStatusById.promise(item._id)
                .catch((err)=>{
                  console.log(this.t('nTextInitedFailed'));
                })
              }
            }
            global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}`, true);
          break;
          case 'Change':
            if(_.has(item,['orderEntry','id'])){
              global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}/${item.order.id}/${item.orderEntry.id}/CONFIG_PAGE`, true);
            }else{
              if(_.isFunction(global.api.message.clearUnreadStatusById)){
                global.api.message.clearUnreadStatusById.promise(item._id)
                .catch((err)=>{
                  console.log(this.t('nTextInitedFailed'));
                })
              }
              global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}`, true);
            }
          break;
          case 'Event':
            if(_.has(item,['orderEntry','id'])){
              global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}/${item.order.id}/${item.orderEntry.id}/EVENT_PAGE`, true);
            }else{
              if(_.isFunction(global.api.message.clearUnreadStatusById)){
                global.api.message.clearUnreadStatusById.promise(item._id)
                .catch((err)=>{
                  console.log(this.t('nTextInitedFailed'));
                })
              }
              global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}`, true);
            }
          break;
          case 'FeedBack':
            global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}`, true);
          break;
          default:
          break;
        }
      break;
      case 'Voyage':
        global.tools.toSubPath(`/ship/${item.ship}/voyage/${item.voyage.id}`, true);
      break;
      default:
      break;
    }
  },

  _handleMouseEnter() {
    this.setState({hover:true});
  },

  _handleMouseLeave() {
    this.setState({hover:false});
  },

  displayWithLimit(str,number){
    if(!str) return ' - ';
    if(!number) return str;
    return str.length>number ? str.substring(0,number)+'...': str;
  },
});

module.exports = ContentItem;
