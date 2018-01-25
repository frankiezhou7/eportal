const React = require('react');
const NewsEditor = require('~/src/sections/news/news-editor');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const NewsEditDialog = React.createClass({
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
    onSave: PropTypes.func,
  },

  getDefaultProps() {
    return {
      newsId: ''
    };
  },


  getInitialState() {
    return {
      news: {},
      isFetching: this.props.newsId ? true : false,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },


  componentWillMount() {
    if(this.props.newsId){
      this.fetchNews();
    }
  },


  componentDidMount() {
    let actions = [
      <FlatButton
        key="save"
        ref={(ref) => this.save = ref}
        label= {this.t('nTextSave')}
        secondary
        onTouchTap={this._handleSave}
      />,

      <FlatButton
        key="publish"
        ref={(ref) => this.publish = ref}
        label= {this.t('nTextPublish')}
        secondary
        onTouchTap={this._handlePublish}
      />,
      <FlatButton
        key="publishRecommendable"
        ref={(ref) => this.publishRecommendable = ref}
        label= {this.t('nTextPublishAndRecommendable')}
        secondary
        onTouchTap={this._handlePublishAndRecommendable}
      />,

      <FlatButton
        key="close"
        ref={(ref) => this.close = ref}
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
    return this.state.isFetching ? <Loading /> : (
      <NewsEditor
        ref="form"
        newsItem = {this.state.news}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleSave(){
    let news = this.refs.form.getValue();
    this.refs.form.isValid().then(valid => {
      if(!_.includes(valid, false) && this.props.onSave) {
        this.props.onSave(news);
        this._handleCancel();
      }
    })
  },

  _handlePublish(){
    let news = this.refs.form.getValue();
    news.isPublished = true;
    if(this.props.onSave) this.props.onSave(news);
    this._handleCancel();
  },

  _handlePublishAndTop(){
    let news = this.refs.form.getValue();
    news.isPublished = true;
    news.isOnTop = true;
    if(this.props.onSave) this.props.onSave(news);
    this._handleCancel();
  },

  _handlePublishAndRecommendable(){
    let news = this.refs.form.getValue();
    news.isPublished = true;
    news.isRecommendable = true;
    if(this.props.onSave) this.props.onSave(news);
    this._handleCancel();
  },

});

module.exports = NewsEditDialog;
