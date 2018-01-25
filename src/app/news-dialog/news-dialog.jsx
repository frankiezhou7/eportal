const React = require('react');
const News = require('~/src/sections/news');
const FlatButton = require('epui-md/FlatButton');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const NewsDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    newsId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      newsId: ''
    };
  },


  getInitialState() {
    return {
      news: {},
      isFetching:true,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },


  componentWillMount() {
    this.fetchNews();
  },


  componentDidMount() {
    let actions = [
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />,
    ];

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },


  fetchNews(){
    if(global.api.epds && global.api.epds.findNewsById){
        global.api.epds.findNewsById.promise(this.props.newsId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              news: res.response
            },()=>{
              if(this.props.positionDialog) this.props.positionDialog();
            });
          }else{
            //todo: deal with error
          }
        }).catch(err=>{
          //todo: deal with err
        });
    }
  },

  render() {
    return (
      <News
        ref="form"
        newsItem = {this.state.news}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

});

module.exports = NewsDialog;
