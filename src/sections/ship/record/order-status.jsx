const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const OrderStatusItem = require('./order-status-item');
const ArrowForward = require('epui-md/svg-icons/navigation/arrow-forward');
const Translation = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const OrderStatus = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: require(`epui-intl/dist/Notification/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    records : PropTypes.array,
    order : PropTypes.object,
  },

  getDefaultProps() {
    return {
      nLabelNoRecord: 'No Record',
      nTextInProcess: 'in Process',
      records:[],
    };
  },

  getInitialState() {
    return {
    };
  },


  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        padding: 24,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
      },
      arrow:{
        marginLeft: 37,
        marginRight:37
      },
      status:{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 30,
      },
      last:{
        width: 160,
        fontSize: 15,
        color: theme.epColor.orangeColor,
      },
      empty:{
        paddingTop: 50,
        paddingBottom: 50,
        width: '100%',
        textAlign: 'center',
      },
    };

    return styles;
  },

  renderStatus(record,key){
    let {records} = this.props;
    let isLast = key === records.length - 1;
    return (
      <div style = {this.style('status')}>
       <OrderStatusItem key = {record._id+'_item'} record = {record} isActive = {key === this.props.records.length-1}/>
       {
         isLast && this._isOrderFinished() ? null : <ArrowForward key = {record._id+'_arrow'} style = {this.style('arrow')}/>
       }
      </div>
    );
  },

  renderLast(){
    return (
      <div style = {this.style('last')}>{this.t('nTextInProcess')}</div>
    );
  },

  render() {
    let {records} = this.props;
    return (
      <div style={this.style('root')}>
        {
          _.isEmpty(records) ? (
            <div style = {this.style('empty')}>{this.t('nLabelNoRecord')}</div>
          ):_.map(records,(record,key)=>{
            return this.renderStatus(record,key);
          })
        }
        {this._isOrderFinished() ? null : this.renderLast()}
      </div>
    );
  },

  _isOrderFinished(){
    let {records} = this.props;
    if(_.isEmpty(records)) return true;
    let last = _.last(records);
    if(!last.data) return true;
    if(last.data.state == 'Cancel' || last.data.state == 'CloseOrder') return true;
    return false;
  },

});

module.exports = OrderStatus;
