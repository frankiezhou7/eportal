const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const React = require('react');
const Translatable = require('epui-intl').mixin;
const ContentItem = require('./content-item');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const moment = require('moment');

const PropTypes = React.PropTypes;

const RightContent = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Notification/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    messages: PropTypes.array,
    shipId: PropTypes.string,
    user: PropTypes.string,
  },

  getDefaultProps() {
    return { };
  },

  getInitialState() {
    return {
      messages: [],
      loading: this.props.shipId ? true : false,
    };
  },

  componentWillUpdate(nextProps) {
    let pagination = {
      sortby:{
        'read' : 1,
        'date': -1,
      },
      cursor: 0,
      size: 8,
      query:{
        ship:nextProps.shipId,
        target:this.props.user,
        creator: {$nin : [this.props.user]},
        subtype: {
          $nin: ['Create', 'Delete']
        },
      }
    };

    if(nextProps.shipId !== '' && nextProps.shipId !== this.props.shipId){
      if(_.isFunction(global.api.message.findMessages)){
        global.api.message.findMessages.promise(pagination)
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              messages:res.response.entries,
              pagination: res.response.pagination,
              loading: false,
            });
          }
        })
        .catch((err)=>{
          console.log(err);
          console.log(this.t('nTextInitedFailed'));
        })
      }
    }
  },

  getStyles() {
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const TOP_BAR_HEIGHT = 75;
    return {
      root: {
        width: '100%',
        height: '100%',
        marginLeft: 10,
        overflowY: 'auto',
        boxSizing: 'border-box',
      },
      moreWrapper: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        cursor: 'pointer',
        paddingBottom: 20,
      },
      more: {
        color: '#f5a623',
        textDecoration: 'underline',
      },
      loading: {
        margin: '0px auto',
      },
    };
  },

  renderItems(items){
    return (
      _.map(items,(item, index) => {
        return (
          <ContentItem
            key={index}
            ref={`item_${index}`}
            item={item}
          />
        )
      })
    );
  },

  renderMore(){
    let { pagination } = this.state;
    const hasMore = pagination ? pagination.hasNext : false;
    const elLoadMore =  hasMore ? (
      <div style={this.style('moreWrapper')}>
        <FlatButton
          backgroundColor='transparent'
          onTouchTap={this._handleLoadMore}
        >
          <span style={this.s('more')}>
            {this.t('nLabelMore')}
          </span>
        </FlatButton>
      </div>

    ) : null;

    return elLoadMore;
  },

  renderListItems(messages, loading){
    return loading ? <Loading /> : (
      <div>
        {this.renderItems(messages)}
        {this.renderMore()}
      </div>
    );
  },

  render() {
    let { messages, loading } = this.state;
    return (
      <div style={this.s('root')}>
        {this.renderListItems(messages, loading)}
      </div>
    );
  },

  onLoading(shipId){
    let pagination = {
      sortby:{
        'read' : 1,
        'date': -1,
      },
      cursor: 0,
      size: 8,
      query:{
        ship:shipId,
        target:this.props.user,
        creator: {$nin : [this.props.user]},
        subtype: {
          $nin: ['Create', 'Delete']
        },
      }
    };

    this.setState({loading: true});
    if(_.isFunction(global.api.message.findMessages)){
      global.api.message.findMessages.promise(pagination)
      .then((res)=>{
        if(res.status === 'OK'){
          this.setState({
            messages:res.response.entries,
            pagination: res.response.pagination,
            loading: false,
          });
        }
      })
      .catch((err)=>{
        console.log(err);
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  _handleLoadMore() {
    let { messages, pagination } = this.state;
    if(_.isFunction(global.api.message.findMessages)){
      global.api.message.findMessages.promise(pagination)
      .then((res)=>{
        if(res.status === 'OK'){
          messages = messages.concat(res.response.entries);
          this.setState({
            messages,
            pagination: res.response.pagination,
          });
        }
      })
      .catch((err)=>{
        console.log(err);
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },
});

module.exports = RightContent;
